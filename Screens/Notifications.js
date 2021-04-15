import firebase from "firebase";
import React from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, FlatList , Image} from "react-native";
import DB from "../config";
import Head from "../Components/myHeader";

export default class NotificationsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      diplayList: [],
      reciever: firebase.auth().currentUser.email,
    };
    this.ref = null;
  }

  fetchDisplayList = () => {
    this.ref = DB.collection("Notifications")
      .where("RecieverUser", "==", this.state.reciever)
      .where("status", "==", "unread")
      .onSnapshot((documents) => {
        var arr = [];
        documents.docs.map((info) => {
          var data = info.data();
          arr.push(data);
        });
        this.setState({
          diplayList: arr,
        });
      });
  };

  /*   sentBook = (item) => {
    DB.collection("Donations").doc(item.docID).update({
      status: "Donation Accepted",
    });
  }; */

  componentDidMount() {
    this.fetchDisplayList();
  }

  render() {
    console.log(this.state.diplayList);
    return (
      <View style={styles.container}>
        <Head t="Notifications"  navigation={this.props.navigation}></Head>
        <View style={{ flex: 1 }}>
          {this.state.diplayList.length === 0 ? (
            <View style={styles.subContainer}>
              <Image source = {require('../assets/Images/Notification.png')}></Image>
              <Text style={{ fontSize: 20 }}>No Notifications</Text>

            </View>
          ) : (
            <FlatList
              data={this.state.diplayList}
              renderItem={({ item }) => (
                <View style={styles.listContainer}>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                      {item.bookName}
                    </Text>
                    <Text>{item.Message}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            ></FlatList>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9cc2ff'
  },

  listContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 20,
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

  title: {
    fontSize: 30,
  },
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
