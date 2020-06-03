/**
 * @format
 */

import { AppRegistry, Alert } from 'react-native';

import { Provider } from 'react-redux'

import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { LogInfo, LogException } from './src/api/Logger';

import App from './App';
import { name as appName } from './app.json';



const errorHandler = (e, isFatal) => {
    if (isFatal) {

        LogException('全局异常', '异常信息：' + e.name + ' , ' + e.message);
        Alert.alert(
            'Unexpected error occurred',
            `
          Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
          We have reported this to our team ! Please close the app and start again!
          `,
            [{
                text: 'Close',
                onPress: () => {
                }
            }]
        );
    } else {
        LogException('全局异常', '异常信息：' + e.name + ' , ' + e.message);
        //console.log(e); // So that we can see it in the ADB logs in case of Android if needed
    }
};

setJSExceptionHandler(errorHandler, true);
setNativeExceptionHandler(exceptionString => {
    LogException('全局异常', '异常信息：' + exceptionString);
    console.log('全局异常：' + exceptionString);
});

global.ErrorUtils.setGlobalHandler(error => {
    if (error && error != null && JSON.stringify(error) != '"null"') {
        LogException('全局异常', '异常信息：' + error.name + ' , ' + error.message + JSON.stringify(error));
        console.log('ErrorUtils发现了异常错误，为了避免了崩溃，具体报错信息：');
        console.log(error.name, error.message, JSON.stringify(error));
    }
}, true);

AppRegistry.registerComponent(appName, () => App);
