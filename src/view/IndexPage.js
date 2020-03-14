import React, { Component } from 'react';

import { ScrollView, Text, TouchableWithoutFeedback, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { WhiteSpace, WingBlank, Flex, Carousel, TabBar, Icon, SearchBar, Card, Provider } from '@ant-design/react-native';

import { HTTPPOST, HTTPGET } from '../api/HttpRequest';
import { connect } from 'react-redux';
// import ErrorUtils from "ErrorUtils";
const AD_IMAGE1 = require('../assets/ad/ad1.png');
const AD_IMAGE2 = require('../assets/ad/ad2.png');
const AD_IMAGE3 = require('../assets/ad/ad3.jpg');
const AD_IMAGE4 = require('../assets/ad/ad4.jpg');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
// ErrorUtils.setGlobalHandler((e) => {

//     //发生异常的处理方法,当然如果是打包好的话可能你找都找不到是哪段代码出问题了
//     Alert.alert("异常", JSON.stringify(e))
// });
class IndexPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //111=====================>>>>>>>>>>>>>>>>>>>>>>下面是页面页面

            selectedTab: 'home',
            index_ades: [],

            //222=====================>>>>>>>>>>>>>>>>>>>>>>下面是工作页面
            //现场数据采集功能按钮
            appBtnes: [],
            //生产管理功能按钮
            appBtnPP: [],
            //仓储物料管理功能按钮
            appBtnMM: [],
            //质检管理功能按钮
            appBtnQC: [],
            //开发测试使用
            appBtnTest: [],
            //默认打开的结点
            activeSections: [0, 1, 2, 3],
        }
    }

    //跳转到详情页面
    NaviTo(name) {
        const { navigate } = this.props.navigation;
        navigate(name)
    }


    //在渲染前调用,在客户端也在服务端
    UNSAFE_componentWillMount() {
        const { navigate } = this.props.navigation;
        let { status, user, token } = this.props;

        if (status != '1') {
            navigate('Login');
            return;
        }

        //下面开始加载菜单
        if (user && user.barRoleText) {
            if (user.barRoleText.includes('采购到货') == true) {
                this.state.appBtnMM.push(
                    {
                        name: '采购入库扫描',
                        iconname: 'import',
                        pagepath: 'PoIn'
                    }
                )
                this.state.appBtnMM.push(
                    {
                        name: '采购入库(按行)',
                        iconname: 'import',
                        pagepath: 'PoinByLine'
                    }
                )
                this.state.appBtnMM.push(
                    {
                        name: '仓库配送',
                        iconname: 'export',
                        pagepath: 'PSDList'
                    }
                )

            }
            if (user.barRoleText.includes('装箱管理') == true) {
                this.state.appBtnes.push(
                    {
                        name: '工单完工扫描',
                        iconname: 'carry-out',
                        pagepath: 'WoClose'
                    }
                )

                this.state.appBtnes.push(
                    {
                        name: '装箱扫描',
                        iconname: 'inbox',
                        pagepath: 'WoBoxClose'
                    }
                )

                this.state.appBtnTest.push(
                    {
                        name: '同步数据查询',
                        iconname: 'sync',
                        pagepath: 'SyncManager'
                    }
                )
            }
            if (user.barRoleText.includes('入库管理') == true) {
                this.state.appBtnes.push(
                    {
                        name: '成品入库扫描',
                        iconname: 'select',
                        pagepath: 'BoxInStorage'
                    }
                )
            }

            if (user.barRoleText.includes('发运管理') == true) {
                this.state.appBtnMM.push(
                    {
                        name: '发运扫描',
                        iconname: 'logout',
                        pagepath: 'BoxShipping'
                    }
                )
            }

            ///====================>>>>>>>>>>>>>>>>>>>>QC管理

            if (user.barRoleText.includes('成品质检') == true) {
                this.state.appBtnQC.push(
                    {
                        name: '成品拼搭质检',
                        iconname: 'check-circle',
                        pagepath: 'FQCPinDa'
                    }
                )
                this.state.appBtnQC.push(
                    {
                        name: '成品联动质检',
                        iconname: 'check-circle',
                        pagepath: 'FQCLianDong'
                    }
                )

                this.state.appBtnQC.push(
                    {
                        name: '拼搭不合格处理',
                        iconname: 'issues-close',
                        pagepath: 'FQCPinDaHandle'
                    }
                )
                this.state.appBtnQC.push(
                    {
                        name: '联动不合格处理',
                        iconname: 'issues-close',
                        pagepath: 'FQCLianDongHandle'
                    }
                )
            }
            ///====================>>>>>>>>>>>>>>>>>>>>IQC管理

            if (user.barRoleText.includes('进货质检') == true || user.loginName == 'admin') {
                this.state.appBtnQC.push(
                    {
                        name: '进货质检',
                        iconname: 'check-square',
                        pagepath: 'IQCCheck'
                    }
                )
            }
            ///====================>>>>>>>>>>>>>>>>>>>>开发测试
            if (user.loginName == 'admin') {
                this.state.appBtnTest.push(
                    {
                        name: 'NFC_M1TEST',
                        iconname: 'dash',
                        pagepath: 'NFCMifareTest'
                    }
                );
                this.state.appBtnTest.push(
                    {
                        name: 'NFC_NdefTEST',
                        iconname: 'dash',
                        pagepath: 'NFCMultiNdefRecord'
                    }
                );

                // this.state.appBtnTest.push(
                //     {
                //         name: '音频操作测试',
                //         iconname: 'dash',
                //         pagepath: 'AudioTest'
                //     }
                // );

                this.state.appBtnTest.push(
                    {
                        name: '消息推送',
                        iconname: 'dash',
                        pagepath: 'JPushMessageTest'
                    }
                );

                this.state.appBtnTest.push(
                    {
                        name: 'AR&VR 测试',
                        iconname: 'dash',
                        pagepath: 'ARVR_TEST'
                    }
                );

                // this.state.appBtnTest.push(
                //     {
                //         name: '后台作业 测试',
                //         iconname: 'dash',
                //         pagepath: 'BackgroudTask_TEST'
                //     }
                // );
            }

        }


    }

    gotowebview() {
        const { navigate } = this.props.navigation;
        navigate('WebShow');
    }

    //显示首页内容
    renderContentIndex() {
        return (
            <ScrollView >
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Carousel
                        style={styles.wrapper}
                        selectedIndex={2}
                        autoplay
                        infinite
                        vertical
                    >
                        <View
                            style={[styles.containerVertical, {}]}
                        >
                            <TouchableOpacity >
                                <Image resizeMode={'cover'} style={styles.adimg} source={AD_IMAGE2} />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[styles.containerVertical, {}]}
                        >
                            <TouchableOpacity >
                                <Image resizeMode={'cover'} style={styles.adimg} source={AD_IMAGE1} />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[styles.containerVertical, {}]}
                        >
                            <TouchableOpacity >
                                <Image resizeMode={'cover'} style={styles.adimg} source={AD_IMAGE3} />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[styles.containerVertical, {}]}
                        >
                            <TouchableOpacity >
                                <Image resizeMode={'cover'} style={styles.adimg} source={AD_IMAGE4} />
                            </TouchableOpacity>
                        </View>
                    </Carousel>
                    <Flex justify="between" style={styles.showboxarea}>
                        <View style={styles.showbox} >
                            <Text style={styles.showbox_title}>  技术释放 </Text>
                            <Text style={styles.showbox_value}> 000 </Text>
                        </View>
                        <View style={styles.showbox} >
                            <Text style={styles.showbox_title}>  合同排产 </Text>
                            <Text style={styles.showbox_value}> 000 </Text>
                        </View>
                        <View style={styles.showbox} >
                            <Text style={styles.showbox_title}>  完工入库 </Text>
                            <Text style={styles.showbox_value}> 000 </Text>
                        </View>
                        <View style={styles.showbox} >
                            <Text style={styles.showbox_title}>  发货 </Text>
                            <Text style={styles.showbox_value}> 000 </Text>
                        </View>
                    </Flex>
                    <Text>建设中</Text>
                </View>
            </ScrollView>
        );
    }

    //显示工作页面清单
    renderContentAppes() {
        return (
            <ScrollView  >
                <WhiteSpace size='xs' />
                {this.showAppFunc("仓储物料管理", this.state.appBtnMM)}

                {this.showAppFunc("车间现场管理", this.state.appBtnes)}

                {this.showAppFunc("生产管理", this.state.appBtnPP)}

                {this.showAppFunc("质检管理", this.state.appBtnQC)}

                {this.showAppFunc("管理和测试功能", this.state.appBtnTest)}
            </ScrollView>
        );
    }

    renderAppBtn(btnitem, index) {
        return (
            <TouchableOpacity key={btnitem.pagepath} onPress={this.NaviTo.bind(this, btnitem.pagepath)}>
                <View style={styles.appBtn}>
                    <Icon
                        name={btnitem.iconname}
                        color='#0033cc'
                        size={48}
                    />
                    <Text style={{ fontSize: 10 }}>{btnitem.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    showAppFunc(title, applist) {
        if (applist && applist.length >= 1) {
            return (
                <View>
                    <Card full >
                        <Card.Header
                            title={title}
                        />
                        <Card.Body>
                            <Flex wrap="wrap">
                                {
                                    applist.map((item, index) => {
                                        return this.renderAppBtn(item, index)
                                    })
                                }
                            </Flex>
                        </Card.Body>
                    </Card>
                    <WhiteSpace size='xs' />
                </View>
            )
        } else {
            return;
        }
    }

    renderContent(pageText) {
        return (
            <View  >

                <Text style={{ margin: 50 }}>{pageText}</Text>
            </View>
        );
    }
    onChangeTab(tabName) {
        this.setState({
            selectedTab: tabName,
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        let { status, user } = this.props;
        //Alert.alert(user.barRoleText);
        return (
            <Provider>
                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#33A3F4"
                    barTintColor="#f5f5f5"
                >
                    <TabBar.Item
                        title="首页"
                        icon={<Icon name="home" />}
                        selected={this.state.selectedTab === 'home'}
                        onPress={() => this.onChangeTab('home')}
                    >
                        {this.renderContentIndex()}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<Icon name="appstore" />}
                        title="应用"
                        //badge={2}
                        selected={this.state.selectedTab === 'appes'}
                        onPress={() => this.onChangeTab('appes')}
                    >
                        {this.renderContentAppes()}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<Icon name="message" />}
                        title="消息"
                        selected={this.state.selectedTab === 'message'}
                        onPress={() => this.onChangeTab('message')}
                    >
                        {this.renderContent('Friend Tab')}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<Icon name="user" />}
                        title="我的"
                        selected={this.state.selectedTab === 'my'}
                        onPress={() => this.onChangeTab('my')}
                    >
                        {this.renderContent('My Tab')}
                    </TabBar.Item>
                </TabBar>
            </Provider>
        );
    }
}

export default connect(
    (state) => ({
        status: state.loginIn.status,
        user: state.loginIn.user,
        token: state.loginIn.token,
    })
)(IndexPage)

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
    },
    containerHorizontal: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    containerVertical: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    adimg: {
        height: 150,
        width: SCREEN_WIDTH,
    },
    text: {
        color: '#fff',
        fontSize: 36,
    },
    showboxarea: {
        padding: 5,
    },
    showbox: {
        width: SCREEN_WIDTH / 4 - 7,
        height: 55,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#525252',
        padding: 5,
    },
    showbox_title: {
        fontSize: 12,
        color: '#FFF'
    },
    showbox_value: {
        fontSize: 22,
        color: '#FFF',
    },
    appBtn: {
        // justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 100,
        padding: 10,
        borderColor: '#fff',
        overflow: 'hidden',
    }
});