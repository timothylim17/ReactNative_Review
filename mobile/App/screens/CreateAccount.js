import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from "react-native";

import { TextField, ErrorText } from "../components/Form";
import { Button } from "../components/Button";
import { reviewApi, saveAuthToken } from "../util/api";

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

export default class CreateAccount extends React.Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
  };

  handleSubmit = () => {
    this.setState({ error: "" });

    if (this.state.confirmPassword !== this.state.password) {
      this.setState({ error: "Passwords do not match" })
    } else if (this.state.password.length <= 0){
      this.setState({ error: "Please input a password" })
    } else {
      reviewApi("/create-account", {
        method: "POST",
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      })
        .then((response) => {
          console.log("response:", response);
          return saveAuthToken(response.result.token);
        })
        .then(() => {
          this.props.navigation.navigate("Information");
        })
        .catch((error) => {
          this.setState({ error: error.message });
          // console.log(error);
        });
    }
  }

  render () {
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
        <TextField 
          label="Confirm Password" 
          secureTextEntry 
          onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
          value={this.state.confirmPassword}
          autoCapitalize="none"
        />
        <ErrorText text={this.state.error} />
        <Button text="Submit" onPress={this.handleSubmit} />
        <View style={styles.textBlock}>
          <Text style={styles.text}>Already have an account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("SignIn")}>
            <Text style={[styles.text, styles.link]}>Sign in.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

};
