import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./login";
import HomeScreen from "./home";

const Stack = createStackNavigator();

const App = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

export default App;
