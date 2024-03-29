"use strict";
import React from 'react';

import { ApiservBaseurl, ApiservBaseQuieturl } from '../../app.json';
import { LogInfo, LogException, LogError } from './Logger';
import AsyncStorage from '@react-native-community/async-storage';
import { DeviceStorage, DeviceReadStorage } from './DeviceStorage';

//封装的请求  带超时
const _timeout = 20 * 1000  //默认10秒
const _version = '1.0.0'



const baseurl = ApiservBaseurl

const _token = ''
const _timeoutForFileUpload = 120 * 1000  //默认120秒
const basequieturl = ApiservBaseQuieturl  //静音房接口地址

// initHttp();
// //初始化Http
// function initHttp() {
//     //将服务API地址存储到内部
//     try {
//         AsyncStorage.getItem(
//             'ApiservBaseurl',
//             (error, result) => {
//                 if (error) {
//                     console.log('获取内部存储' + key + '错误！erroe=', error)
//                 }
//                 console.log('获取内部存储' + key + '成功！Value=', result)
//                 if (!result) {
//                     // DeviceStorage('ApiservBaseurl', ApiservBaseurl)
//                 }
//             }
//         );
//     } catch (e) {
//         console.log('获取内部存储' + key + 'Error=', e)
//     }
// }

//GET请求
async function HTTPGET(url, token = _token, version = _version, timeout = _timeout) {
    let apiurl = await DeviceReadStorage('ApiservBaseurl')
    if (apiurl) {
        apiurl = apiurl + url
    } else {
        apiurl = baseurl + url
    }

    let dispatchTimeout = null;

    let timeoutPromise = new Promise((resolve, reject) => {
        dispatchTimeout = () => {
            reject('请求超时url=' + apiurl)
        }
    })
    let timer1 = setTimeout(() => {
        dispatchTimeout();
    }, timeout);


    console.info('请求服务：' + apiurl)
    let getPromise = new Promise((resolve, reject) => {
        fetch(apiurl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-version': version,
                'Authorization': token
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                resolve(responseData)
            })
            .catch((error) => {
                reject(error);
            })
    })
    return Promise.race([getPromise, timeoutPromise]);
}

//POST请求
async function HTTPPOST(url, body, token = _token, version = _version, timeout = _timeout) {
    //获取内部存储的API服务地址
    let apiurl = await DeviceReadStorage('ApiservBaseurl')
    if (apiurl) {
        apiurl = apiurl + url
    } else {
        apiurl = baseurl + url
    }

    let dispatchTimeout = null;
    let timeoutPromise = new Promise((resolve, reject) => {
        dispatchTimeout = () => {
            reject('请求超时url=' + apiurl)
        }
    })
    let timer1 = setTimeout(() => {
        dispatchTimeout();
    }, timeout);

    let newbody = (typeof (body) == 'string' ? body : JSON.stringify(body));

    console.info('请求服务：' + apiurl + ' 参数' + newbody)
    //LogInfo('POST请求服务端数据' + baseurl + url);
    let postPromise = new Promise((resolve, reject) => {
        fetch(apiurl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-version': version,
                'Authorization': token
            },
            body: newbody,
        })
            .then((response) => response.json())
            .then((responseData) => {
                resolve(responseData)
            })
            .catch((error) => {
                reject(error)
            });
    })

    return Promise.race([postPromise, timeoutPromise]);
}

//POST请求
async function HTTPPOST_Multipart(url, body, token = _token, version = _version, timeout = _timeout) {
    //获取内部存储的API服务地址
    let apiurl = await DeviceReadStorage('ApiservBaseurl')
    if (apiurl) {
        apiurl = apiurl + url
    } else {
        apiurl = baseurl + url
    }

    let dispatchTimeout = null;
    let timeoutPromise = new Promise((resolve, reject) => {
        dispatchTimeout = () => {
            reject('请求超时url=' + apiurl)
        }
    })
    let timer1 = setTimeout(() => {
        dispatchTimeout();
    }, timeout);

    console.info('请求服务：' + apiurl)
    let postPromise = new Promise((resolve, reject) => {

        fetch(apiurl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;charset=utf-8',
                'api-version': version,
                'Authorization': token
            },
            body: body,
        })
            .then(
                (response) =>
                    response.json()
            )
            .then((responseData) => {
                resolve(responseData);
            })
            .catch((error) => {
                reject(error);
            });
    })

    return Promise.race([postPromise, timeoutPromise]);
}

//POST请求
async function HTTPPOST_MultipartForBigFile(url, body, token = _token, version = _version, timeout = _timeoutForFileUpload) {
    //获取内部存储的API服务地址
    let apiurl = await DeviceReadStorage('ApiservBaseurl')
    if (apiurl) {
        apiurl = apiurl + url
    } else {
        apiurl = baseurl + url
    }

    let dispatchTimeout = null;
    let timeoutPromise = new Promise((resolve, reject) => {
        dispatchTimeout = () => {
            reject('请求超时url=' + apiurl)
        }
    })
    let timer1 = setTimeout(() => {
        dispatchTimeout();
    }, timeout);




    let postPromise = new Promise((resolve, reject) => {

        fetch(apiurl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;charset=utf-8',
                'api-version': version,
                'Authorization': token
            },
            body: body,
        })
            .then(
                (response) =>
                    response.json()
            )
            .then((responseData) => {
                resolve(responseData);
            })
            .catch((error) => {
                reject(error);
            });
    })

    return Promise.race([postPromise, timeoutPromise]);
}
//静音房POST请求
function HTTPPOST_Quite(url, body, token = _token, version = _version, timeout = _timeout) {

    let dispatchTimeout = null;
    let timeoutPromise = new Promise((resolve, reject) => {
        dispatchTimeout = () => {
            reject('请求超时')
        }
    })
    let timer1 = setTimeout(() => {
        dispatchTimeout();
    }, timeout);

    let newbody = (typeof (body) == 'string' ? body : JSON.stringify(body));

    LogInfo('POST请求服务端数据' + basequieturl + url);
    let postPromise = new Promise((resolve, reject) => {
        fetch(basequieturl + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-version': version,
                'Authorization': token
            },
            body: newbody,
        })
            .then((response) => response.json())
            .then((responseData) => {
                resolve(responseData)
            })
            .catch((error) => {
                reject(error)
            });
    })

    return Promise.race([postPromise, timeoutPromise]);
}

export { HTTPGET, HTTPPOST, HTTPPOST_Multipart, HTTPPOST_MultipartForBigFile, HTTPPOST_Quite }