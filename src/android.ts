import { NativeModules, NativeEventEmitter, EmitterSubscription, Platform } from 'react-native';

export enum Priority {
  PRIORITY_BALANCED_POWER_ACCURACY = 102,
  PRIORITY_HIGH_ACCURACY = 100,
  PRIORITY_LOW_POWER = 104,
  PRIORITY_NO_POWER = 105,
}

export interface Config {
  priority: Priority;
  interval: number;
  smallestDisplacement: number;
  requestLocationUpdates: boolean;
  background: boolean;
}

export interface Module {
  setVerbose(verbose: boolean): void;
  getStatus(): Promise<{ locationAvailable: boolean; }>;
  setConfig(args: Config): void;
  openSettings(): void;
}

export type Event = {
  type: 'onLocationResult';
  time: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  bearing?: number;
  speed?: number;
  provider: string;
  bearingAccuracy?: number;
  verticalAccuracy?: number;
  speedAccuracy?: number;
} | {
  type: 'onLocationAvailability';
  locationAvailable: boolean;
};

export const Module = (Platform.OS === 'android') ? NativeModules.ReactNativeMoGeolocation as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoOrientation) as {
  addListener(eventType: 'ReactNativeMoGeolocation', listener: (event: Event) => void): EmitterSubscription;
} : undefined;
