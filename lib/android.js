import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
export var Priority;
(function (Priority) {
    Priority[Priority["PRIORITY_BALANCED_POWER_ACCURACY"] = 102] = "PRIORITY_BALANCED_POWER_ACCURACY";
    Priority[Priority["PRIORITY_HIGH_ACCURACY"] = 100] = "PRIORITY_HIGH_ACCURACY";
    Priority[Priority["PRIORITY_LOW_POWER"] = 104] = "PRIORITY_LOW_POWER";
    Priority[Priority["PRIORITY_NO_POWER"] = 105] = "PRIORITY_NO_POWER";
})(Priority || (Priority = {}));
export const Module = (Platform.OS === 'android') ? NativeModules.ReactNativeMoGeolocation : undefined;
export const Events = Module ? new NativeEventEmitter(NativeModules.ReactNativeMoOrientation) : undefined;
//# sourceMappingURL=android.js.map