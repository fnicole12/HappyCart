import React from 'react';
import{ useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const URL = "http://10.96.3.54:8000"; //cambiar segun necesario

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try{
      const URL_LOGIN = URL + "/login";
      const response = await fetch(URL_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log("Respuesta API: ", data);
      
      if(response.ok)
        Alert.alert('Login exitoso');
      else
        Alert.alert(data.detail || 'Error al iniciar sesión');

    }catch(error){
      console.log(error);
      console.log('No se pudo conectar al servidor');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.formContainer}>

        <Text style={styles.title}>Log in</Text>
        <TextInput 
        placeholder="Email Address"
        style={styles.input}
        value={email}
        onChangeText={setEmail} 
        />
        <TextInput 
        placeholder="Password" 
        //secureTextEntry 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        />

        <Text style={styles.forgot}>Forgot Password?</Text>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>


        <Text style={styles.orText}>or</Text>
        <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5AC70',
  },
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 20,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: 'gray',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#444',
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 12,
    color: 'gray',
  },
  signupText: {
    textAlign: 'center',
    color: 'gray',
  },
  signupLink: {
    color: 'black',
    fontWeight: 'bold',
  },
});