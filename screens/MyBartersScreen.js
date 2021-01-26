import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'
import { RFValue } from 'react-native-responsive-fontsize';

export default class MyBartersScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       allBarters : []
     }
     this.requestRef= null
   }

   sendNotification = (description,requestStatus) => {
    var requestId = description.requestId;
    var donorId = description.donorId
    db.collection("all_notifications").where("requestId", "==" , requestId).where("donorId", "==", donorId).get().then((snapShot) => {
      snapShot.forEach((doc) => {
        var message = ""
        if (requestStatus === "itemSent") {
          message = this.state.donorName + "Has sent the item"
        }
        else {
          message = this.state.donorName = "Has Shown Interest In giving the item"
        }
        db.collection("all_notifications").doc(doc.id).update({
          message:message,
          notificationStatus:"unread",
          date:firebase.firestore.FieldValue.serverTimestamp()
        })
      })
    })
  }

  sendItem = (description) => {
    if (description.requestStatus==="itemSent") {
      var requestStatus = "donorInterested"
      db.collection("all_notifications").doc(description.doc_Id).update({requestStatus:"donorInterested"})
      this.sendNotification(description,requestStatus)
    }
    else { 
      var requestStatus = "itemSent"
      db.collection("all_notifications").doc(description.doc_Id).update({requestStatus:"itemSent"})
      this.sendNotification(description,requestStatus)
    }
  }

   getAllBarters =()=>{
     this.requestRef = db.collection("all_Barters").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allBarters = snapshot.docs.map(document => document.data());
       this.setState({
         allBarters : allBarters,
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.item_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.requestStatus}
       leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={styles.button} onPress={this.sendItem(item)}>
             <Text style={{color:'#ffff'}}>Exchange</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getAllBarters()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex:1}}>
           {
             this.state.allBarters.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: RFValue(20)}}>List of all Barters</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allBarters}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
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
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: RFValue(20),
    justifyContent:'center',
    alignItems:'center'
  }
})