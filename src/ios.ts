import { NativeModules, NativeEventEmitter, EmitterSubscription, Platform } from 'react-native';

export enum AuthorizationStatus {
  NotDetermined = 0,
  Restricted = 1,
  Denied = 2,
  AuthorizedAlways = 3,
  AuthorizedWhenInUse = 4,
}

export interface Config {
  desiredAccuracy: number;
  distanceFilter: number;
  activityType: number;
  allowsBackgroundLocationUpdates: boolean;
  showsBackgroundLocationIndicator: boolean;
  startUpdatingLocation: boolean;
  startMonitoringSignificantLocationChanges: boolean;
}

export interface Status {
  locationServicesEnabled: boolean;
  significantLocationChangeMonitoringAvailable: boolean;
  headingAvailable: boolean;
  deferredLocationUpdatesAvailable: boolean;
  isRangingAvailable: boolean;
  authorizationStatus: AuthorizationStatus;
  backgroundModes: string[];
}

export interface Module {
  setVerbose(verbose: boolean): void;
  getStatus(): Promise<Status>;
  requestAuthorization(args: { always?: boolean }): void;
  openSettings(): void;
  setConfig(args: Config): void;
}

export type Event = {
  type: 'didChangeAuthorizationStatus';
  status: AuthorizationStatus;
} | {
  type: 'didFailWithError';
  error: string;
} | {
  type: 'didUpdateLocations';
  timestamp: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  verticalAccuracy: number;
  altitude: number;
  horizontalAccuracy: number;
  speed: number;
  course: number;
  floor?: {
    level: number;
  };
};

export const Module = (Platform.OS === 'ios') ? NativeModules.ReactNativeMoGeolocation as Module : undefined;

export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoGeolocation) as {
  addListener(eventType: 'ReactNativeMoGeolocation', listener: (event: Event) => void): EmitterSubscription;
} : undefined;
