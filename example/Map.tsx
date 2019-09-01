import * as React from 'react';
import MapView, { Polyline } from 'react-native-maps';
import { NavigationInjectedProps } from 'react-navigation';
import { GeolocationResult } from 'react-native-mo-geolocation';

export default class Map extends React.PureComponent<NavigationInjectedProps<{ route: GeolocationResult[] }>, {}> {
  private interval: any;

  public componentDidMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 500);
  }

  public componentWillUnmount() {
    clearInterval(this.interval);
  }

  public render() {
    const route = this.props.navigation.getParam('route');
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: route.reduce((a, b) => a + b.latitude, 0) / route.length || 0,
          longitude: route.reduce((a, b) => a + b.longitude, 0) / route.length || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >

        <Polyline
          coordinates={route.slice()}
          strokeColor="red"
          strokeColors={route.map((i) => i.locationAccuracy < 10 ? 'green' : i.locationAccuracy < 20 ? 'yellow' : 'red')}
          strokeWidth={20}
        />

      </MapView>
    );
  }
}
