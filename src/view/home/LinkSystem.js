"use strict";
import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image,VirtualizedList } from 'react-native';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

//首页关注清单列表
class LinkSystem extends React.PureComponent {
    constructor(props) {
        super(props);


        this.state = {
            linksystemes: [
                { title: 'SAP', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'PCS', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'SRM', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'CRM', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'MES', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'SAP', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'PCS', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'SRM', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'CRM', img: require("../../assets/images/systemicon/default_application.png") },
                { title: 'MES', img: require("../../assets/images/systemicon/default_application.png") }
            ]
        };


    }



    renderLinksystemItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.linkItem}>
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
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderLinksystemItem}
                    horizontal={true}
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
        
        margin:10,marginTop: 0,
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
