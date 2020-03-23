"use strict";
import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Tabs } from '@ant-design/react-native';


//首页关注清单列表
class FocusTabs extends React.PureComponent {
    constructor(props) {
        super(props);


        this.state = {
            TabSelected: 0,
            tabs: [
                { title: '生产' },
                { title: '物流' },
                { title: '品质' },
                { title: '设备' },
                { title: '安全' },
            ]
        };

        this.renderTabList.bind(this);
    }

    renderTabList(index) {
        this.setState({ TabSelected: index });
        console.info(index);
    }

    render() {
        return (
            <Tabs tabs={this.state.tabs} style={styles.viewPager}
                initialPage={2}
                page={this.state.TabSelected}
                onTabClick={(tab, index) => this.renderTabList(index)}>
                <View style={styles.tabitem}>
                    <Text>111Content of Tab</Text>
                </View>
                <View style={styles.tabitem}>
                    <Text>222Content of Tab</Text>
                </View>
                <View style={styles.tabitem}>
                    <Text>333Content of Tab</Text>
                </View>
                <View style={styles.tabitem}>
                    <Text>444Content of Tab</Text>
                </View>
                <View style={styles.tabitem}>
                    <Text>555Content of Tab</Text>
                </View>
            </Tabs >
        );
    }
}


const styles = StyleSheet.create({
    tabitem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 456,
        backgroundColor: '#fff',
    },
    viewPager: {
        flex: 1,
        height: 500,
        backgroundColor: '#cccccc',
    },
});


export default connect(
    (state) => ({
        status: state.loginIn.status,
        user: state.loginIn.user,
        token: state.loginIn.token
    })
)(FocusTabs)
