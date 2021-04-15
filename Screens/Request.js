import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as firebase from "firebase";
import Head from "../Components/myHeader";
import DB from "../config";
import { Alert } from "react-native";
import { Card , Input} from "react-native-elements";
import { BookSearch } from "react-native-google-books";
import { FlatList } from "react-native";
import { TouchableHighlight } from "react-native";

export default class RequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      //requestingUser :firebase.auth().currentUser.email,
      bookName: "",
      duration: "",
      RequestEligiblity: "",
      UserdocID: "",
      requestStatus: "",
      requestID: "",
      notificationReciever: "",
      datasource: "",
      showFlatlist: false,
    };
  }

  addRequest = () => {
    const id = this.idGenerate();
    DB.collection("Requests").add({
      User: firebase.auth().currentUser.email,
      RequestedBook: this.state.bookName,
      DurationRequestedFor: this.state.duration,
      DonationStatus: false,
      RequestID: id,
    });
    DB.collection("Users")
      .where("EmailID", "==", firebase.auth().currentUser.email)
      .get()
      .then((documents) => {
        documents.docs.map((docs) => {
          DB.collection("Users").doc(docs.id).update({
            RequestEligiblity: false,
          });
        });
      });

    Alert.alert("Book Reuested Successfully. Your Request ID is " + id + ".");
    this.setState({
      bookName: "",
      duration: "",
    });
  };

  readEligibility = () => {
    DB.collection("Users")
      .where("EmailID", "==", firebase.auth().currentUser.email)
      .get()
      .then((documents) => {
        documents.docs.map((docs) => {
          var data = docs.data();
          this.setState({
            RequestEligiblity: data.RequestEligiblity,
            UserdocID: docs.id,
          });
        });
      });
  };

  getBookList = async (c) => {
    if (c >= 3) {
      var bookList = await BookSearch.searchbook(
        this.state.bookName,
        "AIzaSyDeQPib7WO40UkdIt6HXGjEyaXOGe3WXhY"
      );
      this.setState({
        datasource: bookList.data,
        showFlatlist: true,
      });
    }

    else {
      this.setState({
        datasource : '',
        showFlatlist : false
      })
    }

    console.log(this.state.datasource);
  };

  componentDidMount =  () => {
    this.readEligibility();
    this.readRequests();
    /*var bookList = await BookSearch.searchbook(
      "Game Of Thrones",
      "AIzaSyDeQPib7WO40UkdIt6HXGjEyaXOGe3WXhY"
    );
    console.log(bookList)*/
  };

  idGenerate = () => {
    var a = Math.random().toString(36).substring(7);
    return a;
  };

  readRequests = () => {
    DB.collection("Requests")
      .where("User", "==", firebase.auth().currentUser.email)
      .where("DonationStatus", "==", false)
      .get()
      .then((documents) => {
        documents.docs.map((docs) => {
          var data = docs.data();
          this.setState({
            requestStatus: data.RequestedBook + " Has Been Requested",
            bookName: data.RequestedBook,
            duration: data.DurationRequestedFor,
            requestID: data.RequestID,
          });
        });
      });
  };

  bookRecieved = () => {
    DB.collection("Requests")
      .where("User", "==", firebase.auth().currentUser.email)
      .where("DonationStatus", "==", false)
      .get()
      .then((documents) => {
        documents.docs.map((doc) => {
          DB.collection("Requests").doc(doc.id).update({
            DonationStatus: true,
          });
        });
      });

    DB.collection("Donations")
      .where("RequestID", "==", this.state.requestID)
      .get()
      .then((documents) => {
        documents.docs.map((doc) => {
          DB.collection("Donations").doc(doc.id).update({
            status: "Donation Sent",
          });
          this.setState({
            notificationReciever: doc.data().Donor,
          });
        });
      });

    DB.collection("Notifications")
      .where("RequestID", "==", this.state.requestID)
      .get()
      .then((documents) => {
        documents.docs.map((doc) => {
          DB.collection("Notifications")
            .doc(doc.id)
            .update({
              Date: firebase.firestore.FieldValue.serverTimestamp(),
              Message:
                firebase.auth().currentUser.email +
                " has recieved " +
                this.state.bookName,
              Reason: "Donation sent",
              status: "unread",
              RecieverUser: this.state.notificationReciever,
              HostUser: firebase.auth().currentUser.email,
            });
        });
      });
  };

  bookReturned = () => {
    DB.collection("Donations")
      .where("RequestID", "==", this.state.requestID)
      .get()
      .then((documents) => {
        documents.docs.map((doc) => {
          DB.collection("Donations").doc(doc.id).update({
            status: "Donation Returned",
          });
          this.setState({
            notificationReciever: doc.data().Donor,
          });
        });
      });

    DB.collection("Notifications")
      .where("RequestID", "==", this.state.requestID)
      .get()
      .then((documents) => {
        documents.docs.map((doc) => {
          DB.collection("Notifications")
            .doc(doc.id)
            .update({
              Date: firebase.firestore.FieldValue.serverTimestamp(),
              Message:
                firebase.auth().currentUser.email +
                " has Returned " +
                this.state.bookName,
              Reason: "Donation returned",
              status: "unread",
              RecieverUser: this.state.notificationReciever,
              HostUser: firebase.auth().currentUser.email,
            });
        });
      });
  };

  render() {

    if (this.state.RequestEligiblity === true) {
      return (
        <View style={{ flex: 1 }}>
          <Head t="Request" navigation={this.props.navigation}></Head>
          <View style={styles.container}>
            <Input
              placeholder="Book Name"
              onChangeText={(book) => {
                this.setState({ bookName: book });
                this.getBookList(book.length);
              }}
              value={this.state.bookName}
              style={styles.input}
            ></Input>
            {this.state.showFlatlist === true?(<FlatList
            data = {this.state.datasource}
            keyExtractor = {(item, index) => index.toString()}
            renderItem = {({item})=>(
              <View>
                <TouchableHighlight style={{
                  alignItems:'center',
                  justifyContent: 'center',
                  backgroundColor: '#0195A3',
                  width : 400,
                  padding : 10,
                  
                
                }}
                onPress ={()=>{
                  this.setState({
                   showFlatlist : false,
                   bookName : item.volumeInfo.title
                  })
                }}
                bottomDivider 
                underlayColor = '#0195A3'>
                  <Text>{item.volumeInfo.title}</Text>
                </TouchableHighlight>
              </View>
            )}
            ></FlatList>): (
              <View>
            <TextInput
              placeholder="Duration"
              onChangeText={(time) => {
                this.setState({ duration: time });
              }}
              value={this.state.duration}
              style={styles.input}
            ></TextInput>
            <TouchableOpacity
              style={styles.request}
              onPress={() => {
                this.addRequest();
              }}
            >
              <Text style={{ color: "#ffffff" }}>Request</Text>
            </TouchableOpacity>
            </View>
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Card title={"Book Information"} titleStyle={{ fontSize: 50 }}>
            <Card>
              <Text>Book Name: {this.state.bookName}</Text>
            </Card>
            <Card>
              <Text>Duration: {this.state.duration}</Text>
            </Card>
            <Card>
              <Text>Status : {this.state.requestStatus}</Text>
            </Card>
          </Card>
          <View>
            <TouchableOpacity
              style={styles.request}
              onPress={() => {
                this.bookRecieved();
              }}
            >
              <Text>Recieved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.request}
              onPress={() => {
                this.bookReturned();
              }}
            >
              <Text>Returned</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.request}>
              <Text>Cancel Request</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#9cc2ff'
  },

  input: {
    borderStyle: "solid",
    borderWidth: 2,
    width: 200,
    marginTop: 50,
    marginLeft: 50,
    textAlign: "center",
    borderRadius: 5,
  },

  request: {
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
