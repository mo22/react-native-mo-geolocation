# react-native-mo-geolocation

Geolocation and Background-Geolocation API

## Installation

Install just like your ordinary react-native module.

## Usage

Please check the [example/](example/) code.

```ts
import { Geolocation, GeolocationAccuracy, GeolocationPermissionStatus } from 'react-native-mo-geolocation';

if (await Geolocation.requestPermissions({ background: true }) === GeolocationPermissionStatus.DENIED) {
  Geolocation.showSettings();
}

const location = await Geolocation.get({ accuracy: GeolocationAccuracy.BEST });

const sub = Geolocation.observe({
  background: true,
  indicateBackground: true,
  accuracy: GeolocationAccuracy.BEST,
}).subscribe((pos) => {
  if (pos instanceof Error) {
    console.log('we had an error!');
  } else {
    console.log('new position', pos);
  }
});
// ...
sub.remove();
```

## Notes
- If you are using Android background mode, a background service will run
  showing a permanent notification. Use mipmaps/ic_background to change the
  icon. The text and behaviour is otherwise not customizable by android.

- For iOS you need to pass indicateBackground: true to prevent the app from
  getting terminated.
