"use strict";
import React from 'react';
import { OSSMinio } from '../../app.json';

var Minio = require('minio')

var minioClient = new Minio.Client(OSSMinio);

class XioliftOSS {
    constructor() {
        this.minioClient = minioClient
    }

    //上传文件
    uploadFile() {

    }
    //初始化
    initBucket() {

    }


}

export default new XioliftOSS()