import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/Home';
import Gameboard from './components/Gameboard';
import Scoreboard from './components/Scoreboard';  
import Header from './components/Header';
import Footer from './components/Footer';
import { AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Header />
        
        <View style={styles.content}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = 'home';
                } else if (route.name === 'Gameboard') {
                  iconName = 'appstore-o';
                } else if (route.name === 'Scoreboard') {
                  iconName = 'barschart';
                }

                return <AntDesign name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#0088ff',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Gameboard" component={Gameboard} />
            <Tab.Screen name="Scoreboard" component={Scoreboard} />
          </Tab.Navigator>
        </View>

        <View style={styles.footerContainer}>
          <Footer />
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});