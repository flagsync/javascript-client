import { SdkTrackEvent } from '~api/data-contracts';

export interface IEventsManager {
  start: () => void;
  stop: () => void;
  pop: () => SdkTrackEvent[];
  softStop: () => void;
  track: (
    eventKey: string,
    value?: number | null | undefined,
    properties?: Record<string, any>,
  ) => void;
}
