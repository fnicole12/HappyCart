import React from 'react';
import{ useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const URL = "http://192.168.1.91:8000";     //cambiar segun necesario

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    try{
      const URL_LOGIN = URL + "/login";
      const response = await fetch(URL_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          password,
        }),
      });
      const data = await response.json();
      console.log("Respuesta API: ", data);
      
      if(response.ok){
        //alert('Login exitoso');
        navigation.navigate('HomeScreen', { user:{ familyId: data.family_id, phone: data.phone, name: data.name } });   //se pasa la info a HomeScreen
      }
      else
        alert(data.detail || 'Error al iniciar sesión');

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

        <Text style={styles.title}>Inicia Sesión</Text>
        <TextInput 
        placeholder="Número de teléfono"
        style={styles.input}
        value={phone}
        onChangeText={setPhone} 
        />
        <TextInput 
        placeholder="Contraseña" 
        //secureTextEntry 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        />

        {/*<Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>*/}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Iniciar sesión</Text>
        </TouchableOpacity>


        <Text style={styles.orText}>o</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>¿No tienes una cuenta? <Text style={styles.signupText}>Regístrate</Text></Text>
        </TouchableOpacity>
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