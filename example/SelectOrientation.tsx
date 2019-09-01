import * as React from 'react';
import { ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationActions, NavigationInjectedProps } from 'react-navigation';
import { withOrientationDecorator, InterfaceOrientation, OrientationInjectedProps, OrientationLock } from 'react-native-mo-orientation';

function keysOf<T extends {}>(obj: T): (keyof T)[] {
  const objany = obj as any;
  return Object.keys(obj).filter((i) => typeof objany[objany[i]] !== 'number') as any;
}

@withOrientationDecorator
export default class SelectOrientation extends React.PureComponent<NavigationInjectedProps & OrientationInjectedProps> {
  public state = {
    portrait: true,
    landscapeLeft: true,
    landscapeRight: true,
  };

  public render() {
    return (
      <ScrollView>

        <OrientationLock allowed={new Set([
          ...(this.state.portrait ? [InterfaceOrientation.PORTRAIT] : []),
          ...(this.state.landscapeLeft ? [InterfaceOrientation.LANDSCAPELEFT] : []),
          ...(this.state.landscapeRight ? [InterfaceOrientation.LANDSCAPERIGHT] : []),
        ])} />

        <ListItem
          title="Orientation"
          rightTitle={String(this.props.orientation)}
        />

        {keysOf(InterfaceOrientation).map((i) => (
          <ListItem
            key={i}
            title={'Allow ' + i}
            switch={{
              value: this.state[InterfaceOrientation[i]],
              onValueChange: (value) => {
                this.setState({ [InterfaceOrientation[i]]: value });
              },
            }}
          />
        ))}

        <ListItem
          title="LockedOrientation"
          chevron={true}
          onPress={() => {
            this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'LockedOrientation' }));
          }}
        />

      </ScrollView>
    );
  }
}
