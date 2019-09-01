import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
export var AuthorizationStatus;
(function (AuthorizationStatus) {
    AuthorizationStatus[AuthorizationStatus["NotDetermined"] = 0] = "NotDetermined";
    AuthorizationStatus[AuthorizationStatus["Restricted"] = 1] = "Restricted";
    AuthorizationStatus[AuthorizationStatus["Denied"] = 2] = "Denied";
    AuthorizationStatus[AuthorizationStatus["AuthorizedAlways"] = 3] = "AuthorizedAlways";
    AuthorizationStatus[AuthorizationStatus["AuthorizedWhenInUse"] = 4] = "AuthorizedWhenInUse";
})(AuthorizationStatus || (AuthorizationStatus = {}));
export const Module = (Platform.OS === 'ios') ? NativeModules.ReactNativeMoGeolocation : undefined;
export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoGeolocation) : undefined;
//# sourceMappingURL=ios.js.map