import React from 'react';
import { Text, View, ScrollView, Alert, StyleSheet, Dimensions } from 'react-native';
import { Input, Button, Header, ListItem } from 'react-native-elements';
import { WhiteSpace, WingBlank, Flex, Provider, Tabs, InputItem, List, Picker } from '@ant-design/react-native';

import { HTTPPOST, HTTPPOST_Quite } from '../../api/HttpRequest';
import { connect } from 'react-redux';
import { Line } from 'react-native-svg'
import { LineChart, Grid, YAxis } from 'react-native-svg-charts'
import SQLite from '../../api/SQLite';

var RNFS = require('react-native-fs');
var sqLite = new SQLite();
var db;


// import ErrorUtils from "ErrorUtils";

// ErrorUtils.setGlobalHandler((e) => {

//     //发生异常的处理方法,当然如果是打包好的话可能你找都找不到是哪段代码出问题了
//     Alert.alert("异常", JSON.stringify(e))
// });
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


class QuietRoom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orderno_focused: true,  //默认选中
            orderno: '', //检验合同号

            QChandle: "",
            tabs: [
                { title: '采集1-环境' },
                { title: '采集2-上行' },
                { title: '采集3-下行' },
                { title: '合同参数' },
            ],
            data1: [],
            data2: [],
            data3: [],
            data4: [],
            data5: [],
            data6: [],
            tableData: {
                maxValue: 0,
                minValue: 0,
                averageValue: 0,
            },
            tableData1: {
                maxValue: 0,
                minValue: 0,
                averageValue: 0,
            },
            tableData2: {
                maxValue: 0,
                minValue: 0,
                averageValue: 0,
            },
            tableData3: {
                maxValue: 0,
                minValue: 0,
                averageValue: 0,
            },
            tableData4: {
                maxValue: 0,
                minValue: 0,
                averageValue: 0,
            },
            tableData5: {
                maxValue: 0,
                minValue: 0,
                averageValue: 0,
            },
            disabled: false,
            count: '1',
            datalist: [],
            show: true,
            time: 0,
            time1: 0,
            time2: 0,
            bz: '',
            qchandlemethodes: [
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' }
            ],
            station: 'A',
            code1: '',
            code2: '',
            ip1: '',
            ip2: '',
        };
        //const navigate = this.props.navigation;
        this.checkorderno = this.checkorderno.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.start = this.start.bind(this); 
        this.pause = this.pause.bind(this); 
        this.end = this.end.bind(this); 
    }

    //回到主页
    gohome() {
        const { navigate } = this.props.navigation;
        navigate('Index');
    }

    //静音配置
    muteConfig() {
        const { navigate } = this.props.navigation;
        navigate('QuietRoomSetting');
    }

    checkorderno(val) {
        this.setState({ orderno: val });
    }

    onChangeQChandle(value) {
        this.setState({ station: value });
    }

    //获取合同参数
    getparameter() {
        let { status, user, token } = this.props;
        let theorderno = this.state.orderno;

        if (theorderno == "") {
            return;
        }

        let datareq = {
            hth: theorderno,
            stationCode: "P5007",
        }
        this.setState({ datalist: [] });
        HTTPPOST('/silenceRoom/listStationParam', datareq, token)
            .then((res) => {
                console.log('合同参数')
                if (res.code >= 1) {
                    var len = res.list.length;
                    if (len >= 1) {
                        let plist = [];
                        for (let i = 0; i < len; i++) {
                            let u = res.list[i];
                            plist.push({
                                name: u.name,
                                value: u.value
                            });
                        }
                        this.setState({ datalist: plist });
                    }
                } else {
                    Alert.alert(res.msg);
                }
                //
            }).catch((error) => {
                Alert.alert('异常', error);

                this.setState({ searchloading: false });
            });
        //
    }

    //定时器5分钟后自动结束
    timerTime(index){
        this.timer = setTimeout(()=> {
            if (this.state.count == 0) {
                clearTimeout(this.timer);
                clearInterval(this.timer1);
                console.log("清除");
            }else{
                this.end(index)
                console.log("5分钟自动结束");
            }
        }, 300000);
    }

    //每隔1秒取一次静音数据
    timerTime1(index){
        this.timer1 = setInterval(()=> {
            if (this.state.count == 0) {
                clearTimeout(this.timer);
                clearInterval(this.timer1);
                console.log("采集停止");
            }else{
                this.collection(index)
            }
        }, 1000);
    }

    //清楚定时器
    componentWillUnmount() {
        // 请注意Un"m"ount的m是小写
    
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
        this.timer1 && clearTimeout(this.timer1);
    }

    //采集
    collection(index) {
        //console.log(this.state.data1)
        let { status, user, token } = this.props;
        let theorderno = this.state.orderno;
        let dataType = {
            code1: this.state.code1,
            code2: this.state.code2,
            hth: theorderno,
            type: index,   //0表示环境，1上行，2下行
        }

        HTTPPOST('/silenceRoom/listCurrentInfo', dataType, token)
            .then((res) => {
                if (res.code >= 0) {
                    let newData = res.data1;
                    let newData1 = res.data2;
                    let sj = newData.length
                    this.setState({bz: res.data3})
                    if(index == 0){
                        this.setState({
                            data1: newData,
                            data2: newData1,
                            time: sj+1
                        });
                    }else if(index == 1){
                        this.setState({
                            data3: newData,
                            data4: newData1,
                            time1: sj+1
                        });
                    }else{
                        this.setState({
                            data5: newData,
                            data6: newData1,
                            time2: sj+1
                        });
                    }
                    
                } else {
                    Alert.alert(res.msg);
                }
            }).catch((error) => {
                Alert.alert('异常', error);
            });
        //
    }

    //开始噪音检测
    start(index) {
        let { status, user, token } = this.props;
        let theorderno = this.state.orderno;
        let userId = user.pkid
             
        if (theorderno == "") {
            Alert.alert('错误', '请扫描排产编号信息！');
            return;
        } 

        if(index == 0){
            let t = this.state.data1.length;
            this.setState({
                time: t + 1
            })
        }else if(index == 1){
            let t = this.state.data3.length;
            this.setState({
                time1: t + 1
            })
        }else{
            let t = this.state.data5.length;
            this.setState({
                time2: t + 1
            })
        }

        if(this.state.station == 'A'){
            //开启数据库
            if (!db) {
                db = sqLite.open();
            }
            //查询
            db.transaction((tx) => {
                tx.executeSql("select device, ipdz from MuteData_PartIn", [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len >= 1) {
                            let m = results.rows.item(0);
                            let m1 = results.rows.item(1);
                            this.setState({
                                code1: m.device,
                                code2: m1.device,
                                ip1: m.ipdz,
                                ip2: m1.ipdz
                            });
                            let dataType1 = {
                                hth: theorderno,
                                type: index,   //0表示环境，1上行，2下行
                                code: this.state.code1,
                                ip: this.state.ip1,
                                userId: userId
                            }
                            let dataType2 = {
                                hth: theorderno,
                                type: index,   //0表示环境，1上行，2下行
                                code: this.state.code2,
                                ip: this.state.ip2,
                                userId: userId
                            }
                            HTTPPOST_Quite('/silenceRoom/startTask1', dataType1, token)
                                .then((res) => {
                                    if (res.code >= 0) {
                                        console.log("startTask1开始");
                                        this.setState({
                                            disabled: true,
                                            count: '1'
                                        });
                                    } else {
                                        Alert.alert(res.msg);
                                    }
                                }).catch((error) => {
                                    Alert.alert('异常', error);
                                });
                            //
                            HTTPPOST_Quite('/silenceRoom/startTask2', dataType2, token)
                                .then((res) => {
                                    if (res.code >= 0) {
                                        console.log("startTask2开始");
                                        this.timerTime(index);
                                        this.timerTime1(index);
                                    } else {
                                        Alert.alert(res.msg);
                                    }
                                }).catch((error) => {
                                    Alert.alert('异常', error);
                                });
                            //
                        } else {
                            console.log('查询失败')
                        }
                    });
            }, (error) => {
                LogException('查询设备ID数据异常：' + error.message);
            });
        } else {
            //开启数据库
            if (!db) {
                db = sqLite.open();
            }
            //查询
            db.transaction((tx) => {
                tx.executeSql("select device, ipdz from MuteData_PartIn", [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len >= 1) {
                            let m = results.rows.item(2);
                            let m1 = results.rows.item(3);
                            this.setState({
                                code1: m.device,
                                code2: m1.device,
                                ip1: m.ipdz,
                                ip2: m1.ipdz
                            });
                            let dataType1 = {
                                hth: theorderno,
                                type: index,   //0表示环境，1上行，2下行
                                code: this.state.code1,
                                ip: this.state.ip1,
                                userId: userId
                            }
                            let dataType2 = {
                                hth: theorderno,
                                type: index,   //0表示环境，1上行，2下行
                                code: this.state.code2,
                                ip: this.state.ip2,
                                userId: userId
                            }
                            HTTPPOST_Quite('/silenceRoom/startTask3', dataType1, token)
                                .then((res) => {
                                    if (res.code >= 0) {
                                        console.log("startTask3开始");
                                        this.setState({
                                            disabled: true,
                                            count: '1'
                                        });
                                    } else {
                                        Alert.alert(res.msg);
                                    }
                                }).catch((error) => {
                                    Alert.alert('异常', error);
                                });
                            //
                            HTTPPOST_Quite('/silenceRoom/startTask4', dataType2, token)
                                .then((res) => {
                                    if (res.code >= 0) {
                                        console.log("startTask4开始");
                                        this.timerTime(index);
                                        this.timerTime1(index);
                                    } else {
                                        Alert.alert(res.msg);
                                    }
                                }).catch((error) => {
                                    Alert.alert('异常', error);
                                });
                            //
                        } else {
                            console.log('查询失败')
                        }
                    });
            }, (error) => {
                LogException('查询设备ID数据异常：' + error.message);
            });
        }
        
    }

    //暂停噪音检测
    pause(index) {
        let { status, user, token } = this.props;
        let theorderno = this.state.orderno;
        let userId = user.pkid

        if (theorderno == "") {
            Alert.alert('错误', '请扫描排产编号信息！');
            return;
        } 
        
        let dataType1 = {
            hth: theorderno,
            type: index,   //0表示环境，1上行，2下行
            code: this.state.code1,
            ip: this.state.ip1,
            userId: userId
        }
        let dataType2 = {
            hth: theorderno,
            type: index,   //0表示环境，1上行，2下行
            code: this.state.code2,
            ip: this.state.ip2,
            userId: userId
        }

        if(this.state.station == 'A'){
            HTTPPOST_Quite('/silenceRoom/pauseTask1', dataType1, token)
                .then((res) => {
                    if (res.code >= 0) {
                        console.log("pauseTask1暂停");
                    } else {
                        Alert.alert(res.msg);
                    }
                }).catch((error) => {
                    Alert.alert('异常', error);
                });
            //
            HTTPPOST_Quite('/silenceRoom/pauseTask2', dataType2, token)
                .then((res) => {
                    if (res.code >= 0) {
                        console.log("pauseTask2暂停");
                        this.setState({
                            disabled: false,
                            count: '0'
                        })
                        this.timerTime(index)
                    } else {
                        Alert.alert(res.msg);
                    }
                }).catch((error) => {
                    Alert.alert('异常', error);
                });
            //
        } else {
            HTTPPOST_Quite('/silenceRoom/pauseTask3', dataType1, token)
                .then((res) => {
                    if (res.code >= 0) {
                        console.log("pauseTask3暂停");
                    } else {
                        Alert.alert(res.msg);
                    }
                }).catch((error) => {
                    Alert.alert('异常', error);
                });
            //
            HTTPPOST_Quite('/silenceRoom/pauseTask4', dataType2, token)
                .then((res) => {
                    if (res.code >= 0) {
                        console.log("pauseTask4暂停");
                        this.setState({
                            disabled: false,
                            count: '0'
                        })
                        this.timerTime(index)
                    } else {
                        Alert.alert(res.msg);
                    }
                }).catch((error) => {
                    Alert.alert('异常', error);
                });
            //
        }
    }

    
    //结束噪音检测
    end(index) {
        let { status, user, token } = this.props;
        let theorderno = this.state.orderno;
        let userId = user.pkid

        if (theorderno == "") {
            Alert.alert('错误', '请扫描排产编号信息！');
            return;
        } 
        
        let dataType1 = {
            hth: theorderno,
            type: index,   //0表示环境，1上行，2下行
            code: this.state.code1,
            ip: this.state.ip1,
            userId: userId
        }
        let dataType2 = {
            hth: theorderno,
            type: index,   //0表示环境，1上行，2下行
            code: this.state.code2,
            ip: this.state.ip2,
            userId: userId
        }

        if(this.state.station == 'A'){
            HTTPPOST_Quite('/silenceRoom/stopTask1', dataType1, token)
                .then((res) => {
                    if (res.code >= 0) {
                        console.log("stopTask1结束");
                    } else {
                        Alert.alert(res.msg);
                    }
                }).catch((error) => {
                    Alert.alert('异常', error);
                });
            //
            HTTPPOST_Quite('/silenceRoom/stopTask2', dataType2, token)
                .then((res) => {
                    if (res.code >= 0) {
                        console.log("stopTask2结束");
                        this.setState({
                            disabled: false,
                            count: '0'
                        });
                        this.average(index)
                    } else {
                        Alert.alert(res.msg);
                    }
                }).catch((error) => {
                    Alert.alert('异常', error);
                });
            //
        } else {
            HTTPPOST_Quite('/silenceRoom/stopTask3', dataType1, token)
                .then((res) => {
                    if (res.code >= 0) {
                        console.log("stopTask3结束");
                    } else {
                        Alert.alert(res.msg);
                    }
                }).catch((error) => {
                    Alert.alert('异常', error);
                });
            //
            HTTPPOST_Quite('/silenceRoom/stopTask4', dataType2, token)
                .then((res) => {
                    if (res.code >= 0) {
                        console.log("stopTask4结束");
                        this.setState({
                            disabled: false,
                            count: '0'
                        });
                        this.average(index)
                    } else {
                        Alert.alert(res.msg);
                    }
                }).catch((error) => {
                    Alert.alert('异常', error);
                });
            //
        }

    }

    //获取平均值
    average(index) {
        let { status, user, token } = this.props;
        let theorderno = this.state.orderno;

        if (theorderno == "") {
            Alert.alert('错误', '请扫描排产编号信息！');
            return;
        } 

        let dataType = {
            code1: this.state.code1,
            code2: this.state.code2,
            hth: theorderno,
            type: index,   //0表示环境，1上行，2下行
        }
        HTTPPOST('/silenceRoom/listResultInfo', dataType, token)
            .then((res) => {
                if (res.code >= 0) {
                    let upper = res.list[0]
                    let upper1 = res.list[1]
                    let show = res.list[0].qualified
                    let show1 = res.list[1].qualified
                    if(show == '合格' && show1 == '合格'){
                        this.setState({
                            show: true
                        })
                    }else{
                        this.setState({
                            show: false
                        })
                    }

                    if(index == 0){
                        this.setState({
                            tableData: upper,
                            tableData1: upper1
                        })
                    }else if(index == 1){
                        this.setState({
                            tableData2: upper,
                            tableData3: upper1
                        })
                    }else{
                        this.setState({
                            tableData4: upper,
                            tableData5: upper1
                        })
                    }
                    
                } else {
                    Alert.alert(res.msg);
                }
            }).catch((error) => {
                Alert.alert('异常', error);
            });
        //
    }

    render() {

        const Qdata = [
            {
                data: this.state.data1,
                svg: { stroke: 'purple' },
            },
            {
                data: this.state.data2,
                svg: { stroke: 'green' },
            },
        ]

        const Qdata1 = [
            {
                data: this.state.data3,
                svg: { stroke: 'purple' },
            },
            {
                data: this.state.data4,
                svg: { stroke: 'green' },
            },
        ]

        const Qdata2 = [
            {
                data: this.state.data5,
                svg: { stroke: 'purple' },
            },
            {
                data: this.state.data6,
                svg: { stroke: 'green' },
            },
        ]

        return (
            <Provider>
                <ScrollView >
                    <Header
                        ViewComponent={View}
                        placement="left"
                        leftComponent={{ icon: 'home', color: '#fff', onPress: this.gohome.bind(this) }}
                        centerComponent={{ text: '静音检测', style: { color: '#fff', fontWeight: 'bold' } }}
                        containerStyle={styles.headercontainer}
                        rightComponent={{ icon: 'settings', color: '#fff', onPress: this.muteConfig.bind(this) }}
                    />
                    <WingBlank size="sm">
                        <WhiteSpace size="sm" />
                        <View style={styles.textIconInput}>
                            <Input ref="textInput1"
                                label="排产编号："
                                type="text" value={this.state.orderno}
                                onChangeText={this.checkorderno}
                                onSubmitEditing={this.getparameter.bind(this)}
                                autoFocus={this.state.orderno_focused}
                                style={styles.inputS}
                                keyboardType="email-address"
                                autoFocus={true}
                            />
                        </View>
                        <Picker
                            data={this.state.qchandlemethodes}
                            cols={1}
                            value={this.state.station}
                            onChange={this.onChangeQChandle.bind(this)}

                        >
                            <List.Item arrow="horizontal" style={{ padding: 0, margin: 0, textAlign: "left" }}>
                                <Text style={styles.dialogLabel}>工位：</Text>
                            </List.Item>
                        </Picker>

                        <WhiteSpace size="sm" />
                        <View style={{ flex: 1 }}>
                            <Tabs
                                tabs={this.state.tabs}
                                style={styles.viewPager}
                            >
                                <View>
                                    <View style={{ height: 160, paddingLeft: 10, flexDirection: 'row' }}>
                                        <YAxis
                                            data={ this.state.data1 }
                                            style={{ marginBottom: 30 }}
                                            
                                            contentInset={{ top: 20 }}
                                            svg={{
                                                fill: 'grey',
                                                fontSize: 10,
                                            }}
                                        />
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <LineChart
                                                style={{ height: 160 }}
                                                data={Qdata}
                                                contentInset={{ top: 20, bottom: 20 }}
                                            >
                                                <Grid />
                                            </LineChart>
                                        </View>
                                    </View>
                                    <View style={styles.tabcontainer}>
                                        <View style={styles.head}>
                                            <Text style={styles.title}>位置</Text>
                                            <Text style={styles.title}>最大</Text>
                                            <Text style={styles.title}>最小</Text>
                                            <Text style={styles.title}>平均</Text>
                                        </View>
                                        <View style={styles.body}>
                                            <Text style={styles.text}>上头部</Text>
                                            <Text style={styles.text}>{this.state.tableData.maxValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData.minValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData.averageValue}</Text>
                                        </View>
                                        <View style={styles.body1}>
                                            <Text style={styles.text}>下头部</Text>
                                            <Text style={styles.text}>{this.state.tableData1.maxValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData1.minValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData1.averageValue}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.statusBox}>
                                        <Text style={styles.text1}>检测时间：{this.state.time}(秒)</Text>
                                    </View>

                                    <WhiteSpace size="sm" />
                                    <Flex justify="between">
                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                size='10'
                                                disabled={this.state.disabled}
                                                onPress={() => this.start(0)}
                                                title='开始' />
                                        </View>

                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                onPress={() => this.pause(0)}
                                                title='暂停' />
                                        </View>

                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                onPress={() => this.end(0)}
                                                title='结束' />
                                        </View>
                                    </Flex>

                                </View>

                                <View>
                                    <View style={{ height: 160, paddingLeft: 10, flexDirection: 'row' }}>
                                        <YAxis
                                            data={ this.state.data3 }
                                            style={{ marginBottom: 30 }}
                                            contentInset={{ top: 20 }}
                                            svg={{
                                                fill: 'grey',
                                                fontSize: 10,
                                            }}
                                        />
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <LineChart
                                                style={{ height: 160 }}
                                                data={Qdata1}
                                                contentInset={{ top: 20, bottom: 20 }}
                                            >
                                                <Grid />
                                                <Line
                                                    x1={ '0%' }   //x轴的开始位置
                                                    x2={ '100%' } //x轴的结束位置
                                                    y1={ this.state.bz }    //y轴的开始位置
                                                    y2={ this.state.bz }   //y轴的结束位置
                                                    stroke="red"  //填充颜色
                                                    strokeDasharray= '5'//间隔
                                                />
                                            </LineChart>
                                        </View>
                                    </View>
                                    <View style={styles.tabcontainer}>
                                        <View style={styles.head}>
                                            <Text style={styles.title}>位置</Text>
                                            <Text style={styles.title}>最大</Text>
                                            <Text style={styles.title}>最小</Text>
                                            <Text style={styles.title}>平均</Text>
                                        </View>
                                        <View style={styles.body}>
                                            <Text style={styles.text}>上头部</Text>
                                            <Text style={styles.text}>{this.state.tableData2.maxValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData2.minValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData2.averageValue}</Text>
                                        </View>
                                        <View style={styles.body1}>
                                            <Text style={styles.text}>下头部</Text>
                                            <Text style={styles.text}>{this.state.tableData3.maxValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData3.minValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData3.averageValue}</Text>
                                        </View>
                                    </View>

                                    {
                                        this.state.show ?(
                                            <View style={styles.statusBox}>
                                                <View style={{flex:1}}>
                                                    <Text style={styles.text1}>检测时间：{this.state.time1}(秒)</Text>
                                                </View>
                                                <View style={styles.statusG}></View>
                                                <View style={{flex:1}}></View>
                                            </View>
                                            ) : (
                                            <View style={styles.statusBox}>
                                                <View style={{flex:1}}>
                                                    <Text style={styles.text1}>检测时间：{this.state.time1}(秒)</Text>
                                                </View>
                                                <View style={styles.statusR}></View>
                                                <View style={{flex:1}}></View>
                                            </View>
                                        )
                                    } 

                                    <WhiteSpace size="sm" />
                                    <Flex justify="between">
                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                size='10'
                                                disabled={this.state.disabled}
                                                onPress={() => this.start(1)}
                                                title='开始' />
                                        </View>

                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                onPress={() => this.pause(1)}
                                                title='暂停' />
                                        </View>

                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                //onPress={this.end.bind(this)}
                                                onPress={() => this.end(1)}
                                                title='结束' />
                                        </View>
                                    </Flex>
                                </View>
                                <View>
                                    <View style={{ height: 160, paddingLeft: 10, flexDirection: 'row' }}>
                                        <YAxis
                                            data={ this.state.data5 }
                                            style={{ marginBottom: 30 }}
                                            
                                            contentInset={{ top: 20 }}
                                            svg={{
                                                fill: 'grey',
                                                fontSize: 10,
                                            }}
                                        />
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <LineChart
                                                style={{ height: 160 }}
                                                data={Qdata2}
                                                contentInset={{ top: 20, bottom: 20 }}
                                            >
                                                <Grid />
                                                <Line
                                                    x1={ '0%' }   //x轴的开始位置
                                                    x2={ '100%' } //x轴的结束位置
                                                    y1={ this.state.bz }    //y轴的开始位置
                                                    y2={ this.state.bz }   //y轴的结束位置
                                                    stroke="red"  //填充颜色
                                                    strokeDasharray= '5'//间隔
                                                />
                                            </LineChart>
                                        </View>
                                    </View>
                                    <View style={styles.tabcontainer}>
                                        <View style={styles.head}>
                                            <Text style={styles.title}>位置</Text>
                                            <Text style={styles.title}>最大</Text>
                                            <Text style={styles.title}>最小</Text>
                                            <Text style={styles.title}>平均</Text>
                                        </View>
                                        <View style={styles.body}>
                                            <Text style={styles.text}>上头部</Text>
                                            <Text style={styles.text}>{this.state.tableData4.maxValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData4.minValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData4.averageValue}</Text>
                                        </View>
                                        <View style={styles.body1}>
                                            <Text style={styles.text}>下头部</Text>
                                            <Text style={styles.text}>{this.state.tableData5.maxValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData5.minValue}</Text>
                                            <Text style={styles.text}>{this.state.tableData5.averageValue}</Text>
                                        </View>
                                    </View>

                                    {
                                        this.state.show ?(
                                            <View style={styles.statusBox}>
                                                <View style={{flex:1}}>
                                                    <Text style={styles.text1}>检测时间：{this.state.time2}(秒)</Text>
                                                </View>
                                                <View style={styles.statusG}></View>
                                                <View style={{flex:1}}></View>
                                            </View>
                                            ) : (
                                            <View style={styles.statusBox}>
                                                <View style={{flex:1}}>
                                                    <Text style={styles.text1}>检测时间：{this.state.time2}(秒)</Text>
                                                </View>
                                                <View style={styles.statusR}></View>
                                                <View style={{flex:1}}></View>
                                            </View>
                                        )
                                    } 

                                    <WhiteSpace size="sm" />
                                    <Flex justify="between">
                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                size='10'
                                                disabled={this.state.disabled}
                                                onPress={() => this.start(2)}
                                                title='开始' />
                                        </View>

                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                onPress={() => this.pause(2)}
                                                title='暂停' />
                                        </View>

                                        <View style={styles.clickButton}>
                                            <Button backgroundColor='#6495ed' activeOpacity={1}
                                                onPress={() => this.end(2)}
                                                title='结束' />
                                        </View>
                                    </Flex>
                                </View>
                                {/* <View>
                                    <ScrollView style={styles.parameterlist}>
                                        {
                                            this.state.datalist.map((l,i) => (
                                                <ListItem
                                                    //roundAvatar={false}
                                                    key={i}
                                                    title={l.name}
                                                    subtitle={l.value}
                                                    containerStyle={{ padding: 0, margin: 0 }}
                                                />
                                            ))
                                        }
                                    </ScrollView>
                                </View> */}
                            </Tabs>
                        </View>

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
)(QuietRoom)

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
        justifyContent: 'flex-start',
    },
    textW: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputS: {
        paddingRight: 0, marginRight: 0,
    },
    clickButton: {
        width: 80
    },
    viewPager: {
        flex: 1,
        height: 440,
        backgroundColor: '#fff',
    },
    tabColor: {
        fontSize: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#527fe4',
    },
    tabcontainer: { 
        backgroundColor: '#fff',
        marginBottom: 10
    },
    head: { 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
        height: 30
    },
    body: { 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
        height: 31
    },
    body1: { 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
    },
    title: { 
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 30, 
        backgroundColor: '#f1f8ff',
        borderWidth: 1,
        
    },
    text: { 
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 30, 
        borderWidth: 1,
    },
    text1: { 
        flex: 1,
        fontSize: 14,
        lineHeight: 30, 
    },
    parameterlist: {
        paddingTop: 0,
        paddingBottom: 0,
        height: 480,
    },
    statusBox: {
        flexDirection:"row",
        height:50,
        marginBottom: 10
    },
    statusG: {
        backgroundColor: 'green',
        width: 50,
        height: 50,
        borderRadius: 25
    },
    statusR: {
        backgroundColor: 'red',
        width: 50,
        height: 50,
        borderRadius: 25
    },
    dialogLabel: {
        textAlign: 'left',
        fontSize: 16,
        padding: 0, margin: 0
    },
});