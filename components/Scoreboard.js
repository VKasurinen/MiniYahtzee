import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Scoreboard = () => {
  return (
    <View style={styles.container}>
      {/* Centered Icon */}
      <AntDesign name="barschart" size={100} color="#0088ff" />
      
      {/* Top Seven Text */}
      <Text style={styles.topText}>Top Seven</Text>
      
      {/* Scoreboard is Empty Text */}
      <Text style={styles.emptyText}>Scoreboard is empty</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  topText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0088ff',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    //color: '#888',
    marginTop: 10,
  },
});

export default Scoreboard;
