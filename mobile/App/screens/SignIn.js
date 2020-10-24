import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, Platform } from "react-native";

import { TextField, ErrorText } from "../components/Form";
import { Button } from "../components/Button";
import { reviewApi, saveAuthToken, saveAccessToken } from "../util/api";
import * as Google from 'expo-google-app-auth';

const styles = StyleSheet.create({
  textBlock: {
    marginTop: 20
  },
  text: {
    fontSize: 18,
    color: "#969696",
    textAlign: "center",
    marginBottom: 2
  },
  link: {
    textDecorationLine: "underline"
  }
});

const isAndroid = () => Platform.OS === 'android',
  androidID = '308218911119-459l4op4o0l10014s3lkn00tibci2r65.apps.googleusercontent.com',
  iosID = '308218911119-q20q6rt2lcllrvs3rt9ooq0v1ok024qj.apps.googleusercontent.com';

const googleAuthConfig = {
  clientId: isAndroid() ? androidID : iosID,
  scopes: ['profile', 'email'],
}

export default class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
    fName: "",
    lName: ""
  };

  signInWithGoogle = async () => {
    Google.logInAsync(googleAuthConfig)
      .then(async result => {
        // Get the email, save it to the database
        this.setState({
          email: result.user.email,
          fName: result.user.givenName,
          lName: result.user.familyName
        });
        // Save token to log out
        saveAccessToken(result.accessToken);

        // Call to api authentication
        reviewApi("/google-sign-in", {
          method: "POST",
          body: JSON.stringify({
            firstName: result.user.givenName,
            lastName: result.user.familyName,
            email: this.state.email,
          }),
        })
        .then(response => {
          console.log('Get token:', response);
          return saveAuthToken(response.result.token);
        })
        .catch(e => {
          this.setState({ error: e.message });
        });
        if (result.type === 'success') {
          // User successfully logged in!
          console.log("Successful login!");
          this.props.navigation.navigate("Information");
        } else {
          console.log(`Google.logInAsync: login was unsuccessful`);
        }
      })
      .catch(e => {
        console.log(`Google.logInAsync error: ${err}`);
      })
  };

  handleSubmit = () => {
    this.setState({ error: "" });
    reviewApi("/sign-in", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        // console.log("response (sign-in):", response);
        return saveAuthToken(response.result.token);
      })
      .then(() => {
        this.props.navigation.navigate("Information");
      })
      .catch((error) => {
        this.setState({ error: error.message });
        // console.log(error);
      });
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <TextField
          label="Email"
          placeholder="john.doe@example.com"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          autoCapitalize="none"
        />
        <TextField
          label="Password"
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          autoCapitalize="none"
        />
        <ErrorText text={this.state.error} />
        <Button text="Submit" onPress={this.handleSubmit} />
        <View style={styles.textBlock}>
           <Button text="Sign in with Google" onPress={this.signInWithGoogle} />
          <Text style={styles.text}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateAccount")}>
            <Text style={[styles.text, styles.link]}>Create Account.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
