import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MIN_SPOT,
  MAX_SPOT,
  BONUS_POINTS_LIMIT,
  BONUS_POINTS,
  GAMERULES
} from '../constants/Game'


const Home = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false); 

  const handleSubmit = async () => {
    if (playerName.trim()) {
      try {
        await AsyncStorage.setItem('playerName', playerName);
        Keyboard.dismiss();
        setIsNameSubmitted(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('Please enter your name');
    }
  };


  return (
    <View style={styles.container}>
        <AntDesign name="exclamationcircle" size={60} color="#0088ff" style={styles.icon} />
      
      {!isNameSubmitted && (
        <>
          <Text style={styles.header}>Welcome to Mini-Yahtzee</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={playerName}
            onChangeText={setPlayerName}
            onSubmitEditing={handleSubmit}
            autoFocus={true}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </>
      )}
      
      {isNameSubmitted && (
        <>
          <Text style={styles.rulesTitle}>Rules of the Game</Text>
          <Text style={styles.rulesText}>{GAMERULES}</Text>
          <Text style={styles.NameText}>Good Luck, {playerName}!</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gameboard', { playerName })}>
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',  
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rulesText: {
    fontSize: 17,
    textAlign: 'justify',
    fontWeight: '500',
    lineHeight: 22,
  },
  NameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0088ff',
    padding: 10,
    marginBottom: 40,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;