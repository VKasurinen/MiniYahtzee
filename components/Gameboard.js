import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';

const Gameboard = () => {
  const route = useRoute();
  const { playerName } = route.params || {};
  
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(3);
  const [diceValues, setDiceValues] = useState(Array(5).fill(null)); // Initial state with 5 null values
  const [lockedDice, setLockedDice] = useState([false, false, false, false, false]); // Track locked dice (initially all false)
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState(Array(6).fill(0));


// Function to process the selected number
const handleSelectNumber = (selectedNum) => {
 // Calculate the score based on the selected number and dice values
  const points = countOccurrences(selectedNum, diceValues) * selectedNum;
  setTotalPoints(totalPoints + points); // Update totalPoints

  // Prevent rechoise
  const updatedSelectedNumbers = [...selectedNumbers];
  updatedSelectedNumbers[selectedNum - 1] = 0; // Reset the selected number
  setSelectedNumbers(updatedSelectedNumbers);
};

// Helper function to count occurrences of a number in dice
const countOccurrences = (num, arr) => {
  return arr.filter((value) => value === num).length;
};


  
  const diceIcons = ['dice-one', 'dice-two', 'dice-three', 'dice-four', 'dice-five', 'dice-six'];
  const NBR_OF_DICES = 5;
  const BONUS_POINTS_LIMIT = 63;

  // Function to handle dice throwing
  const handleThrowDices = () => {
    if (nbrOfThrowsLeft > 0) {
      setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);

      // If this is the first throw, initialize all diceValues with random numbers
      const newDiceValues = diceValues.map((value, index) =>
        value === null || !lockedDice[index] ? Math.floor(Math.random() * 6) + 1 : value
      );
      setDiceValues(newDiceValues);
    }
  };

  // Toggle dice lock state
  const toggleDiceLock = (index) => {
    const updatedLocks = [...lockedDice];
    updatedLocks[index] = !updatedLocks[index]; // Switch locks
    setLockedDice(updatedLocks);
  
    if (updatedLocks[index]) {
      // If the dice is locked, update the selected number
      const diceValue = diceValues[index];
      setSelectedNumbers((prevSelectedNumbers) => {
        const updatedNumbers = [...prevSelectedNumbers];
        updatedNumbers[diceValue - 1] = diceValue; // Set the selected number
        return updatedNumbers;
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Dice icons */}
      <View style={styles.diceContainer}>
        {diceValues.every((value) => value === null) ? (
          // Show a single dice icon before the first throw
          <FontAwesome5 name="dice" size={50} color="#0088ff" />
        ) : (
          <View style={styles.diceRow}>
            {diceValues.map((value, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleDiceLock(index)} // Select/unselect the dice
                style={[
                  styles.diceTouchable,
                  lockedDice[index] && styles.lockedDice, // Add different styling for locked dice
                ]}
              >
                <FontAwesome5
                  name={diceIcons[value - 1]} // Map dice value to FontAwesome icon
                  size={50}
                  color={lockedDice[index] ? '#FF6347' : '#0088ff'} // Change color if locked
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Text for throwing dice */}
      <Text style={styles.throwsText}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.throwDicesText}>
        {nbrOfThrowsLeft < 3 ? 'Select and throw dices again' : 'Throw dices.'}
      </Text>

      {/* Throw dices button */}
      <TouchableOpacity style={styles.button} onPress={handleThrowDices}>
        <Text style={styles.buttonText}>THROW DICES</Text>
      </TouchableOpacity>

      {/* Total points */}
      <Text style={styles.totalText}>Total: {totalPoints}</Text>

      {/* Bonus points message */}
      <Text style={styles.bonusText}>
        You are {BONUS_POINTS_LIMIT - totalPoints} points away from bonus
      </Text>

      {/* Dice number buttons */}
      <View style={styles.diceNumberContainer}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <View key={num} style={styles.diceColumn}>
            <Text style={styles.diceValue}>{countOccurrences(num, diceValues) * num}</Text>
            <TouchableOpacity
              style={styles.diceButton}
              onPress={() => handleSelectNumber(num)}
            >
              <Text style={styles.diceButtonText}>{num}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>


      {/* Player name */}
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
    backgroundColor: '#fff',
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
    fontSize: 18,
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
