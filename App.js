import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Open from "./Screens/open";
import DonationScreen from "./Screens/Donation";
import RequestScreen from "./Screens/Request";
import RecieverScreen from "./Screens/Reciever";
import MyDonationsScreen from "./Screens/MyDonations";
import NotificationScreen from "./Screens/Notifications";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";
import Profile from "./Screens/Profile";
import Menu from "./Components/CustomMenu";
import { createStackNavigator } from "react-navigation-stack";
import { Icon } from "react-native-elements";

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const Stacknav = createStackNavigator(
  {
    Donation: {
      screen: DonationScreen,
      navigationOptions: { headerShown: false },
    },
    Reciever: { screen: RecieverScreen },
  },
  { initialRouteName: "Donation" }
);
const Navtab = createBottomTabNavigator({
  Donate: { screen: Stacknav },
  Request: { screen: RequestScreen },
});

const Drawernav = createDrawerNavigator(
  {
    Home: {
      screen: Navtab,
      navigationOptions: {
        drawerIcon: 
          <Icon name="home" type="font-awesome" color="#000000"></Icon>
        
      },
    },
    Profile: { screen: Profile  ,
      navigationOptions: {
        drawerIcon: 
          <Icon name="user" type="font-awesome" color="#000000"></Icon>
        
      },},
    My_Donations: { screen: MyDonationsScreen , 
      navigationOptions: {
        drawerIcon: 
          <Icon name="gift" type="font-awesome" color="#000000"></Icon>
        
      }, },
    Notifications: { screen: NotificationScreen ,
      navigationOptions: {
        drawerIcon: 
          <Icon name="bell" type="font-awesome" color="#000000"></Icon>
        
      },},
  },
  { contentComponent: Menu },
  { initialRouteName: "Home" }
);

const Appnav = createSwitchNavigator({
  Open: { screen: Open },
  Drawernav: { screen: Drawernav },
  Stacknav: { screen: Stacknav },
});

const AppContainer = createAppContainer(Appnav);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
