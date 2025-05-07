import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; //para los iconos
import { listasDeMandado, sugerenciasAnteriores, resultadosBusqueda } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';


const opciones = [
  { id: 1, nombre: 'Nueva lista de mandado', icon: 'clipboard-outline' },
  { id: 2, nombre: 'Ver compras anteriores', icon: 'calendar-outline' },
  { id: 3, nombre: 'Unirte a familia', icon: 'people-outline' },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/*encabezado*/}
      <View style={styles.header}>
        <Ionicons name="menu" size={30} color="black" />
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.titulo}>¿Qué quieres hacer?</Text>

      {/*opciones*/}
      <View style={styles.opcionesContainer}>
      {opciones.map((item) => (
        <TouchableOpacity
        key={item.id}
        style={styles.opcion}
        onPress={() => {
        if (item.id === 1) {
        //boton de nueva lista vacia
        const nuevaLista = {
          id: Date.now().toString(),
          titulo: 'Nueva lista',
          productos: [],
          fecha: new Date().toLocaleDateString('es-MX'),
          miembro: 'Tú',
        };
        navigation.navigate('ListaDetalles', { lista: nuevaLista });
        }
      }}>
    <Ionicons name={item.icon} size={24} color="white" />
    <Text style={styles.opcionTexto}>{item.nombre}</Text>
  </TouchableOpacity>
))}

      </View>

      {/*listas*/}
      <Text style={styles.seccionTitulo}>Listas de mandado</Text>
      <FlatList
        data={listasDeMandado}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.listaCard}
          onPress={() => navigation.navigate('ListaDetalles', { lista: item })}>
          <View>
            <Text style={styles.listaTitulo}>{item.titulo}</Text>
            <Text>{item.productos.length} productos</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text>{item.fecha}</Text>
            <Text>{item.miembro}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
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
});
