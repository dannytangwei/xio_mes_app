"use strict";
import React from 'react';
import * as TYPES from '../ActionType';
import { HTTPPOST } from '../../api/HttpRequest';

/**
 * 获取天气预报的action
 */
export const login = (user) => {
    return dispatch => {
        dispatch(isLogining());
        // 模拟用户登录

        let result = HTTPPOST('/sm/login', user)
            .then((res) => {
                if (res.code == 0) {
                    dispatch(loginSuccess(true, res.data, res.token)); // 登录请求完成
                } else {
                    dispatch(loginError('错误' + res.msg)); // 登录请求完成
                }
            }).catch((error) => {
                dispatch(loginError('异常：' + error)); // 登录请求出错
            })
    }
}

/** 
 * 登出系统
*/
export const loginout = () => {
    return dispatch => {
        dispatch(logOut());
        // 模拟用户登录
    }
}

//按
export const loginbynfc = (nfcid) => {
    return dispatch => {
        dispatch(isLogining());
        // 模拟用户登录

        let result = HTTPPOST('/sm/loginbynfc', nfcid)
            .then((res) => {
                if (res.code == 0) {
                    dispatch(loginSuccess(true, res.data, res.token)); // 登录请求完成
                } else {
                    dispatch(loginError(res.msg)); // 登录请求完成
                }
            }).catch((error) => {
                dispatch(loginError(error)); // 登录请求出错
            })
    }
}

//登陆结束
export const end = () => {
    return dispatch => {
        dispatch(endLogining());
    }
}

/**
 * 这里会通过dispatch把action送给reducer，TYPE是判断拿到的是哪个action。
 */

function endLogining() {
    return {
        type: TYPES.LOGIN_IN_END
    }
}

function isLogining() {
    return {
        type: TYPES.LOGIN_IN_DOING
    }
}

function loginSuccess(isSuccess, user, token) {
    console.log('loginSuccess!');
    return {
        type: TYPES.LOGIN_IN_DONE,
        user: user,
        token: token
    }
}

function loginError(err) {
    console.log('loginError', err);
    return {
        type: TYPES.LOGIN_IN_ERROR,
        message: err
    }
}


function logOut() {
    console.log('loginOut');
    return {
        type: TYPES.LOGIN_OUT 
    }
}

