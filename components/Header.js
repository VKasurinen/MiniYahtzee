import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        Mini-Yahtzee
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0088ff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,  
    borderBottomColor: '#333',
    width: "100%",
  },
  title: {
    fontSize: 24,     
    fontWeight: 'bold',    
    color: '#fff',
  }
});

export default Header;
