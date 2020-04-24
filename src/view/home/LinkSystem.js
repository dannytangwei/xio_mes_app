"use strict";
import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

//首页关注清单列表
class LinkSystem extends React.PureComponent {
    constructor(props) {
        super(props);


        this.state = {
            linksystemes: [
                { id: 1, key: 'SAP', title: 'SAP', img: require("../../assets/images/systemicon/default_application.png") },
                { id: 2, key: 'PCS', title: 'PCS', img: require("../../assets/images/systemicon/default_application.png") },
                { id: 3, key: 'SRM', title: 'SRM', img: require("../../assets/images/systemicon/default_application.png") },
                { id: 4, key: 'CRM', title: 'CRM', img: require("../../assets/images/systemicon/default_application.png") },
                { id: 5, key: 'MES', title: 'MES', img: require("../../assets/images/systemicon/default_application.png") }
            ]
        };
    }
    _keyExtractor = (item, index) => item.id;

    renderLinksystemItem = ({ item }) => {
        return (
            <TouchableOpacity name={item.key} style={styles.linkItem}>
                <Image source={item.img} style={styles.linkimg} />
                <View style={styles.linktitleContainer}>
                    <Text style={styles.linktitle} numberOfLines={1}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.moduleBox}>
                <FlatList
                    data={this.state.linksystemes}
                    keyExtractor={item => item.id.toString()}
                    renderItem={this.renderLinksystemItem}
                    horizontal={true}
                    id="systemLinkList"
                />
            </View>
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
    moduleBox: {
        width: width,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 0,
        marginTop: 0,

    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        padding: 15,
    },
    linkItem: {
        width: 75,
        marginLeft: 0,
    },
    linkImg: {
        width: 75,
        height: 75,
        borderWidth: 0.5,
        borderColor: '#cdcdcd',
        borderRadius: 2,
    },
    linktitleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

        margin: 10, marginTop: 0,
    },
    linktitle: {
        fontSize: 16,
        color: '#666',
    }
});



export default connect(
    (state) => ({
        status: state.loginIn.status,
        user: state.loginIn.user,
        token: state.loginIn.token
    })
)(LinkSystem)
