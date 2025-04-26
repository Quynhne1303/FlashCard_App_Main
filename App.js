import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebase/firebaseConfig";
import { Provider as PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddDeckScreen from "./src/screens/AddDeckScreen";
import DeckDetailScreen from "./src/screens/DeckDetailScreen";
import AddCardScreen from "./src/screens/AddCardScreen";
import StudyScreen from "./src/screens/StudyScreen";
import QuizScreen from "./src/screens/QuizScreen";
import EditCardScreen from "./src/screens/EditCardScreen";
import StatsScreen from "./src/screens/StatsScreen";
import SimilarCardsScreen from "./src/screens/SimilarCardsScreen";
import SharedDecksScreen from "./src/screens/SharedDecksScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#0163be",
            },
            headerTitleStyle: {
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
            },
            headerBackImage: () => (
              <Icon
                name="arrow-left"
                size={24}
                color="#fff"
                style={{ marginLeft: 10 }}
              />
            ),
          }}
        >
          {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="AddDeck"
                component={AddDeckScreen}
                options={{ title: "Thêm bộ thẻ" }}
              />
              <Stack.Screen
                name="SharedDecks"
                component={SharedDecksScreen}
                options={{ title: "Bộ thẻ online" }}
              />

              <Stack.Screen
                name="DeckDetail"
                component={DeckDetailScreen}
                options={({ route }) => ({
                  title: route.params?.title || "Chi tiết bộ thẻ",
                })}
              />
              <Stack.Screen
                name="AddCard"
                component={AddCardScreen}
                options={{ title: "Thêm thẻ mới" }}
              />
              <Stack.Screen
                name="Study"
                component={StudyScreen}
                options={{ title: "Học" }}
              />
              <Stack.Screen
                name="Quiz"
                component={QuizScreen}
                options={{ title: "Kiểm tra" }}
              />
              <Stack.Screen
                name="EditCard"
                component={EditCardScreen}
                options={{ title: "Chỉnh sửa thẻ" }}
              />
              <Stack.Screen
                name="Stats"
                component={StatsScreen}
                options={{ title: "Thống kê" }}
              />
              <Stack.Screen
                name="SimilarCards"
                component={SimilarCardsScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
