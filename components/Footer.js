import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.author}>
        Author: Väinö Kasurinen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#f4f4f4',
    padding: 5,     
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,    
    borderTopColor: '#333',
    width: "100%" 
  },
  author: {
    fontSize: 16,   
    color: '#333',  
    fontWeight: "600"     
  }
});

export default Footer;
