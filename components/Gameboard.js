import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SCOREBOARD_KEY} from '../constants/Game'


const Gameboard = () => {
  const route = useRoute();
  const { playerName } = route.params || {};
  
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(3);
  const [diceValues, setDiceValues] = useState(Array(5).fill(null)); 
  const [lockedDice, setLockedDice] = useState([false, false, false, false, false]); 
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState(Array(6).fill(0)); // Track selected numbers (1 through 6)
  const [selectedPoints, setSelectedPoints] = useState(Array(6).fill(0));

  const saveScore = async () => {
    try {
      const newScore = {
        playerName: playerName || 'Anonymous',  // Use playerName if available, or 'Anonymous'
        totalScore: totalPoints,
        date: new Date().toISOString(),  // Store the current date as ISO string
      };

      await AsyncStorage.clear(); // Clear all data

      const storedScores = await AsyncStorage.getItem(SCOREBOARD_KEY);
      const scores = storedScores ? JSON.parse(storedScores) : [];
  
      // Add the new score to the array
      scores.push(newScore);
  
      // Sort the scores in descending order (highest scores first)
      scores.sort((a, b) => b.totalScore - a.totalScore);
  
      // Save the top 7 scores back to AsyncStorage
      await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scores.slice(0, 7)));
      
    } catch (error) {
      console.error('Failed to save score', error);
    }
  };
  

  const handleSelectNumber = async (selectedNum) => {
    if (selectedNumbers[selectedNum - 1] !== 0 || nbrOfThrowsLeft > 0) {
      return; 
    }
  
    const points = countOccurrences(selectedNum, diceValues.filter((_, index) => lockedDice[index])) * selectedNum;
    console.log(`Selected Number: ${selectedNum}`);
    console.log(`Dice Values: ${diceValues}`);
    console.log(`Locked Dice: ${lockedDice}`);
    console.log(`Points to Add: ${points}`);
    setTotalPoints(totalPoints + points);
  
    const updatedSelectedNumbers = [...selectedNumbers];
    updatedSelectedNumbers[selectedNum - 1] = 1;
    setSelectedNumbers(updatedSelectedNumbers);
  
    const updatedSelectedPoints = [...selectedPoints];
    updatedSelectedPoints[selectedNum - 1] = points;
    setSelectedPoints(updatedSelectedPoints);
  
    setLockedDice([false, false, false, false, false]);
  
    if (updatedSelectedNumbers.every(num => num !== 0)) {
      // Game over, all numbers are selected
      await saveScore();
      alert('Game over! All numbers are selected.');
      return;
    }
  
    setNbrOfThrowsLeft(3);
    setDiceValues(Array(5).fill(null));
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
        value === null || !lockedDice[index] ? Math.floor(Math.random() * 6) + 1 : value
      );
      setDiceValues(newDiceValues);
    }
  };

  const diceIcons = ['dice-one', 'dice-two', 'dice-three', 'dice-four', 'dice-five', 'dice-six'];
  const BONUS_POINTS_LIMIT = 63;

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
                  color={lockedDice[index] ? '#FF6347' : '#0088ff'}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.throwsText}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.throwDicesText}>
        {nbrOfThrowsLeft === 3 ? 'Throw 3 times before setting points' : nbrOfThrowsLeft > 0 ? 'Select and throw dices again' : 'You can now set points'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleThrowDices} disabled={nbrOfThrowsLeft === 0}>
        <Text style={styles.buttonText}>THROW DICES</Text>
      </TouchableOpacity>

      <Text style={styles.totalText}>Total: {totalPoints}</Text>

      <Text style={styles.bonusText}>
        You are {BONUS_POINTS_LIMIT - totalPoints} points away from bonus
      </Text>

      {/* Number selection buttons */}
      <View style={styles.diceNumberContainer}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <View key={num} style={styles.diceColumn}>

            <Text style={styles.diceValue}>
              {selectedNumbers[num - 1] === 0 ? countOccurrences(num, diceValues) * num : selectedPoints[num - 1]}
            </Text>

            <TouchableOpacity
              style={[
                styles.diceButton,
                selectedNumbers[num - 1] !== 0 && { backgroundColor: "#404040" }, // Darken if the number is already selected
                nbrOfThrowsLeft > 0 && { opacity: 0.6 }, // Darken the button if there are still rolls left
              ]}
              onPress={() => handleSelectNumber(num)}
              disabled={selectedNumbers[num - 1] !== 0 || nbrOfThrowsLeft > 0} // Disable if the number has already been selected or there are some rolls left
            >
              <Text style={styles.diceButtonText}>{num}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.playerNameText}>Player: {playerName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  diceContainer: {
    marginBottom: 20,
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    width: '100%',
  },
  diceTouchable: {
    padding: 5,
  },
  lockedDice: {
    opacity: 0.6,
  },
  throwsText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  throwDicesText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0088ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  bonusText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    color: '#FF6347',
  },
  diceNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  diceColumn: {
    alignItems: 'center',
    width: '16%',
  },
  diceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  diceButton: {
    width: 50,
    height: 50,
    backgroundColor: '#0088ff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerNameText: {
    fontSize: 19,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Gameboard;