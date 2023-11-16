import { EventData } from 'utils/model/event';
import { GeneralResponse } from './general';

export interface EventResponse extends GeneralResponse {
  data?: EventData;
}

export interface EventDataResponse extends GeneralResponse {
  data?: Array<EventData>;
}
