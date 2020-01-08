/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Provider } from 'react-redux'

import configureStore from './src/store/ConfigureStore';
const store = configureStore();

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import router from './src/router/index';

const AppNavigator = createStackNavigator(
  router,
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
);
const AppContainer = createAppContainer(AppNavigator);

const App: () => React$Node = () => {
  console.log('加载应用界面');
  return Platform.OS == "ios" ? (
    <>
      <Provider store={store}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <AppContainer />
        </SafeAreaView>
      </Provider>
    </>
  ) : (
      <>
        <Provider store={store}>
          <StatusBar barStyle="dark-content" />
          <AppContainer />
        </Provider>
      </>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;
