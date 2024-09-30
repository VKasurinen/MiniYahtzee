import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

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
    position: 'absolute',
    bottom: 1,            
    left: 0,
    right: 0,
    backgroundColor: '#f4f4f4',
    padding: 5,     
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#333',
    borderBottomColor: "#333",
    width: "100%",
    /*...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
      },
      android: {
        elevation: 5,
      },
    }),
    */
    
  },
  author: {
    fontSize: 16,   
    color: '#333',  
    fontWeight: "600"     
  }
});

export default Footer;