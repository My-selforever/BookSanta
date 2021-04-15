import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { Header, Input, Icon } from "react-native-elements";
import DB from "../config";
import firebase from "firebase";
import { RFPercentage } from "react-native-responsive-fontsize";

export default class Open extends React.Component {
  constructor() {
    super();
    this.state = {
      mail: "",
      pass: "",
      modalvis: true,
      phone: "",
      cpass: "",
      address: "",
    };
  }

  signIn = () => {
    const { mail } = this.state;
    const { pass } = this.state;

    if (mail && pass) {
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, pass)
        .then((response) => {
          Alert.alert("Logging you in");
          this.props.navigation.navigate("Donate", { user: mail });
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    }
  };

  signup = () => {
    const { mail } = this.state;
    const { pass } = this.state;
    const { cpass } = this.state;
    if (pass !== cpass) {
      Alert.alert("The Passwords do not match");
    } else if (mail && pass) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(mail, pass)
        .then((response) => {
          DB.collection("Users").add({
            EmailID: this.state.mail,
            Phone: this.state.phone,
            Address: this.state.address,
            RequestEligiblity: true,
          });
          Alert.alert("Signing you up", "", [
            {
              text: "Great!",
              onPress: () => {
                this.setState({ modalvis: false, mail: "", pass: "" });
              },
            },
          ]);
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    }
  };

  showModal = () => {
    return (
      <Modal visible={this.state.modalvis} animationType="fade">
        <View style={style.modalcontainer}>
        <Header
          centerComponent={{
            text: "Sign Up",
            style: {
              fontSize: 20,
              color: "#ffffff",
              alignItems :'center',
              justifyContent  : 'center'
              
            },
          }}
        />
          <ScrollView style={{ width: "100%" }}>
            
            <KeyboardAvoidingView style={style.modalcontainer}>
          
              <Input
                placeholder="Email"
                onChangeText={(txt) => {
                  this.setState({
                    mail: txt,
                  });
                }}
                value={this.state.mail}
                keyboardType="email-address"
                style={style.input}
                placeholderTextColor="#878787"
              ></Input>

              <Input
                placeholder="Contact"
                onChangeText={(txt) => {
                  this.setState({
                    phone: txt,
                  });
                }}
                value={this.state.phone}
                keyboardType="phone-pad"
                style={style.input}
                placeholderTextColor="#878787"
              ></Input>

              <Input
                placeholder="Address"
                onChangeText={(txt) => {
                  this.setState({
                    address: txt,
                  });
                }}
                value={this.state.address}
                style={style.input}
                placeholderTextColor="#878787"
              ></Input>

              <Input
                placeholder="Password"
                onChangeText={(txt) => {
                  this.setState({
                    pass: txt,
                  });
                }}
                value={this.state.pass}
                secureTextEntry={true}
                style={style.input}
                placeholderTextColor="#878787"
              ></Input>

              <Input
                placeholder="Confirm Password"
                onChangeText={(txt) => {
                  this.setState({
                    cpass: txt,
                  });
                }}
                value={this.state.cpass}
                secureTextEntry={true}
                style={style.input}
                placeholderTextColor="#878787"
              ></Input>

              <View style={style.buttons}>
                <TouchableOpacity
                  style={style.sign}
                  onPress={() => {
                    this.signup();
                  }}
                >
                  <Text>Signup</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={style.sign}
                  onPress={() => {
                    this.setState({
                      mail: "",
                      pass: "",
                      modalvis: false,
                    });
                  }}
                >
                  <Text>Cancle</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Image
                  source={require("../assets/Images/request-book.png")}
                  resizeMode="contain"
                  style ={{width : RFPercentage(50),height:RFPercentage(50)}}
                ></Image>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View style={{ backgroundColor: "#9cc2ff", height: "100%" }}>
        <Header
          centerComponent={{
            text: "Welcome",
            style: {
              fontSize: 20,
              color: "#ffffff",
            },
          }}
        />
        <View style={style.santaContainer}>
          <Image source={require("../assets/Images/santa.png")}></Image>
        </View>
        <View style={[style.Container, { marginTop: -60 }]}>
          {this.showModal()}

          <Input
            placeholder="   Email ID"
            onChangeText={(txt) => {
              this.setState({ mail: txt });
            }}
            leftIcon={
              <Icon name="user" type="font-awesome" color="#000000"></Icon>
            }
            value={this.state.mail}
            style={style.input}
            secureTextEntry={false}
            keyboardType="email-address"
            placeholderTextColor="#878787"
          ></Input>

          <Input
            placeholder="   Password"
            onChangeText={(txt) => {
              this.setState({ pass: txt });
            }}
            leftIcon={
              <Icon name="lock" type="font-awesome" color="#000000"></Icon>
            }
            value={this.state.pass}
            style={style.input}
            secureTextEntry={true}
            placeholderTextColor="#878787"
          ></Input>
          <View style={style.buttons}>
            <TouchableOpacity
              style={style.sign}
              onPress={() => {
                this.signIn();
              }}
            >
              <Text>Signin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.sign}
              onPress={() => {
                this.setState({ modalvis: true });
              }}
            >
              <Text>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={style.santaContainer}>
          <Image source={require("../assets/Images/book.png")}></Image>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  input: {
    borderStyle: "solid",
    borderWidth: 2,
    width: 200,
    marginTop: 75,
    marginLeft: 50,
    textAlign: "center",
    borderRadius: 5,
  },

  Container: {
    marginTop: 200,
  },

  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  sign: {
    marginHorizontal: 20,
    backgroundColor: "#4285F4",
    height: 30,
    width: 75,
    alignItems: "center",
  },

  modalcontainer: {
    marginTop: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#9cc2ff'
  },

  santaContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});
