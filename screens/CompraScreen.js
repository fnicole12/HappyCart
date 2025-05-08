import React, { useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Switch,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { listasDeMandado } from '../data/mockData';

export default function CompraScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { listaId } = route.params ?? {};
    
  //busca el id que se manda de ListaDetalles
  const lista = listasDeMandado.find(l => l.id === listaId);
    
  const [productos, setProductos] = useState(
    lista?.productos.map(p => ({ ...p, precio: '', comprado: false })) || []
  );
    
  const titulo = lista?.titulo ?? 'Mandado';
    

  const [supermercado, setSupermercado] = useState('Supermercado A');

  const actualizarPrecio = (id, valor) => {
    setProductos(prev =>
      prev.map(p =>
        p.id === id ? { ...p, precio: valor } : p
      )
    );
  };

  const toggleCompra = (id) => {
    setProductos(prev =>
      prev.map(p =>
        p.id === id ? { ...p, comprado: !p.comprado } : p
      )
    );
  };

  const calcularTotal = () => {
    return productos.reduce((total, p) => {
      const precio = parseFloat(p.precio);
      return total + (isNaN(precio) ? 0 : precio);
    }, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {/*flecha regresar*/}
      <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} />
    </TouchableOpacity>

      {/*selector supermercado */}
      <TouchableOpacity style={styles.superBtn}>
        <Text style={styles.superText}>▼ {supermercado}</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Mandado</Text>

      {/*tabla */}
      <ScrollView style={styles.tabla}>
        <View style={styles.tablaHeader}>
          <Text style={styles.col}>✓</Text>
          <Text style={styles.col}>Cantidad</Text>
          <Text style={styles.col}>Producto</Text>
          <Text style={styles.col}>Precio</Text>
        </View>

        {productos.map((p) => (
          <View key={p.id} style={styles.fila}>
            <TouchableOpacity onPress={() => toggleCompra(p.id)}>
                <Ionicons
                name={p.comprado ? 'checkbox' : 'square-outline'}
                size={24}
                color={p.comprado ? '#f5ac70' : '#ccc'}
                />
            </TouchableOpacity>


            <Text style={styles.col}>{p.cantidad}</Text>
            <Text style={styles.col}>{p.nombre}</Text>
            <TextInput
              style={[styles.precioInput]}
              placeholder="$"
              keyboardType="numeric"
              value={p.precio}
              onChangeText={(v) => actualizarPrecio(p.id, v)}
            />
          </View>
        ))}

        {/*TOTAL*/}
        <View style={styles.totalRow}>
          <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
          <Text style={{ marginLeft: 'auto' }}>${calcularTotal()}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.finalizarBtn}>
        <Text style={styles.finalizarText}>Finalizar compra</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    backBtn: {
      marginBottom: 10,
    },
    superBtn: {
      backgroundColor: '#D6F1C6',
      padding: 10,
      borderRadius: 20,
      alignSelf: 'flex-end',
    },
    superText: {
      fontWeight: 'bold',
    },
    titulo: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 20,
    },
    tabla: {
      borderWidth: 1,
      borderColor: '#f5ac70',
      borderRadius: 12,
      padding: 10,
      marginBottom: 20,
      backgroundColor: '#fdfdfd',
    },
    tablaHeader: {
      flexDirection: 'row',
      marginBottom: 8,
      justifyContent: 'space-between',
    },
    fila: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    col: {
      flex: 1,
      textAlign: 'center',
    },
    precioInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 4,
      borderRadius: 6,
      width: 60,
      textAlign: 'center',
    },
    totalRow: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-between',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    finalizarBtn: {
      backgroundColor: '#f5ac70',
      padding: 12,
      alignItems: 'center',
      borderRadius: 10,
    },
    finalizarText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  