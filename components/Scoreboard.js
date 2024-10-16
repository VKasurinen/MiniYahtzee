import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,FlatList,TouchableOpacity,} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SCOREBOARD_KEY } from "../constants/Game";
import Footer from "./Footer";
import { useNavigation } from "@react-navigation/native";

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadScores = async () => {
      try {
        const storedScores = await AsyncStorage.getItem(SCOREBOARD_KEY);
        if (storedScores) {
          const parsedScores = JSON.parse(storedScores);
          setScores(parsedScores);
          console.log("Loaded scores:", parsedScores);
        }
      } catch (error) {
        console.error("Failed to load scores", error);
      }
    };

    loadScores();
    const unsubscribe = navigation.addListener("focus", loadScores); // Re-load scores when focused

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);

  const handleDeleteScores = async () => {
    try {
      await AsyncStorage.removeItem(SCOREBOARD_KEY); // Remove all scores from storage
      setScores([]); // Clear the scores from the state
    } catch (e) {
      console.error("Failed to delete scores", e);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Get the local device time zone offset
    const timezoneOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds

    // Adjust the date by the local time zone offset
    const localDate = new Date(date.getTime());

    const day = localDate.getDate();
    const month = localDate.getMonth() + 1; // getMonth() is zero-based
    const year = localDate.getFullYear();
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes().toString().padStart(2, "0"); // ensures minutes are always two digits

    // Return the formatted string
    return `${day}.${month}.${year}, ${hours}.${minutes}`;
  };

  const renderScoreRow = ({ item, index }) => {
    const ranking = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"][index]; // Display ranking based on index

    return (
      <View style={styles.row}>
        <Text style={styles.rank}>{ranking}</Text>
        <Text style={styles.playerName}>{item.playerName}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <Text style={styles.score}>{item.totalScore}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Centered Icon */}
      <AntDesign name="barschart" size={100} color="#0088ff" />

      {/* Top Seven Text */}
      <Text style={styles.topText}>Top Seven</Text>

      {/* Score List */}
      <View style={styles.listContainer}>
        {scores.length > 0 ? (
          <FlatList
            data={scores.slice(0, 7)} // Limit to top 7 scores
            renderItem={renderScoreRow}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.emptyText}>Scoreboard is empty</Text>
        )}
      </View>

      {/* Red Button to Delete All Scores */}
      {scores.length > 0 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteScores}
        >
          <Text style={styles.deleteButtonText}>Delete All Scores</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  topText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0088ff",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    width: "10%",
  },
  playerName: {
    fontSize: 18,
    width: "30%",
  },
  date: {
    fontSize: 16,
    minWidth: 120,
    color: "#888",
    width: "30%",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    width: "20%",
    textAlign: "right",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 0.8,
    width: "100%",
    alignItems: "center",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default Scoreboard;
