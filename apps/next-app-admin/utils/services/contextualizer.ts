import { Context, createContext, useContext } from 'react';
import { ProvidedServices } from './providedServices';

const contexts = new Map<ProvidedServices, Context<any | undefined>>();

export const Contextualizer = {
  createContext: <T>(service: ProvidedServices): Context<T | undefined> => {
    const context = createContext<T | undefined>(undefined);
    contexts.set(service, context);
    return context;
  },

  use: <T>(services: ProvidedServices): T => {
    const context = contexts.get(services);
    if (context === undefined) {
      throw new Error(`${ProvidedServices[services]} was not created`);
    }
    const service = useContext(context);

    if (service === undefined) {
      throw new Error(
        `You must use ${ProvidedServices[services]} from within its service`
      );
    }
    return service;
  },

  clear() {
    contexts.clear();
  },
};
