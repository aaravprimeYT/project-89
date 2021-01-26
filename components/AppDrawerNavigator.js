import React from 'react'
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import customSidebarMenu  from './customSidebarMenu';
import MyBartersScreen from '../screens/MyBartersScreen';
import SettingScreen from '../screens/SettingScreen';
import NotificationScreen from '../screens/NotificationsScreen';
import {Icon} from 'react-native-elements'

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator,
    navigationOptions:{
      drawerIcon:<Icon name="home" type="fontawesome5"/>,
      drawerLabel:"Settings"
  }
    },
  MyBarters:{
      screen : MyBartersScreen,
      navigationOptions:{
        drawerIcon:<Icon name="trade" type="font-awesome"/>,
        drawerLabel:"My Barters Screen"
    }
    },
  Notifications :{
    screen : NotificationScreen,
    navigationOptions:{
      drawerIcon:<Icon name="notifications" type="fontawesome5"/>,
      drawerLabel:"Notifications Screen"
  }
  },
    Setting : {
      screen : SettingScreen,
      navigationOptions:{
        drawerIcon:<Icon name="settings" type="fontawesome5"/>,
        drawerLabel:"Settings"
    }
    }
},
  {
    contentComponent:customSidebarMenu
  },
  {
    initialRouteName : 'Home'
  })