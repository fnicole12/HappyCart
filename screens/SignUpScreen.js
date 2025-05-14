import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const URL = "http://192.168.100.33:8000";   //cambiar segun necesario

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if(password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try{
      const URL_LOGIN = URL + "/signup";
      const response = await fetch(URL_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          password,
        }),
      });
      const data = await response.json();
      console.log("Respuesta API: ", data);

      if(response.ok){
        alert('Registro exitoso');
        navigation.navigate('Login');
      }
      else
        alert(data.detail || 'Error al registrarse');

    }catch(error){
      console.log(error);
      alert('Error al registrarse');
    }
  };


  return (
    <View style={styles.container}>
    <View style={styles.header} />

    <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <View style={styles.formContainer}>
        <Text style={styles.title}>Regístrate</Text>

        <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
        />

        <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#ccc"
            value={phone}
            onChangeText={setPhone}
        />

        <View style={styles.passwordContainer}>
            <TextInput
            style={styles.inputPassword}
            placeholder="Contraseña"
            placeholderTextColor="#ccc"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#ccc" />
            </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
            <TextInput
            style={styles.inputPassword}
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#ccc"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#ccc" />
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpText}>Confirmar</Text>
        </TouchableOpacity>
        </View>
    </View>

    <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    },
  header: {
    height: 60,
    backgroundColor: '#f5ac70',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    },
  footer: {
    height: 60,
    backgroundColor: '#f5ac70',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginVertical: 20,
    marginTop: -30,
  },
  formContainer: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    height: '50%',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 20,
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 8,
    color: '#fff',
  },
  signUpButton: {
    backgroundColor: '#D6F1C6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
