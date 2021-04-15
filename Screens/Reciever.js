import React from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, Alert } from "react-native";
import { Card } from "react-native-elements";
import DB from "../config";
import firebase from "firebase";
import Head from "../Components/myHeader";

export default class RecieverScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      book: this.props.navigation.getParam("book")["RequestedBook"],
      time: this.props.navigation.getParam("book")["DurationRequestedFor"],
      reciever: this.props.navigation.getParam("book")["User"],
      request: this.props.navigation.getParam("book")["RequestID"],
      phone: "",
      address: "",
    };
  }

  fetchRecieverDetails = () => {
    DB.collection("Users")
      .where("EmailID", "==", this.state.reciever)
      .get()
      .then((detail) => {
        detail.forEach((info) => {
          var ss = info.data();
          this.setState({
            phone: ss.Phone,
            address: ss.Address,
          });
        });
      });
  };

  Donate = () => {
    Alert.alert(this.state.reciever + " has been informed");
    DB.collection("Notifications").add({
      HostUser: firebase.auth().currentUser.email,
      RecieverUser: this.state.reciever,
      bookName: this.state.book,
      RequestID: this.state.request,
      status: "unread",
      Reason: "Donation Requested",
      Message:
        firebase.auth().currentUser.email +
        " has shown Interest in Donating you " +
        this.state.book,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    DB.collection("Donations").add({
      Book: this.state.book,
      reciever: this.state.reciever,
      Donor: firebase.auth().currentUser.email,
      status: "Donation Requested",
      RequestID: this.state.request,
    });
  };

  componentDidMount() {
    this.fetchRecieverDetails();
  }

  render() {
    console.log(this.props.navigation.getParam("book"));
    return (
      <View style={{ flex: 1  ,   backgroundColor: '#9cc2ff' }}>
        <Card title={"Book Information"} titleStyle={{ fontSize: 50 }}>
          <Card>
            <Text>Book Name: {this.state.book}</Text>
          </Card>
          <Card>
            <Text>Duration: {this.state.time}</Text>
          </Card>
        </Card>

        <Card title={"Reciever Information"} titleStyle={{ fontSize: 50 }}>
          <Card>
            <Text>Reciever Mail: {this.state.reciever}</Text>
          </Card>
          <Card>
            <Text>Phone no.: {this.state.phone}</Text>
          </Card>
          <Card>
            <Text>Address: {this.state.address}</Text>
          </Card>
        </Card>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.Donate();
            this.props.navigation.navigate("Donation");
          }}
        >
          <Text style={{ color: "#ffffff" }}>Donate</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "#000000",
  },

  button: {
    marginHorizontal: 20,
    backgroundColor: "#4285F4",
    height: 30,
    width: 75,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 2,
  },
});
