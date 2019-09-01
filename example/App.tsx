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
  LockedOrientation: {
    screen: require('./LockedOrientation').default,
    navigationOptions: {
      title: 'LockedOrientation',
    },
  },
  SelectOrientation: {
    screen: require('./SelectOrientation').default,
    navigationOptions: {
      title: 'SelectOrientation',
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
