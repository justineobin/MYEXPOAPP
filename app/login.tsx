import { useRouter } from "expo-router";
import React, { useState, useLayoutEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const unstable_settings = {
  headerShown: false,
};

// Helper function to decode a JWT and return its payload
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    console.log("Login pressed");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://devapi-618v.onrender.com/api/auth/login",
        { username, password }
      );
      console.log("Login response:", response.data);

      if (response.data && response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        let userId;
        // If a user object is provided, use it.
        if (response.data.user) {
          userId = response.data.user.id || response.data.user._id;
        } else {
          // Otherwise, decode the token to get the user id.
          const payload = parseJwt(response.data.token);
          console.log("Decoded token payload:", payload);
          userId = payload && (payload.id || payload.userId || payload._id);
        }
        // Directly store the userId if it exists (accept numeric ids, strings, etc.)
        if (userId) {
          await AsyncStorage.setItem("userId", userId.toString());
          console.log("Stored userId:", userId);
          router.replace("/home");
        } else {
          console.error("UserId extraction failed:", userId);
          Alert.alert("Login Failed", "User id not found in token.");
        }
      } else {
        Alert.alert("Login Failed", "No token received from the server");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      {/* "Readflix" Header */}
      <Text style={styles.headerText}>Readflix</Text>
      
      <View style={styles.rowContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button
            title={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            disabled={loading}
            color="#ff0000" // Red color for the button
          />
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}>No account yet? Sign up now!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black", // Keep the background black
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 36,
    color: "#ffffff", // White text color for the header
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "column", // Changed to column to make form elements centered
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background for form
    padding: 20,
    borderRadius: 10,
    width: "80%", // Increased the width for better form
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#ffffff", // White text color for labels
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffffff", // White border for input
    marginBottom: 10,
    padding: 10,
    width: "100%", // Centered the input
    borderRadius: 5,
    color: "#ffffff", // White text in input
  },
  signupLink: {
    marginTop: 10,
    color: "#ffffff", // White color for the signup link
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
