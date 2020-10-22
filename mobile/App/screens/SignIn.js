import React from "react";
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";

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

export default class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
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
          <Text style={styles.text}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateAccount")}>
            <Text style={[styles.text, styles.link]}>Create Account.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
