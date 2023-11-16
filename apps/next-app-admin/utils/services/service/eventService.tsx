import { Context } from 'react';
import { EventDataResponse, EventResponse } from 'types/event';
import { Contextualizer } from 'utils/services//contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';
import { EventData } from 'utils/model/event';

export interface IEventService {
  getAllEvents(
    limit?: number,
    offset?: number
  ): Promise<EventDataResponse>;
  registerEvent(eventData: EventData): Promise<any>;
  updateEvent(event: EventData): Promise<EventResponse>;
  uploadIcon(file: FormData): Promise<string>;
  deleteEvent(id: string): Promise<EventResponse>;
}

export const EventServiceContext: Context<
  IEventService | undefined
> = Contextualizer.createContext(ProvidedServices.EventService);

export const useUserServices = () =>
  Contextualizer.use<IEventService>(ProvidedServices.EventService);

export const EventService = ({ children }: any) => {
  const eventService = {
    async uploadIcon(formData: FormData) {
      try {
        const response = await axiosInstance.post(`/files/`, formData, {
          headers: {
            'content-type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async getAllEvents(
      limit: number = 0,
      offset: number = 0
    ): Promise<EventDataResponse> {
      try {
        const response = await axiosInstance.get(
          `/events?limit=${limit}&offset=${offset}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async registerEvent(eventData: any): Promise<any> {
      try {
        const res = await axiosInstance.post('/events/', {
          ...eventData,
        });

        return res.data;
      } catch (err) {
        console.log(err);
      }
    },

    async updateEvent(event: EventData): Promise<EventResponse> {
      try {
        const response = await axiosInstance.put(`/events/${event._id}`, {
          ...event,
        });

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async deleteEvent(id: string): Promise<EventResponse> {
      try {
        const response = await axiosInstance.delete(`/events/${id}`);

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <EventServiceContext.Provider value={eventService}>
      {children}
    </EventServiceContext.Provider>
  );
};
