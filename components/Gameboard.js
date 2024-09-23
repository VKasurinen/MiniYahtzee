import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';

const Gameboard = () => {
  const route = useRoute();
  const [isDisabled, setIsDisabled] = useState(false);
  const { playerName } = route.params || {};
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(3);
  const [diceThrown, setDiceThrown] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const diceNumbers = [1, 2, 3, 4, 5, 6]; // For the dice number buttons

  const NBR_OF_DICES = 5;
  const NBR_OF_THROWS = 3;
  const MIN_SPOT = 1;
  const MAX_SPOT = 6;
  const BONUS_POINTS_LIMIT = 63;
  const BONUS_POINTS = 50;

  // Handle the throw dices button click
  const handleThrowDices = () => {
    if (nbrOfThrowsLeft > 0) {
      setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
      setDiceThrown(true);
      // Logic for throwing dice and updating points will go here
    }
  };

  return (
    <View style={styles.container}>
      {/* Dice icons */}
      <View style={styles.diceContainer}>
        {diceThrown ? (
          <View style={styles.diceRow}>
            <FontAwesome5 name="dice-one" size={50} color="#0088ff" />
            <FontAwesome5 name="dice-two" size={50} color="#0088ff" />
            <FontAwesome5 name="dice-three" size={50} color="#0088ff" />
            <FontAwesome5 name="dice-four" size={50} color="#0088ff" />
            <FontAwesome5 name="dice-five" size={50} color="#0088ff" />
            <FontAwesome5 name="dice-six" size={50} color="#0088ff" />
          </View>
        ) : (
          <FontAwesome5 name="dice" size={50} color="#0088ff" />
        )}
      </View>

      {/* Throws left and "Throw dices" message */}
      <Text style={styles.throwsText}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.throwDicesText}>Throw dices.</Text>

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
        {diceNumbers.map((num) => (
          <View key={num} style={styles.diceColumn}>
            <Text style={styles.diceValue}>0</Text>
            <TouchableOpacity 
            style={styles.diceButton} disabled={isDisabled}>
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
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
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
    justifyContent: 'space-between',
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 40,
  },
  diceColumn: {
    alignItems: 'center',
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
