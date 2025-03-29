export const unstable_settings = {
  headerShown: false,
};

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!fullName || !username || !password) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://devapi-618v.onrender.com/api/auth/register",
        { fullname: fullName, username, password, type_id: 1 },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Signup response:", data);
      // Registration successful; navigate to login
      router.push("/login");
    } catch (error) {
      console.error("Error during signup:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.response?.data?.message;
      if (errorMessage && errorMessage.includes("Duplicate entry")) {
        Alert.alert("Sign Up Failed", "Username already taken. Please choose a different one.");
      } else {
        Alert.alert("Sign Up Failed", errorMessage || "An error occurred during sign up.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      {/* Arrow button in the top right */}
      <TouchableOpacity style={styles.loginButtonContainer} onPress={() => router.push("/login")}>
        <Text style={styles.arrow}>&larr;</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#bbb"
          />
          <Text style={styles.label}>Username:</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Enter a username"
            placeholderTextColor="#bbb"
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Enter a password"
            placeholderTextColor="#bbb"
          />

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
            <Text style={styles.signupButtonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginLink}>Already have an account? Login now!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black", // Black background for the entire screen
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  arrow: {
    fontSize: 24,
    color: "#ffffff", // White color for the arrow
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark semi-transparent background for the form
    padding: 25,
    borderRadius: 10,
    width: "80%", // Adjusted width for better form visibility
    alignItems: "stretch",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#ffffff", // White color for the labels
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffffff", // White border for inputs
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: "#ffffff", // White text color for input
  },
  signupButton: {
    backgroundColor: "#ff0000", // Red background for the signup button
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
  },
  signupButtonText: {
    color: "#fff", // White text for the button
    fontSize: 16,
  },
  loginLink: {
    marginTop: 15,
    color: "#ffffff", // White color for the login link
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
