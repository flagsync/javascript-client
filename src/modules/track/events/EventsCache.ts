import { TrackCache } from '~sdk/modules/track/cache/TrackCache';
import { ITrackCache } from '~sdk/modules/track/cache/types';
import { EventLogStrategy } from '~sdk/modules/track/events/EventsLogStrategy';

import { FsSettings } from '~config/types.internal';

import { SdkTrackEvent } from '~api/data-contracts';

const MESSAGE = {
  INVALID_NUMBER: 'Value must be a finite number, null, or undefined',
  INVALID_PROPERTIES: 'Properties must be a plain object, null, or undefined',
} as const;

export interface IEventsCache extends ITrackCache<SdkTrackEvent> {
  track(
    eventKey: string,
    value?: number,
    properties?: Record<string, any>,
  ): void;
}

export class EventsCache
  extends TrackCache<SdkTrackEvent>
  implements IEventsCache
{
  constructor(settings: FsSettings, onFullQueue: () => void) {
    super({
      log: settings.log,
      maxQueueSize: settings.tracking.events.maxQueueSize,
      logPrefix: 'events-cache',
      logStrategy: new EventLogStrategy(),
      onFullQueue: onFullQueue,
    });
  }

  track(
    eventKey: string,
    value?: number | null | undefined,
    properties?: Record<string, any> | null | undefined,
  ): void {
    if (
      !(typeof value === 'number' && !isNaN(value) && isFinite(value)) &&
      value !== null &&
      value !== undefined
    ) {
      this.log.warn(this.buildMessage(MESSAGE.INVALID_NUMBER));
    }

    // Validate properties to ensure it's a plain object, null, or undefined
    if (properties !== null && properties !== undefined) {
      if (!(typeof properties === 'object' && !Array.isArray(properties))) {
        this.log.warn(this.buildMessage(MESSAGE.INVALID_PROPERTIES));
      }
      // Check for inclusions of prototypes or methods
      if (Object.getPrototypeOf(properties) !== Object.prototype) {
        this.log.warn(this.buildMessage(MESSAGE.INVALID_PROPERTIES));
      }
    }

    const event: SdkTrackEvent = {
      eventKey,
      value,
      properties,
      timestamp: new Date().toISOString(),
    };

    this.push(event);
  }
}