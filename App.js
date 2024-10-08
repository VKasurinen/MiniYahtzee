import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./components/Home";
import Gameboard from "./components/Gameboard";
import Scoreboard from "./components/Scoreboard";
import Header from "./components/Header";
import { AntDesign } from "@expo/vector-icons";

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

                if (route.name === "Home") {
                  iconName = "home";
                } else if (route.name === "Gameboard") {
                  iconName = "appstore-o";
                } else if (route.name === "Scoreboard") {
                  iconName = "barschart";
                }

                return <AntDesign name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#0088ff",
              tabBarInactiveTintColor: "gray",
              headerShown: false,
              // Hide the tab bar on the Home screen
              tabBarStyle:
                route.name === "Home" && !route.params?.showTabs
                  ? { display: "none" }
                  : {},
            })}
          >
            <Tab.Screen
              name="Home"
              component={Home}
              initialParams={{ showTabs: false }} // Set initial state to hide tabs
            />
            <Tab.Screen name="Gameboard" component={Gameboard} />
            <Tab.Screen name="Scoreboard" component={Scoreboard} />
          </Tab.Navigator>
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  }
});