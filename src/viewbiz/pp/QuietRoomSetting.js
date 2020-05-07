import React from 'react';
import { View, ScrollView, Alert, StyleSheet, Dimensions,Text } from 'react-native';
import { Input, Header, Button } from 'react-native-elements';
import { WhiteSpace, WingBlank, Provider, InputItem, List, Picker } from '@ant-design/react-native';

import { HTTPPOST } from '../../api/HttpRequest';
import { connect } from 'react-redux';
import SQLite from '../../api/SQLite';

var RNFS = require('react-native-fs');
var sqLite = new SQLite();
var db;


class QuietRoomSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            qchandlemethodes: [
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' }
            ],
            qchandlemethodes1: [
                { value: '上', label: '上' },
                { value: '下', label: '下' }
            ],
            submitLoading: false,
            deviceId1: '',
            deviceId2: '',
            deviceId3: '',
            deviceId4: '',
            id1: '',
            id2: '',
            id3: '',
            id4: '',
            ip1: '',
            ip2: '',
            ip3: '',
            ip4: '',
            station1: 'A',
            station2: 'A',
            station3: 'B',
            station4: 'B',
            orientation1: '上',
            orientation2: '下',
            orientation3: '上',
            orientation4: '下',
        };
    }

    //回到主页
    gohome() {
        const { navigate } = this.props.navigation;
        navigate('Index');
    }

    onChangeQChandle(value) {
        this.setState({ station1: value });
    }

    onChangeQChandle1(value) {
        this.setState({ orientation1: value });
    }

    onChangeQChandle2(value) {
        this.setState({ station2: value });
    }

    onChangeQChandle3(value) {
        this.setState({ orientation2: value });
    }

    onChangeQChandle4(value) {
        this.setState({ station3: value });
    }

    onChangeQChandle5(value) {
        this.setState({ orientation3: value });
    }

    onChangeQChandle6(value) {
        this.setState({ station4: value });
    }

    onChangeQChandle7(value) {
        this.setState({ orientation4: value });
    }

    async componentDidMount() {
        //开启数据库
        if (!db) {
            db = sqLite.open();
        }
        await sqLite.createTable_MuteConfiguration();
        if (this.props.token != null && this.props.token != '') {
            this.selectMute(this.props.token);
        }
    }

    async submitForm(token) {
        //开启数据库
        if (!db) {
            db = sqLite.open();
        }

        //数据
        var mutedata = [];
        let mute1={
            nb: 1,
            id: this.state.id1,
            device: this.state.deviceId1,
            ipdz: this.state.ip1,
            station: this.state.station1[0],
            orientation: this.state.orientation1[0],
        }
        let mute2={
            nb: 2,
            id: this.state.id2,
            device: this.state.deviceId2,
            ipdz: this.state.ip2,
            station: this.state.station2[0],
            orientation: this.state.orientation2[0],
        }
        let mute3={
            nb: 3,
            id: this.state.id3,
            device: this.state.deviceId3,
            ipdz: this.state.ip3,
            station: this.state.station3[0],
            orientation: this.state.orientation3[0],
        }
        let mute4={
            nb: 4,
            id: this.state.id4,
            device: this.state.deviceId4,
            ipdz: this.state.ip4,
            station: this.state.station4[0],
            orientation: this.state.orientation4[0],
        }
        mutedata.push(mute1);
        mutedata.push(mute2);
        mutedata.push(mute3);
        mutedata.push(mute4);
        //新增数据
        //await sqLite.insertData_MuteConfiguration(mutedata)
        //更新数据
        await sqLite.upData_MuteConfiguration(mutedata);
        Alert.alert('提交成功')
    }

    async selectMute(token) {
        if (!db) {
            db = sqLite.open();
        }
        //查询
        db.transaction((tx) => {
            tx.executeSql("select id, device, ipdz, station, orientation from MuteData_PartIn", [],
                (tx, results) => {
                    var len = results.rows.length;
                    if (len >= 1) {
                        let m = results.rows.item(0);
                        let m1 = results.rows.item(1);
                        let m2 = results.rows.item(2);
                        let m3 = results.rows.item(3);
                        this.setState({
                            id1: m.id,
                            deviceId1: m.device,
                            ip1: m.ipdz,
                            station1: m.station,
                            orientation1: m.orientation,
                            deviceId2: m1.device,
                            id2: m1.id,
                            ip2: m1.ipdz,
                            station2: m1.station,
                            orientation2: m1.orientation,
                            deviceId3: m2.device,
                            id3: m2.id,
                            ip3: m2.ipdz,
                            station3: m2.station,
                            orientation3: m2.orientation,
                            deviceId4: m3.device,
                            id4: m3.id,
                            ip4: m3.ipdz,
                            station4: m3.station,
                            orientation4: m3.orientation,
                        });
                        console.log('查询成功')
                    } else {
                        console.log('查询失败')
                    }

                });
        }, (error) => {
            LogException('查询待同步工单部件扫描数据异常：' + error.message);
        });
    }

    // async dMute(token) {
    //     //开启数据库
    //     if (!db) {
    //         db = sqLite.open();
    //     }
           //删除数据
    //     await sqLite.deleteTable_MuteConfiguration();
    // }

    render() {

        return (
            <Provider>
                <ScrollView >
                    <Header
                        ViewComponent={View}
                        placement="left"
                        leftComponent={{ icon: 'home', color: '#fff', onPress: this.gohome.bind(this) }}
                        centerComponent={{ text: '静音配置', style: { color: '#fff', fontWeight: 'bold' } }}
                        containerStyle={styles.headercontainer}
                    />
                    <WingBlank size="sm">
                        <List renderHeader={'设备1'}>
                            <InputItem
                                clear
                                type='number'
                                value={this.state.deviceId1}
                                onChange={value => {
                                    this.setState({
                                        deviceId1: value,
                                    });
                                }}
                                placeholder="请输入设备ID"
                            >
                                设备ID：
                            </InputItem>
                            <InputItem
                                clear
                                type='number'
                                value={this.state.ip1}
                                onChange={value => {
                                    this.setState({
                                        ip1: value,
                                    });
                                }}
                                placeholder="请输入设备IP"
                            >
                                设备IP：
                            </InputItem>
                            <Picker
                                data={this.state.qchandlemethodes}
                                cols={1}
                                value={this.state.station1}
                                onChange={this.onChangeQChandle.bind(this)}

                            >
                                <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                    <Text style={styles.dialogLabel}>工位：</Text>
                                </List.Item>
                            </Picker>
                            
                            <Picker
                                data={this.state.qchandlemethodes1}
                                cols={1}
                                value={this.state.orientation1}
                                onChange={this.onChangeQChandle1.bind(this)}
                            >
                                <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                    <Text style={styles.dialogLabel}>位置：</Text>
                                </List.Item>
                            </Picker>    
                        </List>

                        <List renderHeader={'设备2'}>
                            <InputItem
                                clear
                                type='number'
                                value={this.state.deviceId2}
                                onChange={value => {
                                    this.setState({
                                        deviceId2: value,
                                    });
                                }}
                                placeholder="请输入设备ID"
                            >
                                设备ID：
                            </InputItem>
                            <InputItem
                                clear
                                type='number'
                                value={this.state.ip2}
                                onChange={value => {
                                    this.setState({
                                        ip2: value,
                                    });
                                }}
                                placeholder="请输入设备IP"
                            >
                                设备IP：
                            </InputItem>
                            <Picker
                                data={this.state.qchandlemethodes}
                                cols={1}
                                value={this.state.station2}
                                onChange={this.onChangeQChandle2.bind(this)}

                            >
                                <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                    <Text style={styles.dialogLabel}>工位：</Text>
                                </List.Item>
                            </Picker>
                            
                            <Picker
                                data={this.state.qchandlemethodes1}
                                cols={1}
                                value={this.state.orientation2}
                                onChange={this.onChangeQChandle3.bind(this)}

                            >
                                <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                    <Text style={styles.dialogLabel}>位置：</Text>
                                </List.Item>
                            </Picker>    
                        </List>

                        <List renderHeader={'设备3'}>
                            <InputItem
                                clear
                                type='number'
                                value={this.state.deviceId3}
                                onChange={value => {
                                    this.setState({
                                        deviceId3: value,
                                    });
                                }}
                                placeholder="请输入设备ID"
                            >
                                设备ID：
                            </InputItem>
                            <InputItem
                                clear
                                type='number'
                                value={this.state.ip3}
                                onChange={value => {
                                    this.setState({
                                        ip3: value,
                                    });
                                }}
                                placeholder="请输入设备IP"
                            >
                                设备IP：
                            </InputItem>
                            <Picker
                                data={this.state.qchandlemethodes}
                                cols={1}
                                value={this.state.station3}
                                onChange={this.onChangeQChandle4.bind(this)}

                            >
                                <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                    <Text style={styles.dialogLabel}>工位：</Text>
                                </List.Item>
                            </Picker>
                            
                            <Picker
                                data={this.state.qchandlemethodes1}
                                cols={1}
                                value={this.state.orientation3}
                                onChange={this.onChangeQChandle5.bind(this)}

                            >
                                <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                    <Text style={styles.dialogLabel}>位置：</Text>
                                </List.Item>
                            </Picker>    
                        </List>

                        <List renderHeader={'设备4'}>
                            <InputItem
                                clear
                                type='number'
                                value={this.state.deviceId4}
                                onChange={value => {
                                    this.setState({
                                        deviceId4: value,
                                    });
                                }}
                                placeholder="请输入设备ID"
                            >
                                设备ID：
                            </InputItem>
                            <InputItem
                                clear
                                type='number'
                                value={this.state.ip4}
                                onChange={value => {
                                    this.setState({
                                        ip4: value,
                                    });
                                }}
                                placeholder="请输入设备IP"
                            >
                                设备IP：
                            </InputItem>
                            <Picker
                                data={this.state.qchandlemethodes}
                                cols={1}
                                value={this.state.station4}
                                onChange={this.onChangeQChandle6.bind(this)}

                            >
                                <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                    <Text style={styles.dialogLabel}>工位：</Text>
                                </List.Item>
                            </Picker>
                            
                            <Picker
                                data={this.state.qchandlemethodes1}
                                cols={1}
                                value={this.state.orientation4}
                                onChange={this.onChangeQChandle7.bind(this)}

                            >
                                <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                    <Text style={styles.dialogLabel}>位置：</Text>
                                </List.Item>
                            </Picker>    
                        </List>

                        <WhiteSpace size="sm" />
                        <Button backgroundColor='#6495ed'
                                onPress={this.submitForm.bind(this)}
                                loading={this.state.submitLoading}
                                title='提交' />

                        <WhiteSpace size="sm" />
                        {/* <Button backgroundColor='#6495ed'
                                onPress={this.submitForm.bind(this)}
                                loading={this.state.submitLoading}
                                title='插入' />

                        <WhiteSpace size="sm" />      
                        <Button backgroundColor='#6495ed'
                                onPress={this.dMute.bind(this)}
                                loading={this.state.submitLoading}
                                title='清空' /> */}

                    </WingBlank>
                </ScrollView>
            </Provider>
        );
    }
}

export default connect(
    (state) => ({
        status: state.loginIn.status,
        user: state.loginIn.user,
        token: state.loginIn.token
    })
)(QuietRoomSetting)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        justifyContent: 'flex-start',
    },
    headercontainer: {
        marginTop: 0,
        paddingTop: 0,
        height: 50,
    },
    textIconInput: {
        flexDirection: 'row',
    },
    inputS: {
        paddingRight: 0, marginRight: 0,
    },
    dialogLabel: {
        textAlign: 'left',
        fontSize: 16,
        padding: 0, margin: 0
    },
});