import React from "react";
import { ToastAndroid, TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Input} from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import DB from "../config";
import * as firebase from "firebase";
import { Alert } from "react-native";
import Head from "../Components/myHeader";

export default class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      user: firebase.auth().currentUser.email,
      contact: "",
      address: "",
      edit: false,
      docID: null,
    };
  }

  userDetails = () => {
    var u = this.state.user;
    DB.collection("Users")
      .where("EmailID", "==", u)
      .get()
      .then((documents) => {
        documents.forEach((doc) => {
          var ss = doc.data();
          this.setState({
            contact: ss.Phone,
            address: ss.Address,
            docID: doc.id,
          });
        });
      });
  };

  updateDetail = () => {
    console.log("hi");
    DB.collection("Users").doc(this.state.docID).update({
      Phone: this.state.contact,
      Address: this.state.address,
    });
    this.setState({
      edit: false,
    });

    ToastAndroid.show("Profile Updated Successfully", ToastAndroid.SHORT);
  };

  componentDidMount() {
    this.userDetails();
  }

  render() {
    return (
      <View style={{ flex: 1 ,    backgroundColor: '#9cc2ff'}}>
        <Head t="Your Profile"  navigation={this.props.navigation}></Head>
        <View style={{ marginTop: 20, flex: 1 }}>
          <View style={styles.inputContainer}>
             <Text>Email ID:</Text> 
            <Input
              placeholder="Email"
              onChangeText={(mail) => {
                this.setState({ user: mail });
              }}
              keyboardType="email-address"
              value={this.state.user}
              style={styles.input}
              editable={false}
              
            ></Input>
          </View>
          <View style={styles.inputContainer}>
            <Text>Contact Number:</Text>
            <Input
              placeholder="Contact"
              onChangeText={(no) => {
                this.setState({ contact: no });
              }}
              keyboardType="number-pad"
              value={this.state.contact}
              style={styles.input}
              editable={this.state.edit}
            ></Input>
          </View>

          <View style={styles.inputContainer}>
            <Text>Address:</Text>
            <Input
              placeholder="address"
              onChangeText={(ad) => {
                this.setState({ address: ad });
              }}
              value={this.state.address}
              style={styles.input}
              editable={this.state.edit}
            ></Input>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({
                  edit: true,
                });
              }}
            >
              <Text style={{ color: "#ffffff" }}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateDetail();
              }}
              disabled={!this.state.edit}
            >
              <Text style={{ color: "#ffffff" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderStyle: "solid",
    borderWidth: 2,
    width: 200,
    marginLeft: 50,
    textAlign: "center",
    borderRadius: 5,
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
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
