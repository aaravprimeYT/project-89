import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput,KeyboardAvoidingView,TouchableOpacity,Alert, ToastAndroid } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader'
import {RFValue} from 'react-native-responsive-fontsize'
import {Input} from 'react-native-elements'

export default class Exchange extends Component {

  constructor(){
    super()
    this.state = {
      userName : firebase.auth().currentUser.email,
      itemName : "",
      description : "",
      requestedItemName:"",
      exchangeId:"",
      itemStatus:"",
      docId: "",
      itemValue:"",
      currencyCode:""

    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addItem= async(itemName, description)=>{

    var userName = this.state.userName
    var exchangeId = this.createUniqueId()
    console.log("im called",exchangeId);
    db.collection("exchangeRequests").add({
      "username"    : userName,
      "itemName"   : itemName,
      "description" : description,
      "exchangeId"  : exchangeId,
      "itemStatus" : "requested",
      "itemValue"  : this.state.itemValue,
        "date"       : firebase.firestore.FieldValue.serverTimestamp()

     })

     await this.getExchangeRequest()
     db.collection('users').where("username","==",userName).get()
   .then()
   .then((snapshot)=>{
     snapshot.forEach((doc)=>{
       db.collection('users').doc(doc.id).update({
     IsExchangeRequestActive: true
     })
   })
 })

     this.setState({
       itemName : '',
       description :'',
       itemValue : ""
     })




     return Alert.alert(
          'Item ready to exchange',
          '',
          [
            {text: 'OK', onPress: () => {

              this.props.navigation.navigate('HomeScreen')
            }}
          ]
      );
  }


  getIsExchangeRequestActive(){
    db.collection('users')
    .where('username','==',this.state.userName)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsExchangeRequestActive:doc.data().IsExchangeRequestActive,
          userDocId : doc.id,
          currencyCode: doc.data().currencyCode
        })
      })
    })
  }

  getExchangeRequest =()=>{
  var exchangeRequest=  db.collection('exchangeRequests')
    .where('username','==',this.state.userName)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().itemStatus !== "received"){
          this.setState({
            exchangeId : doc.data().exchangeId,
            requestedItemName: doc.data().itemName,
            itemStatus:doc.data().itemStatus,
            itemValue : doc.data().itemValue,
            docId     : doc.id
          })
        }
      })
  })
}

getData(){
  fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
  .then(response=>{
    return response.json();
  }).then(responseData =>{
    var currencyCode = this.state.currencyCode
    var currency = responseData.rates.INR
    var value =  69 / currency
    console.log(value);
  })
  }




  componentDidMount(){
    this.getExchangeRequest()
    this.getIsExchangeRequestActive()
    this.getData()
  }


  receivedItem=(itemName)=>{
    var userId = this.state.userName
    var exchangeId = this.state.exchangeId
    db.collection('receivedItems').add({
        "userId": userId,
        "itemName":itemName,
        "exchangeId"  : exchangeId,
        "itemStatus"  : "received",

    })
  }

  updateExchangeRequestStatus=()=>{
    db.collection('requestedRequests').doc(this.state.docId)
    .update({
      itemStatus : 'recieved'
    })

    db.collection('users').where('username','==',this.state.userName).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        db.collection('users').doc(doc.id).update({
          IsExchangeRequestActive: false
        })
      })
    })

}
  sendNotification=()=>{
    db.collection('users').where('username','==',this.state.userName).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().firstName
        var lastName = doc.data().lastName

        db.collection('allNotifications').where('exchangeId','==',this.state.exchangeId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donorId
            var bookName =  doc.data().itemName

            db.collection('allNotifications').add({
              "targetedUserId" : donorId,
              "message" : name +" " + lastName + " received the item " + itemName ,
              "notificationStatus" : "unread",
              "itemName" : itemName
            })
          })
        })
      })
    })
  }

  render()
  {
    if (this.state.IsExchangeRequestActive === true){
      return(
        <View style = {{flex:1,justifyContent:'center'}}>
         <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
         <Text>Item Name</Text>
         <Text>{this.state.requestedItemName}</Text>
         </View>
         <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
         <Text> Item Value </Text>

         <Text>{this.state.itemValue}</Text>
         </View>
         <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
         <Text> Item Status </Text>

         <Text>{this.state.itemStatus}</Text>
         </View>

         <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
         onPress={()=>{
           this.sendNotification()
           this.updateExchangeRequestStatus();
           this.receivedItem(this.state.requestedItemName)
         }}>
         <Text>I recieved the Item </Text>
         </TouchableOpacity>
       </View>
     )

    }
    else {
      return(
        <View style={{flex:1}}>
        <MyHeader title="Add Item" navigation ={this.props.navigation}/>
        <KeyboardAvoidingView style={{flex:1,justifyContent:'center', alignItems:'center'}}>
        <Input
          style={styles.formTextInput}
          label={"Item Name"}
          placeholder={"Item name"}
          containerStyle={{ marginTop: RFValue(60) }}
          onChangeText={(text) => this.getData(text)}
          onClear={(text) => this.getData("")}
          value={this.state.itemName}
        />
        <Input
          style={styles.formTextInput}
          label={"Item Description"}
          placeholder={"Item Description"}
          containerStyle={{ marginTop: RFValue(60) }}
          onChangeText={(text) => this.getData(text)}
          onClear={(text) => this.getData("")}
          value={this.state.description}
        />
        <Input
          style={styles.formTextInput}
          label={"Item Value"}
          placeholder={"Item Value"}
          containerStyle={{ marginTop: RFValue(60) }}
          onChangeText={(text) => this.getData(text)}
          onClear={(text) => this.getData("")}
          value={this.state.itemValue}
        />
          <TouchableOpacity
            style={[styles.button,{marginTop:10}]}
            onPress = {()=>{this.addItem(this.state.itemName, this.state.description)}}
            >
            <Text style={{color:'#ffff', fontSize:RFValue(18), fontWeight:'bold'}}>Add Item</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },

})