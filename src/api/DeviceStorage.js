"use strict";
import React from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

async function DeviceStorage(key, value) {
    try {
        await AsyncStorage.setItem(
            key,
            value,
            (error) => {
                if (error) {
                    console.log('保存' + key + '内部存储异常！error=' + error)
                }
            }
        );
        console.log('保存' + key + '内部存储成功！value=' + value)
    } catch (e) {
        console.log('保存' + key + '内部存储异常！error=' + e)
        return false
        // saving error
    }
}

async function DeviceReadStorage(key) {
    try {
        let ret = ''
        await AsyncStorage.getItem(
            key,
            (error, result) => {
                if (error) {
                    console.log('获取内部存储' + key + '错误！erroe=', error)
                }
                ret = result
                console.log('获取内部存储' + key + '成功！Value=', result)
            }
        );
        return ret
    } catch (e) {
        console.log('获取内部存储' + key + 'Error=', e)
        return null
    }
}

async function DeviceRemoveStorage(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true
    } catch (e) {
        console.log('删除' + key + '内部存储异常！error=' + e)
        return false
    }
}

export { DeviceStorage, DeviceReadStorage, DeviceRemoveStorage }