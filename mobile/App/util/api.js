import { AsyncStorage } from "react-native";
import { navigate } from "./NavigationService";

const BASE_URL = "http://192.168.0.27:3000";
const AUTH_TOKEN = 'ReviewApp::AUTH_TOKEN';

export const saveAuthToken = (token) => {
  if (!token) {
    return AsyncStorage.removeItem(AUTH_TOKEN);
  }
  console.log(token)
  return AsyncStorage.setItem(AUTH_TOKEN, token);
};

export const hasAuthToken = () => {
  return AsyncStorage.getItem(AUTH_TOKEN).then(token => {
    if (token) {
      console.log(token);
      return true;
    }

    return false;
  })
};

export const reviewApi = (path, options = {}) => {
  return AsyncStorage.getItem(AUTH_TOKEN)
    .then(token => {
      const completeOptions = {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
      };
      
      if (token) {
        completeOptions.headers.authorization = `Bearer ${token}`;
      }
    
      return fetch(`${BASE_URL}/api${path}`, completeOptions).then(async res => {
        const responseJson = await res.json();
        if (res.ok) {
          return responseJson;
        }

        console.log("res", res);

        // if unauthorized then do this
        if (res.status === 401) {
          navigate("Auth");
          saveAuthToken();
        }
    
        throw new Error(responseJson.error);
      });
    })
  
};
