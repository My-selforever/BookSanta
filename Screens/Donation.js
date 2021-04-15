import React from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
//import { Header } from "react-native/Libraries/NewAppScreen";
import Head from "../Components/myHeader";
import DB from "../config";
import RecieverScreen from "./Reciever";

export default class DonationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      diplayList: [],
      lastFetchItem: "",
    };
    this.ref = null;
  }

  fetchDisplayList = () => {
    this.ref = DB.collection("Requests").onSnapshot((snapshot) => {
      var bookList = snapshot.docs.map((doc) => doc.data());
      this.setState({
        diplayList: bookList,
      });
    });
  };

  componentDidMount() {
    this.fetchDisplayList();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Head t="Donate" navigation={this.props.navigation}></Head>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            {this.state.diplayList.length === 0 ? (
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20 }}>
                  List Of All Requested Books
                </Text>
              </View>
            ) : (
              <FlatList
                data={this.state.diplayList}
                renderItem={({ item }) => (
                  <View style={styles.listContainer}>
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                        {item.RequestedBook}
                      </Text>
                      <Text>{item.DurationRequestedFor}</Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                          this.props.navigation.navigate("Reciever", {
                            book: item,
                          });
                        }}
                      >
                        <Text style={{ color: "#ffff" }}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
            )}
          </View>
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
