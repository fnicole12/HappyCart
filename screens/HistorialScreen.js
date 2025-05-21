import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useState, useEffect, useCallback} from 'react';
import { URL } from './constants';

export default function HistorialScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [record, setRecord] = useState([]);
  const [familyId, setFamilyId] = useState('');

  //carga los datos del usuario
  useEffect(() => {
    if (route.params && route.params.user) {
      setFamilyId(route.params.user.familyId);
    }
  }, [route.params]);
  
  //recarga las listas
  useFocusEffect(
    useCallback(() => {
      if (familyId) {
        const URL_RECORD = URL + "/record?family_id=" + familyId;
        fetch(URL_RECORD)
          .then(res => res.json())
          .then(data => {
            if(data.purchases){
              //console.log("Historial: ", data.purchases);
              setRecord(data.purchases);
            }else{
              console.log("No hay historial; ", data.detail);
              setRecord([]);
            }
          })
          .catch(err => {
            console.log(err);
            alert("No se pudo cargar el historial");
          });
      }
    }, [familyId])
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.titulo}>Historial de Compras</Text>

      <FlatList
        data={record}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const fecha = new Date(item.date);
          const fechaTexto = `${fecha.getDate()}/${
            fecha.getMonth() + 1
          }/${fecha.getFullYear().toString().slice(-2)}`;

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetalleCompra', { purchase: item })
              }
            >
              <View style={styles.card}>
                <View>
                  <Text style={styles.cardTitulo}>{item.title}</Text>
                  <Text style={styles.cardText}>{item.supermarket}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.cardText}>{fechaTexto}</Text>
                  <Text style={styles.cardText}>TOTAL: ${item.total}</Text>
                  <Ionicons
                    name="reorder-three-outline"
                    size={20}
                    color="white"
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#f5ac70',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  cardText: {
    color: '#fff',
  },
});