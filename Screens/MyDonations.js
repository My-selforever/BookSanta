import firebase from "firebase";
import React from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Head from "../Components/myHeader";
import DB from "../config";

export default class MyDonationsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      diplayList: [],
      donor: firebase.auth().currentUser.email,
      sent: false,
    };
    this.ref = null;
  }

  fetchDisplayList = () => {
    this.ref = DB.collection("Donations")
      .where("Donor", "==", this.state.donor)
      .onSnapshot((documents) => {
        var arr = [];
        documents.docs.map((info) => {
          var data = info.data();
          data["docID"] = info.id;
          if (data.status === "Donation Requested") {
            data["sent"] = false;
          } else {
            data["sent"] = true;
          }
          arr.push(data);
        });
        this.setState({
          diplayList: arr,
        });
      });
  };

  sentBook = (item) => {
    DB.collection("Donations").doc(item.docID).update({
      status: "Donation Accepted",
    });
  };

  updateNotif = (item) => {
    var a;
    DB.collection("Notifications")
      .where("RequestID", "==", item.RequestID)
      .where("HostUser", "==", this.state.donor)
      .get()
      .then((documents) => {
        documents.docs.map((doc) => {
          DB.collection("Notifications")
            .doc(doc.id)
            .update({
              Message: this.state.donor + " has sent the book to you",
              Reason: "Donation Sent",
            });
        });
      });
    console.log("A === " + a);
  };

  componentDidMount() {
    this.fetchDisplayList();
  }

  render() {
    console.log(this.state.diplayList);
    return (
      <View style={styles.container}>
        <Head t="My Donations"  navigation={this.props.navigation}></Head>
        <View style={{ flex: 1 }}>
          {this.state.diplayList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Donated Books</Text>
            </View>
          ) : (
            <FlatList
              data={this.state.diplayList}
              renderItem={({ item }) => (
                <View style={styles.listContainer}>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                      {item.Book}
                    </Text>
                    <Text>{item.reciever}</Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.button}
                      disabled={item.sent}
                      onPress={() => {
                        this.sentBook(item);
                        this.updateNotif(item);
                      }}
                    >
                      <Text style={{ color: "#ffff" }}>Book Sent</Text>
                    </TouchableOpacity>
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
