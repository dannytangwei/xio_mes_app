
import 'react-native-get-random-values';
import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import {
    ActivityIndicator,
} from '@ant-design/react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class WebViewH5 extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    //在渲染前调用,在客户端也在服务端
    UNSAFE_componentWillMount() {
        let { status } = this.props;
        const { navigate } = this.props.navigation;
        if (status != '1') {
            navigate('Login');
        }
    }
    componentWillUnmount() {

    }

    //回到主页
    gohome() {
        const { navigate } = this.props.navigation;
        navigate('Index');
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    ViewComponent={View}
                    placement="left"
                    leftComponent={{ icon: 'home', color: '#fff', onPress: this.gohome.bind(this) }}
                    centerComponent={{ text: '第三方接入', style: { color: '#fff', fontWeight: 'bold' } }}
                    containerStyle={styles.headercontainer}
                />
                <WebView
                    style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                    source={{ uri: "http://srm.xiolift.com/" }}
                    startInLoadingState={true}
                />
            </View>

        );
    }
}

export default connect(
    (state) => ({
        status: state.loginIn.status,
        user: state.loginIn.user,
        token: state.loginIn.token
    })
)(WebViewH5)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    headercontainer: {
        marginTop: 0,
        paddingTop: 0,
        height: 50,
    },
    webview: {
        width: SCREEN_WIDTH,

        height: SCREEN_HEIGHT
    }
});