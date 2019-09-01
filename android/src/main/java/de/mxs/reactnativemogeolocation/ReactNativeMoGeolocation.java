package de.mxs.reactnativemogeolocation;

import android.app.Activity;
import android.content.Intent;
import android.location.Location;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.ContextCompat;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationAvailability;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;

import javax.annotation.Nonnull;

public final class ReactNativeMoGeolocation extends ReactContextBaseJavaModule {

    private FusedLocationProviderClient fusedLocationClient;
    private boolean verbose = false;

    private LocationCallback locationCallback = new LocationCallback() {
        @Override
        public void onLocationResult(LocationResult locationResult) {
            if (verbose) Log.i("MoGeolocation", "onLocationResult " + locationResult);
            if (locationResult == null) {
                return;
            }
            for (Location location : locationResult.getLocations()) {
                WritableMap args = Arguments.createMap();
                args.putString("type", "onLocationResult");
                args.putDouble("time", location.getTime());
                args.putDouble("latitude", location.getLatitude());
                args.putDouble("longitude", location.getLongitude());
                if (location.hasAccuracy()) {
                    args.putDouble("accuracy", location.getAccuracy());
                }
                if (location.hasAltitude()) {
                    args.putDouble("altitude", location.getAltitude());
                }
                if (location.hasBearing()) {
                    args.putDouble("bearing", location.getBearing());
                }
                if (location.hasSpeed()) {
                    args.putDouble("speed", location.getSpeed());
                }
                args.putString("provider", location.getProvider());
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    if (location.hasBearingAccuracy()) {
                        args.putDouble("bearingAccuracy", location.getBearingAccuracyDegrees());
                    }
                    if (location.hasVerticalAccuracy()) {
                        args.putDouble("verticalAccuracy", location.getVerticalAccuracyMeters());
                    }
                    if (location.hasSpeedAccuracy()) {
                        args.putDouble("speedAccuracy", location.getSpeedAccuracyMetersPerSecond());
                    }
                }
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("ReactNativeMoGeolocation", args);
            }
        }

        @Override
        public void onLocationAvailability(LocationAvailability locationAvailability) {
            if (verbose) Log.i("MoGeolocation", "onLocationAvailability " + locationAvailability);
            WritableMap args = Arguments.createMap();
            args.putString("type", "onLocationAvailability");
            args.putBoolean("locationAvailable", locationAvailability.isLocationAvailable());
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("ReactNativeMoGeolocation", args);
        }
    };

    ReactNativeMoGeolocation(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public @Nonnull
    String getName() {
        return "ReactNativeMoGeolocation";
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void setVerbose(boolean verbose) {
        this.verbose = verbose;
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void getStatus(final Promise promise) {
        if (verbose) Log.i("MoGeolocation", "getStatus");
        if (fusedLocationClient == null) {
            fusedLocationClient = LocationServices.getFusedLocationProviderClient(getReactApplicationContext());
        }
        fusedLocationClient.getLocationAvailability().addOnSuccessListener(locationAvailability -> {
            WritableMap args = Arguments.createMap();
            args.putBoolean("locationAvailable", locationAvailability.isLocationAvailable());
            if (verbose) Log.i("MoGeolocation", "getStatus -> " + args);
            promise.resolve(args);
        }).addOnFailureListener(promise::reject);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void setConfig(ReadableMap args) {
        if (verbose) Log.i("MoGeolocation", "setConfig " + args);
        if (fusedLocationClient == null) {
            fusedLocationClient = LocationServices.getFusedLocationProviderClient(getReactApplicationContext());
        }

        if (args.getBoolean("requestLocationUpdates")) {
            LocationRequest request = new LocationRequest();
            request.setPriority(args.getInt("priority"));
            request.setInterval(args.getInt("interval"));
            request.setSmallestDisplacement((float)args.getDouble("smallestDisplacement"));
            fusedLocationClient.requestLocationUpdates(request, this.locationCallback, null);
        } else {
            fusedLocationClient.removeLocationUpdates(this.locationCallback);
        }

        if (args.getBoolean("requestLocationUpdates") && args.getBoolean("background")) {
            ContextCompat.startForegroundService(getReactApplicationContext(), new Intent(getReactApplicationContext(), ReactNativeMoGeolocationService.class));
        } else {
            getReactApplicationContext().stopService(new Intent(getReactApplicationContext(), ReactNativeMoGeolocationService.class));
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void openSettings(final Promise promise) {
        if (verbose) Log.i("MoGeolocation", "openSettings");
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.fromParts("package", getReactApplicationContext().getPackageName(), null));
        final Holder<ActivityEventListener> listenerHolder = new Holder<>();
        listenerHolder.value = new ActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                if (requestCode == 123413) {
                    promise.resolve(null);
                    getReactApplicationContext().removeActivityEventListener(listenerHolder.value);
                }
            }
            @Override
            public void onNewIntent(Intent intent) {
            }
        };
        getReactApplicationContext().addActivityEventListener(listenerHolder.value);
        getReactApplicationContext().startActivityForResult(intent, 123413, null);
    }
}
