import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SCOREBOARD_KEY, BONUS_POINTS_LIMIT } from "../constants/Game";
import Footer from "./Footer";

const Gameboard = () => {
  const route = useRoute();
  const { playerName } = route.params || {};

  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(3);
  const [diceValues, setDiceValues] = useState(Array(5).fill(null));
  const [lockedDice, setLockedDice] = useState([false,false,false,false,false,]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState(Array(6).fill(0));
  const [selectedPoints, setSelectedPoints] = useState(Array(6).fill(0));

  // Save the score once all numbers are selected and totalPoints is updated
  useEffect(() => {
    if (selectedNumbers.every((num) => num !== 0)) {
      saveScore();
      alert("Game over! All numbers are selected.");
    }
  }, [totalPoints, selectedNumbers]);

  const saveScore = async () => {
    try {
      const newScore = {
        playerName: playerName || "Anonymous",
        totalScore: totalPoints,
        date: new Date().toISOString(),
      };

      const storedScores = await AsyncStorage.getItem(SCOREBOARD_KEY);
      const scores = storedScores ? JSON.parse(storedScores) : [];

      // Add the new score to the array
      scores.push(newScore);

      // Sort the scores in descending order (highest scores first)
      scores.sort((a, b) => b.totalScore - a.totalScore);

      // Save the top 7 scores back to AsyncStorage
      await AsyncStorage.setItem(
        SCOREBOARD_KEY,
        JSON.stringify(scores.slice(0, 7))
      );
    } catch (error) {
      console.error("Failed to save score", error);
    }
  };

  const handleSelectNumber = (selectedNum) => {
    // If all rolls are used, you can choose any number
    if (nbrOfThrowsLeft === 0) {
      // Allow selection of zero
      const points =
        selectedNum === 0
          ? 0
          : countOccurrences(selectedNum, diceValues) * selectedNum;

      const updatedSelectedNumbers = [...selectedNumbers];
      updatedSelectedNumbers[selectedNum - 1] = 1; // Mark the number as selected
      setSelectedNumbers(updatedSelectedNumbers);

      const updatedSelectedPoints = [...selectedPoints];
      updatedSelectedPoints[selectedNum - 1] = points; // Save the selected points
      setSelectedPoints(updatedSelectedPoints);

      setTotalPoints((prevTotalPoints) => prevTotalPoints + points);

      setLockedDice([false, false, false, false, false]); // Reset dice locks
      setNbrOfThrowsLeft(3);
      setDiceValues(Array(5).fill(null)); // Reset the dice values ​​for the next round
      return;
    }

    // Find the highest locked dice value
    const lockedDiceValues = diceValues.filter((_, index) => lockedDice[index]);
    const highestLockedValue = Math.max(...lockedDiceValues);

    // Prevent selection if:
    // 1. It's already selected.
    // 2. There are still throws left.
    // 3. There are no locked dice.
    // 4. The selected number is not the same as the highest locked dice value.
    if (
      selectedNumbers[selectedNum - 1] !== 0 ||
      lockedDice.every((dice) => !dice) ||
      selectedNum !== highestLockedValue
    ) {
      return;
    }

    const points =
      countOccurrences(
        selectedNum,
        diceValues.filter((_, index) => lockedDice[index])
      ) * selectedNum;

    setTotalPoints((prevTotalPoints) => prevTotalPoints + points);

    const updatedSelectedNumbers = [...selectedNumbers];
    updatedSelectedNumbers[selectedNum - 1] = 1;
    setSelectedNumbers(updatedSelectedNumbers);

    const updatedSelectedPoints = [...selectedPoints];
    updatedSelectedPoints[selectedNum - 1] = points;
    setSelectedPoints(updatedSelectedPoints);

    setLockedDice([false, false, false, false, false]); // Reset the number of throws
    setNbrOfThrowsLeft(3); // Reset the number of throws
    setDiceValues(Array(5).fill(null)); // Reset the dice values ​​for the next round
  };

  const toggleDiceLock = (index) => {
    const updatedLocks = [...lockedDice];
    updatedLocks[index] = !updatedLocks[index];
    setLockedDice(updatedLocks);
  };

  const countOccurrences = (num, arr) => {
    return arr.filter((value) => value === num).length;
  };

  const handleThrowDices = () => {
    if (nbrOfThrowsLeft > 0) {
      setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);

      const newDiceValues = diceValues.map((value, index) =>
        value === null || !lockedDice[index]
          ? Math.floor(Math.random() * 6) + 1
          : value
      );
      setDiceValues(newDiceValues);
    }
  };
  const diceIcons = ["dice-one","dice-two","dice-three","dice-four","dice-five","dice-six",];

  return (
    <View style={styles.container}>
      <View style={styles.diceContainer}>
        {diceValues.every((value) => value === null) ? (
          <FontAwesome5 name="dice" size={50} color="#0088ff" />
        ) : (
          <View style={styles.diceRow}>
            {diceValues.map((value, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleDiceLock(index)}
                style={[
                  styles.diceTouchable,
                  lockedDice[index] && styles.lockedDice,
                ]}
              >
                <FontAwesome5
                  name={diceIcons[value - 1]}
                  size={50}
                  color={lockedDice[index] ? "#FF6347" : "#0088ff"}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.throwsText}>Throws left: {nbrOfThrowsLeft}</Text>

      <Text style={styles.throwDicesText}>
        {nbrOfThrowsLeft === 3
          ? "Throw 3 times before setting points"
          : nbrOfThrowsLeft > 0
          ? "Select and throw dices again"
          : "You can now set points"}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleThrowDices}
        disabled={nbrOfThrowsLeft === 0}
      >
        <Text style={styles.buttonText}>THROW DICES</Text>
      </TouchableOpacity>

      <Text style={styles.totalText}>Total: {totalPoints}</Text>
      <Text style={styles.bonusText}>
        You are {BONUS_POINTS_LIMIT - totalPoints} points away from bonus
      </Text>

      <View style={styles.diceNumberContainer}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <View key={num} style={styles.diceColumn}>
            <Text style={styles.diceValue}>
              {selectedNumbers[num - 1] === 0
                ? countOccurrences(num, diceValues) * num
                : selectedPoints[num - 1]}
            </Text>
            <TouchableOpacity
              //rgba(255, 133, 133, 0.6)
              style={[
                styles.diceButton,
                selectedNumbers[num - 1] !== 0
                  ? { backgroundColor: "#4d4d4d" }
                  : nbrOfThrowsLeft > 0 ||
                    lockedDice.every((dice) => !dice) ||
                    (lockedDice.some((dice) => dice) &&
                      num !==
                        Math.max(
                          ...diceValues.filter((_, index) => lockedDice[index])
                        ))
                  ? { backgroundColor: "rgba(255, 133, 133, 0.6)" }
                  : { backgroundColor: "#0088ff" },
              ]}
              onPress={() => handleSelectNumber(num)}
              disabled={
                selectedNumbers[num - 1] !== 0 ||
                (nbrOfThrowsLeft > 0 && lockedDice.every((dice) => !dice)) ||
                (nbrOfThrowsLeft === 0 &&
                  lockedDice.some((dice) => dice) &&
                  num !==
                    Math.max(
                      ...diceValues.filter((_, index) => lockedDice[index])
                    ))
              }
            >
              <Text style={styles.diceButtonText}>{num}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.playerNameText}>Player: {playerName}</Text>

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
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  diceContainer: {
    marginBottom: 20,
  },
  diceRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  diceTouchable: {
    padding: 5,
  },
  lockedDice: {
    opacity: 0.6,
  },
  throwsText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  throwDicesText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0088ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },
  bonusText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    color: "#FF6347",
  },
  diceNumberContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  diceColumn: {
    alignItems: "center",
    width: "16%",
  },
  diceValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  diceButton: {
    width: 50,
    height: 50,
    backgroundColor: "#0088ff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  diceButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  playerNameText: {
    fontSize: 19,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  footerContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default Gameboard;
