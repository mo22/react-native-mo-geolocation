import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationActions, NavigationInjectedProps } from 'react-navigation';
import { Geolocation, GeolocationResult, GeolocationAccuracy } from 'react-native-mo-geolocation';
import { Releaseable } from 'mo-core';
import { Fs } from 'react-native-mo-fs';

function keysOf<T extends {}>(obj: T): (keyof T)[] {
  const objany = obj as any;
  return Object.keys(obj).filter((i) => typeof objany[objany[i]] !== 'number') as any;
}

Geolocation.setVerbose(true);

export const history: GeolocationResult[] = [];

export const state: GeolocationPageState = {
  background: false,
  indicateBackground: false,
  accuracy: GeolocationAccuracy.BEST,
};

export let subscription: Releaseable|undefined;

export interface GeolocationPageState {
  error?: Error|string;
  position?: GeolocationResult;
  background: boolean;
  indicateBackground: boolean;
  accuracy: GeolocationAccuracy;
  home?: GeolocationResult;
}

export default class GpsTest extends React.PureComponent<NavigationInjectedProps> {
  public state: GeolocationPageState = {
    background: false,
    indicateBackground: false,
    accuracy: GeolocationAccuracy.BEST,
  };

  private subscription?: Releaseable;

  public constructor(props: NavigationInjectedProps) {
    super(props);
    Object.assign(this.state, state);
    this.subscription = subscription;
  }

  public componentWillUnmount() {
    subscription = this.subscription;
    Object.assign(state, this.state);
    if (this.subscription) {
      this.subscription.release();
      this.subscription = undefined;
    }
  }

  public render() {
    return (
      <ScrollView>

        {this.state.position && (
          <View style={{ marginTop: 10 }}>
            <Text>Position:</Text>
            <ListItem
              title="time"
              rightTitle={new Date(this.state.position.time).toISOString()}
            />
            {this.state.position.latitude !== undefined && (
              <ListItem
                title="latitude"
                rightTitle={`${this.state.position.latitude.toFixed(6)}`}
              />
            )}
            {this.state.position.longitude !== undefined && (
              <ListItem
                title="longitude"
                rightTitle={`${this.state.position.longitude.toFixed(6)}`}
              />
            )}
            {this.state.position.locationAccuracy !== undefined && (
              <ListItem
                title="locationAccuracy"
                rightTitle={`${this.state.position.locationAccuracy.toFixed(6)}`}
              />
            )}
            {this.state.position.altitude !== undefined && (
              <ListItem
                title="altitude"
                rightTitle={`${this.state.position.altitude.toFixed(6)}`}
              />
            )}
            {this.state.position.altitudeAccuracy !== undefined && (
              <ListItem
                title="altitudeAccuracy"
                rightTitle={`${this.state.position.altitudeAccuracy.toFixed(6)}`}
              />
            )}
            {this.state.position.course !== undefined && (
              <ListItem
                title="course"
                rightTitle={`${this.state.position.course.toFixed(6)}`}
              />
            )}
            {this.state.position.speed !== undefined && (
              <ListItem
                title="speed"
                rightTitle={`${this.state.position.speed.toFixed(6)}`}
              />
            )}
          </View>
        )}

        {this.state.error && (
          <View style={{ marginTop: 10 }}>
            <ListItem
              containerStyle={{ backgroundColor: 'red' }}
              title="error"
              rightTitle={`${this.state.error}`}
            />
          </View>
        )}

        {this.state.position && this.state.position.latitude !== undefined && (
          <View style={{ marginTop: 10 }}>
            <Text>Home:</Text>
            <ListItem
              title="distance / heading"
              onPress={() => {
                this.setState({ home: this.state.position });
              }}
              rightTitle={
                this.state.home ? (
                  Geolocation.getDistance(this.state.home, this.state.position).toFixed(0) + 'm ' +
                  Geolocation.getBearing(this.state.home, this.state.position).toFixed(0) + 'deg'
                ) : (
                  'click to set home'
                )
              }
            />
          </View>
        )}

        <View style={{ marginTop: 10 }}>
          <Text>Settings:</Text>
          <ListItem
            title="background"
            switch={{
              value: this.state.background,
              onValueChange: (value) => this.setState({ background: value }),
            }}
          />
          <ListItem
            title="indicate background"
            switch={{
              value: this.state.indicateBackground,
              onValueChange: (value) => this.setState({ indicateBackground: value }),
            }}
          />
          <ListItem
            title="accuracy"
            buttonGroup={{
              selectedIndex: keysOf(GeolocationAccuracy).map((i) => GeolocationAccuracy[i]).indexOf(this.state.accuracy),
              buttons: keysOf(GeolocationAccuracy),
              onPress: (selectedIndex) => {
                this.setState({ accuracy: GeolocationAccuracy[keysOf(GeolocationAccuracy)[selectedIndex]] });
              },
            }}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          {!this.subscription && (
            <ListItem
              title="start"
              onPress={async () => {
                this.setState({ error: undefined });
                history.splice(0, history.length);
                this.subscription = Geolocation.observe({
                  accuracy: this.state.accuracy,
                  background: this.state.background,
                  indicateBackground: this.state.indicateBackground,
                }).subscribe(async (rs) => {
                  if (rs instanceof Error) {
                    this.setState({ error: rs });
                    await Fs.appendTextFile(
                      Fs.paths.docs + '/gps.csv',
                      new Date().toISOString() + ';' + 'error' + ';' + String(rs) + '\n'
                    );
                  } else {
                    history.push(rs);
                    this.setState({ position: rs });
                    await Fs.appendTextFile(
                      Fs.paths.docs + '/gps.csv',
                      new Date(rs.time).toISOString() + ';' + 'gps' + ';' + rs.latitude + ';' + rs.longitude + ';' + rs.altitude + ';' + (rs.course || '') + ';' + (rs.speed || '') + ';' + (rs.locationAccuracy || '') + ';' + (rs.altitudeAccuracy || '') + '\n'
                    );
                  }
                });
                await Fs.appendTextFile(
                  Fs.paths.docs + '/gps.csv',
                  new Date().toISOString() + ';' + 'start' + '\n'
                );
              }}
            />
          )}
          {this.subscription && (
            <ListItem
              title="stop"
              onPress={async () => {
                if (this.subscription) {
                  this.subscription.release();
                  this.subscription = undefined;
                }
                this.setState({ error: undefined, position: undefined });
                await Fs.appendTextFile(
                  Fs.paths.docs + '/gps.csv',
                  new Date().toISOString() + ';' + 'stop' + '\n'
                );
              }}
            />
          )}
          <ListItem
            title="get once"
            onPress={async () => {
              this.setState({ error: undefined });
              try {
                const rs = await Geolocation.get({
                  accuracy: this.state.accuracy,
                });
                this.setState({ position: rs });
              } catch (e) {
                this.setState({ error: e });
              }
            }}
          />
          <ListItem
            title="share gps file"
            onPress={async () => {
              await Fs.shareFile(Fs.paths.docs + '/gps.csv');
            }}
          />
          <ListItem
            title="delete gps file"
            onPress={async () => {
              const stat = await Fs.stat(Fs.paths.docs + '/gps.csv');
              if (stat.exists) {
                await Fs.deleteFile(Fs.paths.docs + '/gps.csv');
              }
            }}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <ListItem
            title="map"
            onPress={() => {
              this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Map', params: { route: history } }));
            }}
          />
        </View>

      </ScrollView>
    );
  }
}
