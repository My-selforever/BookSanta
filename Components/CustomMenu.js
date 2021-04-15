import React from "react";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";
import { ToastAndroid } from "react-native";
import Open from "../Screens/open";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import {RFValue} from 'react-native-responsive-fontsize'

export default class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      image: "#",
      userName: firebase.auth().currentUser.email,
    };
  }

  uploadImage = async (uri, name) => {
    console.log("upload");
    var path = await fetch(uri);
    var img = await path.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("Users/" + name);
    return ref.put(img).then(() => {
      ToastAndroid.show("Picture Updated successfully", ToastAndroid.SHORT);
    });
  };

  GalleryConnect = async () => {
    console.log("gallery");
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });
    if (cancelled === false) {
      this.setState({
        image: uri,
      });

      this.uploadImage(uri, this.state.userName);
    }
    console.log("uri=" + uri + "  canclled=" + cancelled);
  };

  fetchImage = () => {
    var ref = firebase
      .storage()
      .ref()
      .child("Users/" + this.state.userName);

    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({
          image: "#",
        });
      });
  };

  componentDidMount() {
    this.fetchImage();
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "#EA6545",
            flex: 0.5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            size="medium"
            rounded
            onPress={() => {
              this.GalleryConnect();
            }}
            source={{ uri: this.state.image }}
            showEditButton
            containerStyle={styles.imageContainer}
          ></Avatar>
          <Text style ={{fontSize:RFValue(20)}}>{this.state.userName.substring(0,this.state.userName.indexOf('@'))}</Text>
        </View>

        <View style={styles.container}>
          <DrawerItems {...this.props} />
        </View>

        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            Alert.alert("Please Confirm That You Are Logging Out", "", [
              {
                text: "Sure!",
                onPress: () => {
                  firebase.auth().signOut();
                  ToastAndroid.show("Successfully LoggedOut", 7);
                  this.props.navigation.navigate("Open");
                },
              },
              {
                text: "No!",
              },
            ]);
          }}
        >
          <Text style={{ color: "#ffffff" }}>Log Out </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },

  buttons: {
    marginHorizontal: 20,
    backgroundColor: "#4285F4",
    height: 30,
    width: 75,
    alignItems: "center",
  },

  imageContainer: {
    flex: 0.6,
    width: "50%",
    height: "30%",
    borderRadius: 40,
    marginTop: 50,
    borderWidth: 4,
    borderStyle: "solid",
  },
});
