import React, {Component} from 'react';
import {View, StyleSheet, Text, Flatlist, TouchableOpacity} from 'react-native';
import {ListItem} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';
import { RFValue } from 'react-native-responsive-fontsize';

export default class MyReceivedItemsScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId : firebase.auth().currentUser.email,
      receivedItemsList : []
    }
    this.requestRef = null
  }

  geReceivedItemsList = ()=>{
    this.requestRef = db.collection("requestedItems").where('userId','==',this.state.userId).where("itemStatus",'==','received')
    .onSnapshot((snapshot)=>{
      var receivedItemsList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedItemsList : receivedItemsList
      });
    })
  }

  componentDidMount(){
    this.geReceivedItemsList()
  }

  componentWillUnmount(){
    this.requestRef
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({item, i})=>{
    console.log(item.itemName);
    return(
      <ListItem
        key = {i}
        title = {item.itemName}
        subtitle = {item.bookStatus}
        titleStyle = {{color : 'black', fontWeight : 'bold'}}
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style = {{flex : 1}}>
        <MyHeader title = "Received Items" navigation = {this.props.navigation}/>
        <View style = {{flex : 1}}>
        {
          this.state.receivedItemsList.length === 0?(
            <View style = {StyleSheet.subContainer}>
              <Text style = {{fontSize : RFValue(20)}}>List of all Received Items</Text>
            </View>
          ):(
            <Flatlist
              keyExtractor = {this.keyExtractor}
              data = {this.state.receivedItemsList}
              renderItem = {this.renderItem}
            />
          )
        }
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: RFValue(20),
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})