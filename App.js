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
import SQLite from './src/api/SQLite';
import { LogInfo, LogException } from './src/api/Logger';
import BackgroundJob from "react-native-background-job";


const AppNavigator = createStackNavigator(
  router,
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
);
const AppContainer = createAppContainer(AppNavigator);
export default class App extends Component {
  componentDidMount() {

    //清空缓存数据
    var sqLite = new SQLite();
    sqLite.clean_DBData();
    //暂时停用此功能，在局域网内比较麻烦


    BackgroundJob.cancelAll();
    LogInfo('后台任务被清除！', '');
    //初始化全局参数

  }
  render() {
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
  }
}


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


