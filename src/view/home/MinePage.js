"use strict";

import React, { Component } from 'react';

import { ScrollView, Text, TouchableWithoutFeedback, View, StyleSheet, Image, Dimensions, TouchableOpacity, Modal, Alert } from 'react-native';
import { WhiteSpace, WingBlank, Flex, Carousel, Card, List, Portal, Toast, Provider,Button } from '@ant-design/react-native';
import {  Avatar } from 'react-native-elements';
 
import { connect } from 'react-redux';
const Item = List.Item;
// import ErrorUtils from "ErrorUtils";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// ErrorUtils.setGlobalHandler((e) => {

//     //发生异常的处理方法,当然如果是打包好的话可能你找都找不到是哪段代码出问题了
//     Alert.alert("异常", JSON.stringify(e))
// });
class MinePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
            
           
           
            
        }
    }

    


    //在渲染前调用,在客户端也在服务端
    UNSAFE_componentWillMount() {
        const { navigate } = this.props.navigation;
         let { status, user, token } = this.props;
      
        if (status != '1') {
            navigate('Login');
        }

        if (token) {
            //let adobj = [];

            // HTTPGET('/sm/show-picture/ad1', token)
            //     .then((res) => {
            //         adobj.push(res);
            //         this.setState({ index_ades: adobj });
            //     }).catch((error) => {
            //         Alert.alert(error);

            //     });
        }

    }

    logout(){
        const { navigate } = this.props.navigation;
        this.props.dispatch(loginAction.loginout());
        navigate('Login');
    }
    

    render() {
        
        let { status, user } = this.props;
        //Alert.alert(user.barRoleText);
        return (
            <Provider>
                <ScrollView

                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={true}
                >
                    <WingBlank size="sm">
                        <WhiteSpace size='sm' />
                        <Card >
                            <Card.Body>

                                <Flex justify="between">
                                    <View style={styles.mycardTitle}>
                                        <Text style={styles.mycardTitleFont}>{user.cname}</Text>
                                        <Text>{"公司：" + user.companysID}</Text>
                                        <Text>{"职务："}</Text>
                                    </View>
                                    <View style={styles.mycardAvatar}>
                                        <Avatar
                                            size="medium"
                                            rounded
                                            title="MT"
                                            onPress={() => console.log("Works!")}
                                            activeOpacity={0.7}
                                        />
                                    </View>
                                </Flex>

                            </Card.Body>
                        </Card>
                        <WhiteSpace size='lg' />


                    </WingBlank>
                     <List  >
                         <Item> <Button type="warning"  onPress={this.logout.bind(this)}>注销账号</Button>
                             </Item>
                    
                    </List>
                    

                </ScrollView>

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
)(MinePage)

const styles = StyleSheet.create({
    
    mycardTitle: {
        padding: 10,
        width: 200,
        alignContent: 'flex-end',
    },
    mycardAvatar: {
        padding: 10,
        width: 200,
        flex: 1,
        alignItems: 'flex-end',
    },
    mycardTitleFont: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});