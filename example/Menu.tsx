import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationActions, NavigationInjectedProps } from 'react-navigation';
import { Geolocation, GeolocationPermissionStatus } from 'react-native-mo-geolocation';

export default class Menu extends React.PureComponent<NavigationInjectedProps, Menu['state']> {
  public state: {
    permission?: GeolocationPermissionStatus;
    background?: boolean;
  } = {
  };

  public render() {
    return (
      <ScrollView>

        <ListItem
          title="GpsInfo"
          chevron={true}
          onPress={() => {
            this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'GpsInfo' }));
          }}
        />

        <View style={{ marginTop: 10 }}>
          <Text>Permissions:</Text>
          <ListItem
            title="background"
            switch={{
              value: this.state.background,
              onValueChange: (value) => this.setState({ background: value }),
            }}
          />
          <ListItem
            title="permission"
            rightTitle={`${this.state.permission}`}
            onPress={() => {
              Geolocation.showSettings();
            }}
          />
          <ListItem
            title="request permissions"
            onPress={async () => {
              const res = await Geolocation.requestPermissions({ background: this.state.background });
              this.setState({ permission: res });
            }}
          />
          <ListItem
            title="get permission status"
            onPress={async () => {
              const res = await Geolocation.getPermissionStatus({ background: this.state.background });
              this.setState({ permission: res });
            }}
          />
          <ListItem
            title="open settings"
            onPress={async () => {
              await Geolocation.openSettings();
            }}
          />
        </View>

      </ScrollView>
    );
  }
}
