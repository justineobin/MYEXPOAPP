import { useRouter } from "expo-router";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, FlatList, Image, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Manhwa images (your images...)
const manhwa1 = require("../app/img/1.jpg");
const manhwa2 = require("../app/img/2.jpg");
const manhwa3 = require("../app/img/3.png");
const manhwa4 = require("../app/img/4.jpeg");
const manhwa5 = require("../app/img/5.jpeg");
const manhwa6 = require("../app/img/6.jpg");
const manhwa7 = require("../app/img/7.jpeg");
const manhwa8 = require("../app/img/8.jpg");
const manhwa9 = require("../app/img/9.jpg");
const manhwa10 = require("../app/img/10.jpeg");
const manhwa11 = require("../app/img/11.jpg");
const manhwa12 = require("../app/img/12.jpg");
const manhwa13 = require("../app/img/13.jpeg");
const manhwa14 = require("../app/img/14.jpg");
const manhwa15 = require("../app/img/15.jpg");
const manhwa16 = require("../app/img/16.jpg");
const manhwa17 = require("../app/img/17.jpeg");
const manhwa18 = require("../app/img/18.jpeg");
const manhwa19 = require("../app/img/19.jpg");
const manhwa20 = require("../app/img/20.jpg");
const manhwa21 = require("../app/img/21.png");
const manhwa22 = require("../app/img/22.jpg");
const manhwa23 = require("../app/img/23.jpeg");
const manhwa24 = require("../app/img/24.jpeg");
const manhwa25 = require("../app/img/25.jpeg");
const manhwa26 = require("../app/img/26.jpg");
const manhwa27 = require("../app/img/27.jpg");
const manhwa28 = require("../app/img/28.jpg");
const manhwa29 = require("../app/img/29.jpg");
const manhwa30 = require("../app/img/30.jpg");

// Type for the manhwa
interface Manhwa {
  id: string;
  title: string;
  image: any;
}

const featuredManhwa: Manhwa[] = [
  { id: "1", title: "GREATEST STATE DEVELOPER", image: manhwa1 },
  { id: "2", title: "SOLO LEVELING", image: manhwa2 },
  { id: "3", title: "RETURN OF THE MOUNT HUA SECT", image: manhwa3 },
  { id: "4", title: "ELECEED", image: manhwa4 },
  { id: "5", title: "OMNICIENT READERS VIEWPOINT", image: manhwa5 },
  { id: "6", title: "TOWER OF GOD", image: manhwa6 },
  { id: "7", title: "THE BOXER", image: manhwa7 },
  { id: "8", title: "BASTARD", image: manhwa8 },
  { id: "9", title: "NOBLESSE", image: manhwa9 },
  { id: "10", title: "THE BEGINNING AFTER THE END", image: manhwa10 },
  { id: "11", title: "NANO MACHINE", image: manhwa11 },
  { id: "12", title: "LOOKISM", image: manhwa12 },
  { id: "13", title: "LEVIATHAN", image: manhwa13 },
  { id: "14", title: "SWEET HOME", image: manhwa14 },
  { id: "15", title: "THE GOD OF HIGHSCHOOL", image: manhwa15 },
  { id: "16", title: "LEGEND OF THE NORTHERN BLADE", image: manhwa16 },
  { id: "17", title: "WIND BREAKER", image: manhwa17 },
  { id: "18", title: "THE HORIZON", image: manhwa18 },
  { id: "19", title: "SEASONS OF BLOSSOM", image: manhwa19 },
  { id: "20", title: "SSS-CLASS REVIVAL HUNTER", image: manhwa20 },
  { id: "21", title: "THE S-CLASS THAT I RAISED", image: manhwa21 },
  { id: "22", title: "THE RETURNERS MAGIC SHOULD BE SPECIAL", image: manhwa22 },
  { id: "23", title: "THE WORLD AFTER THE END", image: manhwa23 },
  { id: "24", title: "THE MAX-LEVEL BEWBIE", image: manhwa24 },
  { id: "25", title: "LOVE STORY", image: manhwa25 },
  { id: "26", title: "HEART HEART HEART", image: manhwa26 },
  { id: "27", title: "PRINCESS", image: manhwa27 },
  { id: "28", title: "UNHOLY BLOOD", image: manhwa28 },
  { id: "29", title: "BUSINESS PROPOSAL", image: manhwa29 },
  { id: "30", title: "YOU AND I", image: manhwa30 }
];

export const unstable_settings = {
  headerShown: false,
};

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredManhwa, setFilteredManhwa] = useState(featuredManhwa);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);
      } catch (error) {
        console.error("Failed to fetch userId:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const filterManhwa = () => {
      if (searchQuery.trim() === "") {
        setFilteredManhwa(featuredManhwa); // Reset if search is empty
      } else {
        const filtered = featuredManhwa.filter((manhwa) =>
          manhwa.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredManhwa(filtered);
      }
    };

    filterManhwa();
  }, [searchQuery]);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.background}>
      {/* Drawer Menu Icon */}
      <TouchableOpacity style={styles.drawerIcon} onPress={toggleDrawer}>
        <Text style={styles.drawerIconText}>☰</Text>
      </TouchableOpacity>

      {/* Drawer Dropdown Menu */}
      {drawerVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setDrawerVisible(false);
              if (userId) {
                router.push("/profile", { id: userId });
              } else {
                Alert.alert("Error", "User ID not found.");
              }
            }}
          >
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setDrawerVisible(false);
              handleLogout();
            }}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setDrawerVisible(false);
              router.push("/settings");
            }}
          >
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Manhwa..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Manhwa Images Grid */}
      <ScrollView style={styles.scrollView}>
        <FlatList
          data={filteredManhwa}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.manhwaTitle}>{item.title}</Text>
            </View>
          )}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.columnWrapper}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "flex-start",
  },
  drawerIcon: {
    position: 'absolute',
    top: 15,
    right: 20,
    padding: 8,
    zIndex: 10,
  },
  drawerIconText: {
    color: '#2e7d32',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: "rgba(168,216,185,0.9)",
    borderRadius: 5,
    overflow: "hidden",
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "red",
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  menuItemText: {
    color: "white",
    fontSize: 16,
  },
  searchBarContainer: {
    padding: 15,
    backgroundColor: "black", // Set background to black
    justifyContent: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    color: "white",
    backgroundColor: "transparent", // Transparent background for the input
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  manhwaTitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
});
