import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';

const Gameboard = () => {
  const route = useRoute();
  const { playerName } = route.params || {};
  
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(3);
  const [diceValues, setDiceValues] = useState(Array(5).fill(null)); 
  const [lockedDice, setLockedDice] = useState([false, false, false, false, false]); 
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState(Array(6).fill(0)); // Track selected numbers (1 through 6)

  // Function to process the selected number based on locked dice
  const handleSelectNumber = (selectedNum) => {
    if (selectedNumbers[selectedNum - 1] !== 0) {
      return; // Exit if the number has been selected already
    }

    // Calculate the score based on locked dice values matching the selected number
    const points = countOccurrences(selectedNum, diceValues.filter((_, index) => lockedDice[index])) * selectedNum;
    setTotalPoints(totalPoints + points); // Update total points

    // Mark this number as selected
    const updatedSelectedNumbers = [...selectedNumbers];
    updatedSelectedNumbers[selectedNum - 1] = 1; // Mark this number as used
    setSelectedNumbers(updatedSelectedNumbers);

    // Reset locked dice after assigning points
    setLockedDice([false, false, false, false, false]);

    // Check if the game is over (all numbers selected)
    if (updatedSelectedNumbers.every(num => num !== 0)) {
      alert('Game over! All numbers are selected.');
      return;
    }
    
    // Reset throws for the next turn
    setNbrOfThrowsLeft(3);
    setDiceValues(Array(5).fill(null)); // Reset dice values for the next round
  };

  // Function to toggle the dice lock state
  const toggleDiceLock = (index) => {
    const updatedLocks = [...lockedDice];
    updatedLocks[index] = !updatedLocks[index]; 
    setLockedDice(updatedLocks);
  };

  // Function to count occurrences of a number in the dice values
  const countOccurrences = (num, arr) => {
    return arr.filter((value) => value === num).length;
  };

  // Handle dice throwing
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
        {nbrOfThrowsLeft < 3 ? 'Select and throw dices again' : 'Throw dices.'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleThrowDices}>
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
            <Text style={styles.diceValue}>{countOccurrences(num, diceValues) * num}</Text>
            <TouchableOpacity
              style={[
                styles.diceButton,
                selectedNumbers[num - 1] !== 0 && { backgroundColor: "#404040" }, // Tummentaa jos numero on jo valittu
                nbrOfThrowsLeft > 0 && { opacity: 0.6 }, // Tummentaa napin, jos heittoja on vielä jäljellä
              ]}
              onPress={() => handleSelectNumber(num)}
              disabled={selectedNumbers[num - 1] !== 0 || nbrOfThrowsLeft > 0} // Disable, jos numero on jo valittu tai heittoja on jäljellä
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