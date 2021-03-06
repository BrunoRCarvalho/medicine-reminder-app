import React, { Component } from "react";
import { View, Alert, AsyncStorage } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import { onCreateAccount } from "../auth";
import { connect } from "react-redux";
import { retrieveUser, createUser, loadingTrue } from "../ducks/user";
import PushNotificationsHandler from "react-native-push-notification";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password2: ""
    };
  }

  componentDidMount() {
    PushNotificationsHandler.requestPermissions();
  }

  render() {
    const { navigation } = this.props;
    const { email, password, password2 } = this.state;
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title="SIGN UP">
          <FormLabel>Email</FormLabel>
          <FormInput
            placeholder="Email address..."
            onChangeText={e => this.setState({ email: e })}
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry
            placeholder="Password..."
            onChangeText={e => this.setState({ password: e })}
          />
          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            secureTextEntry
            placeholder="Confirm Password..."
            onChangeText={e => this.setState({ password2: e })}
          />

          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="SIGN UP"
            onPress={() => {
              if (password !== password2) {
                Alert.alert("Something went wrong", "Passwords do not match");
              } else if (!this.state.email.includes("@")) {
                Alert.alert(
                  "There was a problem",
                  "Please enter a valid Email"
                );
              } else {
                this.props.createUser(email, password).then(res => {
                  if (this.props.user.id) {
                    AsyncStorage.setItem(
                      "user",
                      this.props.user.id.toString()
                    ).then(() => {
                      this.props.loadingTrue();
                      this.props.navigation.navigate("Home");
                    });
                  } else {
                    Alert.alert("Error", "Something went wrong");
                  }
                });
              }
            }}
          />
          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="transparent"
            textStyle={{ color: "#bcbec1" }}
            title="Sign In"
            onPress={() => navigation.navigate("SignIn")}
          />
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {
  retrieveUser,
  createUser,
  loadingTrue
})(SignUp);
