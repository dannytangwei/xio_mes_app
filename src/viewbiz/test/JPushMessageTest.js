import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableHighlight, ScrollView } from 'react-native';
import JPush from 'jpush-react-native';
import { Header } from 'react-native-elements';

class Button extends React.Component {
    render() {
        return <TouchableHighlight
            onPress={this.props.onPress}
            underlayColor='#e4083f'
            activeOpacity={0.5}
        >
            <View
                style={styles.setBtnStyle}>
                <Text
                    style={styles.textStyle}>
                    {this.props.title}
                </Text>
            </View>
        </TouchableHighlight>
    }
}

export default class ChatWith extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        JPush.init();
        //连接状态
        this.connectListener = result => {
            console.log("connectListener:" + JSON.stringify(result))
        };
        JPush.addConnectEventListener(this.connectListener);
        //通知回调
        this.notificationListener = result => {
            console.log("notificationListener:" + JSON.stringify(result))
        };
        JPush.addNotificationListener(this.notificationListener);
        //本地通知回调
        this.localNotificationListener = result => {
            console.log("localNotificationListener:" + JSON.stringify(result))
        };
        JPush.addLocalNotificationListener(this.localNotificationListener);
        //自定义消息回调
        this.customMessageListener = result => {
            console.log("customMessageListener:" + JSON.stringify(result))
        };
        JPush.addCustomMessagegListener(this.customMessageListener);
        //tag alias事件回调
        this.tagAliasListener = result => {
            console.log("tagAliasListener:" + JSON.stringify(result))
        };
        JPush.addTagAliasListener(this.tagAliasListener);
        //手机号码事件回调
        this.mobileNumberListener = result => {
            console.log("mobileNumberListener:" + JSON.stringify(result))
        };
        JPush.addMobileNumberListener(this.mobileNumberListener);
    }
    gohome() {
        const { navigate } = this.props.navigation;
        navigate('Index');
    }
    render() {
        return (<ScrollView>
            <Header
                ViewComponent={View }
                placement="left"
                leftComponent={{ icon: 'home', color: '#fff', onPress: this.gohome.bind(this) }}
                centerComponent={{ text: '消息推送功能测试', style: { color: '#fff', fontWeight: 'bold' } }}
                containerStyle={styles.headercontainer}
            />
            <View style={styles.container}>
                <Button title="setLoggerEnable"
                    onPress={() => JPush.setLoggerEnable(true)
                    } />

                <Button title="getRegisterID"
                    onPress={() => JPush.getRegistrationID(result =>
                        console.log("registerID:" + JSON.stringify(result))
                    )} />

                <Button title="addTags"
                    onPress={() => JPush.addTags({ sequence: 1, tags: ["1", "2", "3"] })} />
                <Button title="updateTags"
                    onPress={() => JPush.updateTags({ sequence: 2, tags: ["4", "5", "6"] })} />
                <Button title="deleteTag"
                    onPress={() => JPush.deleteTag({ sequence: 3, tags: ["4", "5", "6"] })} />
                <Button title="deleteTags"
                    onPress={() => JPush.deleteTags({ sequence: 4 })} />
                <Button title="queryTag"
                    onPress={() => JPush.queryTag({ sequence: 4, tag: "1" })} />
                <Button title="queryTags"
                    onPress={() => JPush.queryTags({ sequence: 5 })} />
                <Button title="setAlias"
                    onPress={() => JPush.setAlias({ sequence: 6, alias: "xxx" })} />
                <Button title="deleteAlias"
                    onPress={() => JPush.deleteAlias({ sequence: 7 })} />
                <Button title="queryAlias"
                    onPress={() => JPush.queryAlias({ sequence: 8 })} />
                <Button title="setMobileNumber"
                    onPress={() => JPush.setMobileNumber({ mobileNumber: "18058125312" })} />

                <Button title="initCrashHandler"
                    onPress={() => JPush.initCrashHandler()} />
                <Button title="addLocalNotification"
                    onPress={() => JPush.addLocalNotification({
                        messageID: "123456789",
                        title: "title123",
                        content: "content123",
                        extras: { "key123": "value123" }
                    })} />
                <Button title="removeLocalNotification"
                    onPress={() => JPush.removeLocalNotification({ messageID: '123456789' })} />

            </View>
        </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    setBtnStyle: {
        width: 320,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3e83d7',
        borderRadius: 8,
        backgroundColor: '#3e83d7',
        padding: 2
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 20,
        color: '#ffffff'
    },
    headercontainer: {
        marginTop: 0,
        paddingTop: 0,
        height: 50,
    }
});