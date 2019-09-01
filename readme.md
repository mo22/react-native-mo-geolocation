# react-native-mo-geolocation

TODO

## Usage

```ts
import { Orientation, OrientationConsumer, OrientationLock } from 'react-native-mo-orientation';

console.log(Orientation.interfaceOrientation.value);

const sub = Orientation.interfaceOrientation.subscribe((orientation) => {
});
// ...
sub.release();

todo
return (
  <OrientationLock allowed="portrait" />
  <OrientationLock allowed="any" />
);

return (
  <OrientationConsumer>
    {(orientation) => (
      <SomeObject orientation={orientation} />
    )}
  </OrientationConsumer>
)
```

## Notes
- If you are using Android background mode, a background service will run
  showing a permanent notification. Use mipmaps/ic_background to change the
  icon. The text and behaviour is otherwise not customizable by android.

- For iOS you need to pass indicateBackground: true to prevent the app from
  getting terminated.

## TODO
- [ ] docs
- [ ] android check permission status unknown / PermissionsAndroid.RESULTS
- [ ] fallback to navigator.geolocation api?
- [ ] example app: keep GpsInfo page loaded?
