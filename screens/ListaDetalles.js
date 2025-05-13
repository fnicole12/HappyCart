import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { sugerenciasAnteriores, resultadosBusqueda } from '../data/mockData';



export default function ListaDetalle() {
  const route = useRoute();
  const navigation = useNavigation();
    
  const lista = route.params?.lista ?? {
    id: '0',
    titulo: 'Lista sin nombre',
    productos: [],
    fecha: '',
    miembro: '',
  };
    
  
  const [nombreLista, setNombreLista] = useState(lista.titulo);
  const [productos, setProductos] = useState(lista.productos || []);
  
  const agregarProducto = (nombre) => {
    setProductos((prev) => [...prev, { id: Date.now(), nombre, cantidad: 1 }]);
  };

  const eliminarProducto = (id) => {
    setProductos((prev) => prev.filter(p => p.id !== id));
  };
  
  const cambiarCantidad = (id, delta) => {
    setProductos((prev) =>
      prev.map(p =>
        p.id === id
          ? { ...p, cantidad: Math.max(1, p.cantidad + delta) }
          : p
      )
    );
  };
  

  return (
    <ScrollView style={styles.container}>
      {/*encabezado*/}
      <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
      <Ionicons name="arrow-back" size={24} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.saveBtn}>
      <Text style={{ color: '#fff' }}>Guardar lista</Text>
    </TouchableOpacity>
  </View>

  <Text style={styles.label}>Nombre lista</Text>
  <TextInput
    style={styles.input}
    value={nombreLista}
    onChangeText={setNombreLista}
    placeholder="Mi lista de compras"
  />

  <View style={styles.listaContainer}>
    {productos.map((p) => (
      <View key={p.id} style={styles.productoItem}>
        <TouchableOpacity onPress={() => cambiarCantidad(p.id, -1)} style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
        <Text style={styles.cantidad}>{p.cantidad}</Text>
        <TouchableOpacity onPress={() => cambiarCantidad(p.id, 1)} style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
        <Text style={styles.productoTexto}>{p.nombre}</Text>
        <TouchableOpacity onPress={() => eliminarProducto(p.id)} style={styles.eliminarBtn}>
          <Ionicons name="close" size={16} color="#000" />
        </TouchableOpacity>
      </View>
    ))}
  </View>

      {/*sugerencias*/}
      <Text style={styles.subtitulo}>Sugerencias de compras anteriores</Text>
      <View style={styles.chipsContainer}>
        {sugerenciasAnteriores.map((s, i) => (
          <TouchableOpacity key={i} style={styles.chip} onPress={() => agregarProducto(s)}>
            <Text>+ {s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/*buscador (solo interfaz)*/}
      <Text style={styles.subtitulo}>Buscar ingredientes de recetas</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput style={styles.searchInput} placeholder="What are you looking for?" />
        <TouchableOpacity style={styles.buscarBtn}><Text style={{ color: 'white' }}>Buscar</Text></TouchableOpacity>
      </View>

      {/*resultados de búsqueda*/}
      <View style={styles.chipsContainer}>
        {resultadosBusqueda.map((s, i) => (
          <TouchableOpacity key={i} style={styles.chip} onPress={() => agregarProducto(s)}>
            <Text>+ {s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <TouchableOpacity
          style={styles.iniciarCompraBtn}
          onPress={() => navigation.navigate('Compra', { listaId: lista.id })}> 
          {/*pasamos el id a la pantalla compra screen*/}
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Iniciar compra</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 30,
    },
    saveBtn: {
      backgroundColor: '#f5ac70',
      padding: 8,
      borderRadius: 10,
    },
    label: {
      marginTop: 20,
      fontWeight: 'bold',
    },
    input: {
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 6,
      marginBottom: 10,
    },
    listaContainer: {
      borderWidth: 1,
      borderColor: '#f5ac70',
      borderRadius: 10,
      padding: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      elevation: 2,
      marginBottom: 20,
    },
    productoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    qtyBtn: {
      backgroundColor: '#eee',
      padding: 6,
      borderRadius: 6,
      marginRight: 8,
    },
    cantidad: {
        width: 30,
        textAlign: 'center',
      },
      productoTexto: {
        flex: 1,
        marginLeft: 10,
      },      
    eliminarBtn: {
      padding: 4,
    },
    subtitulo: {
      fontWeight: 'bold',
      backgroundColor: '#D6F1C6',
      padding: 6,
      borderRadius: 6,
      marginBottom: 6,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    chip: {
      backgroundColor: '#eee',
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 10,
      margin: 4,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eee',
      borderRadius: 20,
      paddingHorizontal: 10,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 6,
    },
    buscarBtn: {
      backgroundColor: '#f5ac70',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginLeft: 8,
    },
    iniciarCompraBtn: {
      backgroundColor: '#f5ac70',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    
  });
  