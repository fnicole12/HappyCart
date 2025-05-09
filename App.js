import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ListaDetalles from './screens/ListaDetalles';
import CompraScreen from './screens/CompraScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen name="ListaDetalles" component={ListaDetalles}/>
        <Stack.Screen name="Compra" component={CompraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
