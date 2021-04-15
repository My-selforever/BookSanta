import firebase from "firebase";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge, Header, Icon } from "react-native-elements";
import DB from "../config";
export default class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifs: 0,
    };
  }

  Countnotifications = () => {
    DB.collection("Notifications").where(
      "RecieverUser",
      "==",
      firebase.auth().currentUser.email
    )
    .where("status","==",'unread')
    .onSnapshot((documents)=>{
      var arr = []
      documents.docs.map((doc)=>{
        arr.push(doc)
      })
      this.setState({
        notifs:arr.length
      })
    })
  };

  componentDidMount(){
    this.Countnotifications()
  }

  render() {
    return (
      <Header
        leftComponent={
          <Icon
            name="bars"
            type="font-awesome"
            color="#ffffff"
            onPress={() => {
              this.props.navigation.toggleDrawer();
            }}
          ></Icon>
        }
        centerComponent={{
          text: this.props.t,
          style: {
            fontSize: 20,
            color: "#ffffff",
          },
        }}
        rightComponent={
          <View>
            <Icon
              name="bell"
              type="font-awesome"
              color="#ffffff"
              size={40}
              onPress={() => {
                this.props.navigation.navigate("Notifications");
              }}
            />
            <Badge
              value={this.state.notifs}
              containerStyle={{
                position: "absolute",
              }}
            ></Badge>
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  head: {
    fontFamily: "Comic Sans MS",
    fontSize: 20,
    color: "#ffffff",
  },
});
