import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const URL = "http://192.168.1.91:8000";     //cambiar segun necesario

export default function HomeScreen( { route }) {
  const navigation = useNavigation();

  const [familyId, setFamilyId] = useState('');
  const [phone, setPhone] = useState('');
  const [lists, setLists] = useState([]);
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [codigoFamilia, setCodigoFamilia] = useState('');


  //carga los datos del usuario
  useEffect(() => {
    if (route.params && route.params.user) {
      setFamilyId(route.params.user.familyId);
      setPhone(route.params.user.phone);
    }
  }, [route.params]);

  //recarga las listas cada vez que vuelve a home
  useFocusEffect(
    useCallback(() => {
      if (familyId) {
        console.log(familyId);
        const URL_UPDATED = URL + "/lists?family_id=" + familyId;
        fetch(URL_UPDATED)    //http get request
          .then(res => res.json())
          .then(data => setLists(data.lists))
          .catch(err => {
            console.log(err);
            alert("Error", "No se pudieron cargar las listas");
          });
      }
    }, [familyId])
  );

  //navegar a crear lista
  const navNewList = () => {
    navigation.navigate('ListaDetalles', {
      mode: 'new',
      familyId: familyId,
      phone: phone,
    });
  }
  

  return (
    <View style={styles.container}>
      {/*encabezado*/}
      <View style={styles.header}>
        <Ionicons name="menu" size={30} color="black" />
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.titulo}>¿Qué quieres hacer?</Text>

      {/* Opciones */}
      <View style={styles.opcionesContainer}>
        <View style={styles.filaOpciones}>
          <TouchableOpacity style={styles.opcion} onPress={navNewList}>
            <Ionicons name="clipboard-outline" size={24} color="white" />
            <Text style={styles.opcionTexto}>Nueva lista de mandado</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opcion} onPress={() => navigation.navigate('HistorialScreen')}>
            <Ionicons name="calendar-outline" size={24} color="white" />
            <Text style={styles.opcionTexto}>Ver compras anteriores</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filaUnir}>
          <TouchableOpacity style={styles.opcion} onPress={() => setMostrarCodigo(!mostrarCodigo)}>
            <Ionicons name="people-outline" size={24} color="white" />
            <Text style={styles.opcionTexto}>Unirte a familia</Text>
          </TouchableOpacity>

          {mostrarCodigo && (
            <View style={styles.codigoGroup}>
              <TextInput
                style={styles.codigoInput}
                placeholder="Código"
                value={codigoFamilia}
                onChangeText={setCodigoFamilia}
              />
              <TouchableOpacity style={styles.confirmarBtn} onPress={() => console.log('Código:', codigoFamilia)}>
                <Text style={styles.confirmarTexto}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

     {/* Listas activas */}
      <Text style={styles.seccionTitulo}>Listas de Mandado</Text>
      <FlatList
        data={lists}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listaCard}
            onPress={() => navigation.navigate('ListaDetalles', {  mode: 'edit', list: item, familyId: familyId, phone: phone })}>
            <View>
              <Text style={styles.listaTitulo}>{item.title}</Text>
              <Text>{item.products ? item.products.length: 0} productos</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text>{item.creation_date && item.creation_date.slice(0, 10)}</Text>
              <Text>{item.member}</Text>
              <Ionicons name="reorder-three-outline" size={20} color="gray" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  opcionesContainer: {
    //flexDirection: 'row',
    //justifyContent: 'space-around',
    alignItems: 'center', // centrado vertical
    marginBottom: 20,
  },
  opcion: {
    alignItems: 'center',
    backgroundColor: '#f5ac70',
    padding: 10,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  opcionTexto: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  seccionTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
  listaCard: {
    backgroundColor: '#D6F1C6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listaTitulo: {
    fontWeight: 'bold',
  },
  codigoContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    marginBottom: 6,
    fontWeight: 'bold',
  },
  codigoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: 100,
    marginRight: 8,
  },
  confirmarBtn: {
    backgroundColor: '#75C42B',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  confirmarTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  filaOpciones: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  codigoGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10, //codigo y confirmar demasiado juntos
  },
  filaUnir: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    //alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});
