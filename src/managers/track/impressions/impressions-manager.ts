import { FsSettings } from '~config/types.internal';

import { apiClientFactory } from '~api/clients/api-client';
import { ServiceErrorFactory } from '~api/error/service-error-factory';

import { FsEvent, IEventManager } from '~managers/event/types';
import { ImpressionsCache } from '~managers/track/impressions/impressions-cache';
import {
  IImpressionsManager,
  PartialTrackImpression,
} from '~managers/track/impressions/types';

const logPrefix = 'impressions-manager';

const START_DELAY_MS = 3000;

export function impressionsManager(
  settings: FsSettings,
  eventManager: IEventManager,
): IImpressionsManager {
  const {
    log,
    context,
    tracking: {
      impressions: { pushRate },
    },
  } = settings;

  const cache = new ImpressionsCache(settings, flushQueue);

  const { track } = apiClientFactory(settings);

  let timeout: number | NodeJS.Timeout;
  const interval = pushRate * 1000;

  async function batchSend() {
    if (cache.isEmpty()) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(batchSend, interval);
      return;
    }

    const sendQueue = cache.pop();

    track
      .sdkTrackControllerPostBatchImpressions({
        context,
        impressions: sendQueue,
      })
      .then(() => {
        log.debug(`${logPrefix}: batch sent ${sendQueue.length} impressions`);
      })
      .catch(async (e: unknown) => {
        const error = ServiceErrorFactory.create(e);
        log.error(`${logPrefix}: batch send failed`, [
          error.path,
          error.errorCode,
          error.message,
        ]);
        eventManager.emit(FsEvent.ERROR, {
          type: 'api',
          error: error,
        });
      })
      .finally(() => {
        timeout = setTimeout(batchSend, interval);
      });
  }

  async function flushQueue() {
    log.debug(`${logPrefix}: flushing queue`);
    await batchSend();
  }

  function start() {
    log.debug(`${logPrefix}: submitter starting in ${START_DELAY_MS}ms`);
    timeout = setTimeout(batchSend, START_DELAY_MS);
  }

  function stop() {
    flushQueue().then(() => {
      if (timeout) {
        log.debug(`${logPrefix}: gracefully stopping submitter`);
        clearTimeout(timeout);
      }
    });
  }

  function publicTrack(impression: PartialTrackImpression) {
    cache.track({
      ...impression,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    start,
    stop,
    softStop: () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    },
    pop: () => cache.pop(),
    isEmpty: () => cache.isEmpty(),
    track: publicTrack,
  };
}
