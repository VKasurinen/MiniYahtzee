import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const Home = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false); // State to track if name is submitted

  // Save player's name and show game rules
  const handleSubmit = async () => {
    if (playerName.trim()) {
      try {
        await AsyncStorage.setItem('playerName', playerName);  // Store player name
        Keyboard.dismiss();  // Close keyboard
        setIsNameSubmitted(true);  // Show game rules after name is submitted
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('Please enter your name');
    }
  };

  // Game rules constants
  const NBR_OF_DICES = 5;
  const NBR_OF_THROWS = 3;
  const MIN_SPOT = 1;
  const MAX_SPOT = 6;
  const BONUS_POINTS_LIMIT = 63;
  const BONUS_POINTS = 50;

  const gameRules = `
    THE GAME: Upper section of the classic Yahtzee dice game. 
    You have ${NBR_OF_DICES} dices and for every dice, you have ${NBR_OF_THROWS} throws. 
    After each throw, you can keep dices to get the same dice spot counts as many as possible. 
    In the end, you must select your points from ${MIN_SPOT} to ${MAX_SPOT}. 
    Game ends when all points have been selected. The order for selecting those is free.

    POINTS: After each turn, the game calculates the sum for the dices you selected. 
    Only the dices with the same spot count are calculated. 
    Inside the game, you cannot select the same points from ${MIN_SPOT} to ${MAX_SPOT} again.

    GOAL: To get as many points as possible. ${BONUS_POINTS_LIMIT} points is the limit of getting a bonus which gives you ${BONUS_POINTS} points more.
  `;

  return (
    <ScrollView contentContainerStyle={styles.container}>

        <AntDesign name="exclamationcircle" size={48} color="#0088ff" style={styles.icon} />

        <Text style={styles.header}>Welcome to Mini-Yahtzee</Text>
      
      {!isNameSubmitted && (  // Show input only if the name hasn't been submitted
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={playerName}
            onChangeText={setPlayerName}
            onSubmitEditing={handleSubmit}
            autoFocus={true}  // Open keyboard automatically
            returnKeyType="done"
          />
          <Button title="OK" onPress={handleSubmit} />
        </>
      )}
      
      {isNameSubmitted && (  // Show game rules after the name is submitted
        <>
          <Text style={styles.rulesTitle}>Rules of the Game</Text>
          <Text style={styles.rulesText}>{gameRules}</Text>
          <Text style={styles.NameText}>Good Luck, {playerName}!</Text>
          <Button
            title="Play"
            onPress={() => navigation.navigate('Gameboard', { playerName })}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  rulesText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'justify',
  },
  NameText: {
    fontSize: 20,
    marginStart: 100,
    marginBottom: 20,
    fontWeight: "bold",
    color: '#4CAF50',
    textAlign: 'justify',
  },
});

export default Home;
