import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import bgImage from "../assets/EXPOBG.jpg";
import { getUserById, updateUser, deleteUser } from "./api";

interface Profile {
  id?: string | number;
  _id?: string;
  fullname?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  type_id?: number;
  exp?: number;
}

export default function ProfileScreen({ route }: any) {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [typeId, setTypeId] = useState(""); // For type_id
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        let userId = route?.params?.id;
        if (!userId) {
          userId = await AsyncStorage.getItem("userId");
        }
        if (!userId) {
          Alert.alert("Error", "No user ID provided or stored.");
          setLoading(false);
          return;
        }
        const numericId = Number(userId);

        const userData = await getUserById(numericId);
        if (!userData) {
          Alert.alert("Error", "No user data returned.");
          setLoading(false);
          return;
        }
        setProfile(userData);

        if (userData.fullname) {
          setFullName(userData.fullname);
        } else if (userData.firstName || userData.lastName) {
          setFullName(`${userData.firstName || ""} ${userData.lastName || ""}`.trim());
        }
        setUsername(userData.username || "");
        if (userData.type_id !== undefined && userData.type_id !== null) {
          setTypeId(userData.type_id.toString());
        } else {
          setTypeId("1");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [route?.params?.id]);

  const handleUpdateProfile = async () => {
    try {
      const userId = (profile?._id || profile?.id)?.toString();
      if (!userId) {
        Alert.alert("Error", "User ID not found in profile data.");
        return;
      }

      const payload: any = {
        fullname: fullName,
        username,
        type_id: Number(typeId),
      };
      if (password) payload.password = password;

      const updatedData = await updateUser(userId, payload);
      Alert.alert("Success", "Profile updated successfully");
      setProfile((prev) => ({
        ...prev,
        ...updatedData,
      }));
    } catch (error: any) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const numericUserId = Number(profile?._id || profile?.id);
      if (!numericUserId) {
        Alert.alert("Error", "User ID not found in profile data.");
        return;
      }
      await deleteUser(numericUserId);
      Alert.alert("Profile deleted", "Your profile has been deleted", [
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userId");
            router.replace("/login");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", `Failed to delete profile: ${error.response?.data?.message || error.message}`);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your profile?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: handleDeleteProfile },
      ]
    );
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  if (loading) {
    return (
      <View style={styles.background}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/home")}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
            placeholderTextColor="#fff"
          />

          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor="#fff"
          />

          <TextInput
            style={styles.input}
            value={typeId}
            onChangeText={setTypeId}
            placeholder="Type ID"
            placeholderTextColor="#fff"
            keyboardType="numeric"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="New Password"
              placeholderTextColor="#fff"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.iconContainer}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Update Profile" onPress={handleUpdateProfile} color="#ff0000" />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Delete Profile" onPress={confirmDelete} color="#d32f2f" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black", // Full black background
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  backButtonText: {
    color: "#fff", // White text for back button
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark semi-transparent background for the form
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    color: "#fff", // White title
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    color: "#fff", // White text
    textAlign: "center",
    marginBottom: 5,
  },
  input: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff", // White border for input
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#fff", // White text in input
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    position: "relative",
  },
  passwordInput: {
    paddingRight: 40,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 5,
  },
});
