#import <React/RCTEventEmitter.h>
#import <CoreLocation/CoreLocation.h>

@interface ReactNativeMoGeolocation : RCTEventEmitter <CLLocationManagerDelegate> {
    BOOL _verbose;
}
@property CLLocationManager* locationManager;
@property BOOL verbose;
@end

@implementation ReactNativeMoGeolocation

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[ @"ReactNativeMoGeolocation" ];
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (BOOL)verbose {
    return _verbose;
}
RCT_EXPORT_METHOD(setVerbose:(BOOL)verbose) {
    _verbose = verbose;
}
    
RCT_EXPORT_METHOD(getStatus:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (self.verbose) NSLog(@"ReactNativeMoGeolocation.getStatus");
    NSMutableDictionary* res = [NSMutableDictionary new];
    res[@"locationServicesEnabled"] = @([CLLocationManager locationServicesEnabled]);
    res[@"significantLocationChangeMonitoringAvailable"] = @([CLLocationManager significantLocationChangeMonitoringAvailable]);
    res[@"headingAvailable"] = @([CLLocationManager headingAvailable]);
    res[@"deferredLocationUpdatesAvailable"] = @([CLLocationManager deferredLocationUpdatesAvailable]);
    res[@"isRangingAvailable"] = @([CLLocationManager isRangingAvailable]);
    res[@"authorizationStatus"] = @([CLLocationManager authorizationStatus]);
    NSArray<NSString*>* backgroundModes = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIBackgroundModes"];
    if (!backgroundModes) backgroundModes = @[];
    res[@"backgroundModes"] = backgroundModes;
    if (self.verbose) NSLog(@"ReactNativeMoGeolocation.getStatus -> %@", res);
    resolve(res);
}

RCT_EXPORT_METHOD(requestAuthorization:(NSDictionary*)args) {
    if (self.verbose) NSLog(@"ReactNativeMoGeolocation.requestAuthorization %@", args);
    if (!self.locationManager) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
    }
    if (args[@"always"]) {
        [self.locationManager requestAlwaysAuthorization];
    } else {
        [self.locationManager requestWhenInUseAuthorization];
    }
}

RCT_EXPORT_METHOD(openSettings) {
    if (self.verbose) NSLog(@"ReactNativeMoGeolocation.openSettings");
    if (@available(iOS 10.0, *)) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString] options:@{} completionHandler:nil];
    } else {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
    }
}

RCT_EXPORT_METHOD(setConfig:(NSDictionary*)args) {
    if (self.verbose) NSLog(@"ReactNativeMoGeolocation.setConfig %@", args);
    if (!self.locationManager) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
    }
    self.locationManager.desiredAccuracy = [args[@"desiredAccuracy"] doubleValue];
    self.locationManager.distanceFilter = [args[@"distanceFilter"] doubleValue];
    self.locationManager.activityType = [args[@"activityType"] intValue];
    self.locationManager.allowsBackgroundLocationUpdates = [args[@"allowsBackgroundLocationUpdates"] boolValue];
    if (@available(iOS 11.0, *)) {
        self.locationManager.showsBackgroundLocationIndicator = [args[@"showsBackgroundLocationIndicator"] boolValue];
    }
    if ([args[@"startUpdatingLocation"] boolValue]) {
        [self.locationManager startUpdatingLocation];
    } else {
        [self.locationManager stopUpdatingLocation];
    }
    if ([args[@"startMonitoringSignificantLocationChanges"] boolValue]) {
        [self.locationManager startMonitoringSignificantLocationChanges];
    } else {
        [self.locationManager stopMonitoringSignificantLocationChanges];
    }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
    if (self.verbose) NSLog(@"ReactNativeMoGeolocation.didUpdateLocations %@", locations);
    for (CLLocation* location in locations) {
        [self sendEventWithName:@"ReactNativeMoGeolocation" body:@{
            @"type": @"didUpdateLocations",
            @"timestamp": @(floor([location.timestamp timeIntervalSince1970] * 1000)),
            @"coordinate": @{
                @"latitude": @(location.coordinate.latitude),
                @"longitude": @(location.coordinate.longitude),
            },
            @"verticalAccuracy": @(location.verticalAccuracy),
            @"altitude": @(location.altitude),
            @"horizontalAccuracy": @(location.horizontalAccuracy),
            @"speed": @(location.speed),
            @"course": @(location.course),
            @"floor": location.floor ? @{
                @"level": @(location.floor.level)
            } : [NSNull null],
        }];
    }
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    if (self.verbose) NSLog(@"ReactNativeMoGeolocation.didFailWithError %@", error);
    [self sendEventWithName:@"ReactNativeMoGeolocation" body:@{
        @"type": @"didFailWithError",
        @"error": [error localizedDescription],
    }];
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    if (self.verbose) NSLog(@"ReactNativeMoGeolocation.didChangeAuthorizationStatus %d", status);
    [self sendEventWithName:@"ReactNativeMoGeolocation" body:@{
        @"type": @"didChangeAuthorizationStatus",
        @"status": @(status),
    }];
}

@end
