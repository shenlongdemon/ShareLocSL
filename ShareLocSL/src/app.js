/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import {
  AppRegistry
} from 'react-native';

import MainScreen from './screen/main';

import { StackNavigator } from 'react-navigation';
const ShareLocSL = StackNavigator({
  Main: { screen: MainScreen }
});

// if you are using create-react-native-app you don't need this line
AppRegistry.registerComponent('ShareLocSL', () => ShareLocSL);

// open shake menu : adb shell input keyevent 82