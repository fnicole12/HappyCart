import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { URL } from './constants';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createNew, setCreateNew] = useState(true);
  const [familyId, setFamilyId] = useState('');
  
  const navigation = useNavigation();

  const handleSignUp = async () => {
    //validar contraseña
    if(password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    //validar familia
    if(!createNew && !familyId) {
      alert('Por favor ingrese el ID de la familia');
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
          create_new: createNew,
          family_id: familyId,
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

    <View style={styles.content}>
        <View style={styles.formContainer}>
        <Text style={styles.title}>Regístrate</Text>
        <Text style={{ color: '#fff', marginBottom: 10 }}>Si no te unes a una familia existente se creará una propia.</Text>

        {/*Nombre*/}
        <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
        />

        {/*Telefono*/}
        <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#ccc"
            value={phone}
            onChangeText={setPhone}
        />

        {/*Contraseña*/}
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

        {/*Familia*/}
        <View >	
            <TouchableOpacity
              style={styles.familyButton}
              onPress={() => setCreateNew(!createNew) }
            >
              <Text>Unirse a familia</Text>
            </TouchableOpacity>
          </View>

        {!createNew && (
          <TextInput
            style={styles.input}
            placeholder="Código de familia"
            placeholderTextColor="#ccc"
            value={familyId}
            onChangeText={setFamilyId}
          />
        )}


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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f5ac70',
    paddingTop: 20,
    paddingLeft: 30,
    paddingBottom: 20,
    paddingRight: 30,
    //borderBottomLeftRadius: 20,
    //borderBottomRightRadius: 20,
  },
  logo: {
    width: 50,
    height: 50,
    //resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    },
  footer: {
    height: 100,
    backgroundColor: '#f5ac70',
    //borderTopLeftRadius: 20,
    //borderTopRightRadius: 20,
    },
  formContainer: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    //height: '50%',
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
  familyButton: {
    backgroundColor: '#ccc',
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  signUpText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
