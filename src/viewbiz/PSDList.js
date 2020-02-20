import React from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet, Dimensions, ToastAndroid, TextInput, TouchableHighlight, ScrollView } from 'react-native';
import { Input, Button, Header, ListItem } from 'react-native-elements';
import { WhiteSpace, WingBlank, Flex, Provider } from '@ant-design/react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import { HTTPPOST } from '../api/HttpRequest';
import { connect } from 'react-redux';
// import ErrorUtils from "ErrorUtils";

// ErrorUtils.setGlobalHandler((e) => {

//     //发生异常的处理方法,当然如果是打包好的话可能你找都找不到是哪段代码出问题了
//     Alert.alert("异常", JSON.stringify(e))
// });
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;



class PSDList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            zdcodes: [], //选中的linecode
            selected_psdcode: '',
            kwm: '',//库位码
            submitLoading: false,
            carnolinktext: '',
            carnolinktext_focused: true,
            linelist: [],
            psdlist: [],
            partlist: [], //配送物料清单
        };
        //const navigate = this.props.navigation;

        //this.checkcarno = this.checkcarno.bind(this);

    }
    //在渲染前调用,在客户端也在服务端
    componentWillMount() {
        let { status } = this.props;
        const { navigate } = this.props.navigation;
        if (status != '1') {
            navigate('Login');
        }
        this.searchLineList();
    }
    //获取所有车间工作站点
    searchLineList() {
        let { status, user, token } = this.props;
        let reqdata = {
            packBarCode: user.loginName
        };

        HTTPPOST('/sm/getLineBodyByLoginName', reqdata, token)
            .then((res) => {
                if (res.code >= 1) {
                    ToastAndroid.show(
                        '工作站点信息获取成功，请选择！',
                        ToastAndroid.LONG
                    );
                    //获取用户数据
                    if (res.list && res.list.length >= 1) {

                        this.setState({ linelist: res.list });

                    }

                } else {
                    Alert.alert(res.msg);
                    //this.refs.textInput1.focus();
                }

            }).catch((error) => {
                Alert.alert(error);
                //th is.refs.textInput1.focus();
            });
        //this.setState({ carnolinktext_focused: false });
        //this.refs.textInput1.focus();
        // this.setState({ carnolinktext: '' })
    }

    //提交扫描结果
    showBar() {

        let { status, user, token } = this.props;

        let noticedata = {
            codeInfo: this.state.kwm,
            noticeNo: this.state.selected_psdcode
        }
        HTTPPOST('/ftNotice/confirmFtNotice', noticedata, token)
            .then((res) => {
                if (res.code >= 1) {
                    this.setState({kwm:''})
                    this.setState({partlist:[]})
                    ToastAndroid.show(
                        '配送完成！',
                        ToastAndroid.LONG
                    );
                } else {
                    Alert.alert(res.msg);
                }
            }).catch((error) => {
                Alert.alert(error);
            });

    }

    select1_renderButtonText(rowData) {
        const { zdname, zdcode, } = rowData;
        return `${zdname} - ${zdcode}`;
    }

    select1_renderRow(rowData, rowID, highlighted) {
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={styles.selectrow}>
                    <Text>
                        {`${rowData.zdname} (${rowData.zdcode})`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    select1_onSelect(idx, value) {
        // BUG: alert in a modal will auto dismiss and causes crash after reload and touch. @sohobloo 2016-12-1
        //Alert.alert(`idx=${idx}, value='${value}'`);
        //console.debug(`idx=${idx}, value='${value}'`);
        /*let zdcodes = value.zdcode;
        if (value.zdgxpzdetail_list.length >= 1) {
            value.zdgxpzdetail_list.forEach(element => {
                zdcodes.push(element.gzzx + element.gxno);
            });
        }*/
        
        let linedata = {
            code: value.zdcode
        }
                                
        let { status, user, token } = this.props;
        HTTPPOST('/ftNotice/listFtNoticeMain', linedata, token)
            .then((res) => {
                if (res.code >= 1) {
                    ToastAndroid.show(
                        '配送单信息获取成功，请选择！',
                        ToastAndroid.LONG
                    );
                    //获取用户数据
                    if (res.list && res.list.length >= 1) {
                        this.setState({ psdlist: res.list });
                    } else {
                        this.setState({ psdlist: [] });
                    }
                } else {
                    Alert.alert(res.msg);
                }
            }).catch((error) => {
                Alert.alert(error);
            });
    }

    select2_renderButtonText(rowData) {
        const { noticeNo, startTimeStr, workNo} = rowData;
        return `${noticeNo} - ${workNo} - ${startTimeStr}`;
    }
    select2_renderRow(rowData, rowID, highlighted) {
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={styles.selectrow}>
                    <Text>
                        {`${rowData.noticeNo} (${rowData.workNo}) (${rowData.startTimeStr})`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    select2_onSelect(idx, value) {

        let psdcode = value.noticeNo;
        let { status, user, token } = this.props;

        this.setState({ selected_psdcode: psdcode });
        let psddata = {
            code: psdcode
        }
        this.setState({ submitLoading: true });

        HTTPPOST('/ftNotice/listFtNoticeDetail', psddata, token)
            .then((res) => {
                if (res.code >= 1) {
                    ToastAndroid.show(
                        '配送单明细获取成功，请选择！',
                        ToastAndroid.LONG
                    );
                    //获取用户数据
                    if (res.list && res.list.length >= 1) {
                        this.setState({ partlist: res.list });
                    }
                } else {
                    Alert.alert(res.msg);
                }
                this.setState({ submitLoading: false });
            }).catch((error) => {
                Alert.alert(error);
                this.setState({ submitLoading: false });
            });
    }


    componentWillUnmount() {
        this.refs.select1.hide();
        this.refs.select2.hide();
    }

    //回到主页
    gohome() {
        const { navigate } = this.props.navigation;
        navigate('Index');
    }
    render() {
        this.props.navigation.navigate('DrawerClose');

        return (
            <ScrollView >
                <Header
                    ViewComponent={View }
                    placement="left"
                    leftComponent={{ icon: 'home', color: '#fff', onPress: this.gohome.bind(this) }}
                    centerComponent={{ text: '仓库物料配送任务', style: { color: '#fff', fontWeight: 'bold' } }}
                    containerStyle={styles.headercontainer}
                />
                <WingBlank>
                    <WhiteSpace />
                    <Text containerStyle={{ alignSelf: 'flex-start' }}>配送工作站点：</Text>
                    <View style={styles.CarnoSelecter}>
                        <ModalDropdown options={this.state.linelist}
                            style={styles.Selecter}
                            textStyle={styles.SelecterText}
                            dropdownStyle={styles.SelecterDropDown}
                            ref="select1"
                            renderButtonText={(rowData) => this.select1_renderButtonText(rowData)}
                            renderRow={this.select1_renderRow.bind(this)}
                            onSelect={(idx, value) => this.select1_onSelect(idx, value)}
                        />
                    </View>
                    <WhiteSpace />
                    <Text containerStyle={{ alignSelf: 'flex-start' }}>待处理配送单：</Text>
                    <View style={styles.textIconInput}>
                        <ModalDropdown
                            options={this.state.psdlist}
                            style={styles.Selecter}
                            textStyle={styles.SelecterText}
                            dropdownStyle={styles.SelecterDropDown}
                            ref="select2"
                            renderButtonText={(rowData) => this.select2_renderButtonText(rowData)}
                            renderRow={this.select2_renderRow.bind(this)}
                            onSelect={(idx, value) => this.select2_onSelect(idx, value)}
                        />
                    </View>
                    <WhiteSpace />
                    <Text containerStyle={{ alignSelf: 'flex-start' }}>配送单物料明细：</Text>
                    <ScrollView style={styles.partlistclass}>

                        {
                            this.state.partlist.map((l) => (
                                <ListItem

                                    key={l.pieceCode}
                                    title={l.pieceCode}
                                    subtitle={'数量：' + l.distributioNumber + '，合同号：' + l.workNo + '，模块：' + l.pieceName}

                                    containerStyle={{ padding: 5, margin: 0, marginBottom: 10 }}
                                />
                            ))
                        }

                    </ScrollView>
                    <WhiteSpace />
                    <View style={styles.buttonStyle}>
                        <View style={styles.textInput}>
                            
                            <Input placeholder="库位码" onChangeText={(text) => this.setState({ kwm: text })} value={this.state.kwm} type="text"/>

                        </View>
                        <View style={styles.clickButton}>
                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                onPress={this.showBar.bind(this)}
                                loading={this.state.submitLoading}
                                title='确认' />

                        </View>
                    </View>
                    
                </WingBlank>
            </ScrollView>
        );
    }
}

export default connect(
    (state) => ({
        status: state.loginIn.status,
        user: state.loginIn.user,
        token: state.loginIn.token,
    })
)(PSDList)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
        justifyContent: 'flex-start',

    },
    headercontainer: {
        marginTop: 0,
        paddingTop: 0,
        height: 50,

    },
    textIconInput: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    inputS: {
        paddingRight: 0, marginRight: 0,
    },
    CarnoSelecter: {

        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    Selecter: {
        height: 30,
        width: SCREEN_WIDTH - 30,
        backgroundColor: '#eee',
        borderBottomColor: '#666',
        borderBottomWidth: 1,

    },
    SelecterText: {
        fontSize: 12,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 0,
    },
    SelecterDropDown: {

        width: SCREEN_WIDTH - 30,
        height: 250,
    },
    selectrow: {
        padding: 5,
    },
    partlistclass: {

        padding: 5,

        height: SCREEN_HEIGHT - 280,

    },
    buttonStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    textInput: {
        flex: 1,
    },
    clickButton: {
        width: 80,
    }
});