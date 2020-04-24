import Login from '../view/Login';
import IndexPage from '../view/IndexPage';

import ScanPoInWarehouse from '../viewbiz/mm/ScanPoInWarehouse';
import PoinByLinePage from '../viewbiz/mm/PoinByLine';
import PSDListScreen from '../viewbiz/PSDList';
import ScanWoClose from '../viewbiz/pp/WoClose';
import ScanWoBoxClose from '../viewbiz/pp/ScanWoBoxClose';
import ScanBoxInStorage from '../viewbiz/pp/ScanBoxInStorage';
import ScanBoxShipping from '../viewbiz/mm/ScanBoxShipping';

import FQCPinDaScreen from '../viewbiz/qc/FQCPinDa';
import FQCLianDongScreen from '../viewbiz/qc/FQCLianDong';
import FQCPinDaHandleScreen from '../viewbiz/qc/FQCPinDaHandle';
import FQCLianDongHandleScreen from '../viewbiz/qc/FQCLianDongHandle';
import IQCCheckPage from '../viewbiz/qc/IQCUnqualified';

import SyncMangerScreen from '../viewbiz/manage/SyncManger';
import JPushMessageTestScreen from '../viewbiz/test/JPushMessageTest';
import BackgroudTaskTestScreen from '../viewbiz/test/backtest';
import WebViewPageScreen from '../view/WebViewH5'

const router = {
    //登陆页面
    Login: {
        path: '/login',
        screen: Login,
    },
    Index: {
        path: '/index',
        screen: IndexPage,
    },
    PoIn: {
        path: '/PoIn',
        screen: ScanPoInWarehouse,
    },
    PoinByLine: {
        path: '/PoinByLine',
        screen: PoinByLinePage,
    },
    //仓库配送业务
    PSDList: {
        path: '/PSDList',
        screen: PSDListScreen,
    },
    //发运扫描
    BoxShipping: {
        path: '/BoxShipping',
        screen: ScanBoxShipping,
    },
    //====================================================================================下面是车间现场管理
    //装配工单扫描
    WoClose: {
        path: '/WoClose',
        screen: ScanWoClose,
    },
    //装箱扫描
    WoBoxClose: {
        path: '/WoBoxClose',
        screen: ScanWoBoxClose,
    },
    //成品入库扫描(整箱)
    BoxInStorage: {
        path: '/BoxInStorage',
        screen: ScanBoxInStorage,
    },
    //====================================================================================下面是车间现场管理
    //成品检验拼搭
    FQCPinDa: {
        path: '/FQCPinDa',
        screen: FQCPinDaScreen,
    },
    //成品检验联动
    FQCLianDong: {
        path: '/FQCLianDong',
        screen: FQCLianDongScreen,
    },
    //成品检验联动
    FQCPinDaHandle: {
        path: '/FQCPinDaHandle',
        screen: FQCPinDaHandleScreen,
    },
    FQCLianDongHandle: {
        path: '/FQCLianDongHandle',
        screen: FQCLianDongHandleScreen,
    },
    IQCCheck: {
        path: '/IQCCheck',
        screen: IQCCheckPage,
    },
    //====================================================================================下面是管理和测试
    //数据同步管理
    SyncManager: {
        path: '/SyncManager',
        screen: SyncMangerScreen,
    },
    JPushMessageTest: {
        path: '/JPushMessageTest',
        screen: JPushMessageTestScreen,
    },
    WebViewPage: {
        path: '/WebViewPage',
        screen: WebViewPageScreen,
    },
    // BackgroudTask_TEST: {
    //     path: '/BackgroudTask_TEST',
    //     screen: BackgroudTaskTestScreen,
    // }
}

export default router
