/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import MultiColumnExample from './containers/FlatList-multiColumn'

AppRegistry.registerComponent(appName, () => MultiColumnExample);
// AppRegistry.registerComponent(appName, () => () => null);
