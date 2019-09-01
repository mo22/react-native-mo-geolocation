import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator({
  Menu: {
    screen: require('./Menu').default,
    navigationOptions: {
      title: 'Menu',
    },
  },
  GpsInfo: {
    screen: require('./GpsInfo').default,
    navigationOptions: {
      title: 'GpsInfo',
    },
  },
  Map: {
    screen: require('./Map').default,
    navigationOptions: {
      title: 'Map',
    },
  },
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.PureComponent<{}> {
  public render() {
    return (
      <AppContainer />
    );
  }
}
