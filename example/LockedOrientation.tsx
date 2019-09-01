import * as React from 'react';
import { ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationInjectedProps } from 'react-navigation';
import { OrientationInjectedProps, withOrientationDecorator, OrientationLock } from 'react-native-mo-orientation';

@withOrientationDecorator
export default class LockedOrientation extends React.PureComponent<NavigationInjectedProps & OrientationInjectedProps> {
  public render() {
    return (
      <ScrollView>

        <OrientationLock allowed="portrait" />

        <ListItem
          title="Orientation"
          rightTitle={String(this.props.orientation)}
        />

      </ScrollView>
    );
  }
}
