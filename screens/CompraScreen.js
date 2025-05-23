import React, { useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Switch,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

//import { listasDeMandado } from '../data/mockData';
import { URL } from './constants';

export default function CompraScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const familyId = route.params.user.familyId;
  const phone = route.params.user.phone;
  const title = route.params.list.title;
  const listProducts = route.params.list.products;
  
  const [supermarket, setSupermarket] = useState('');
  //mapear productos + precio y si fue "comprado"
  const [products, setProducts] = useState(() =>
    listProducts.map(p => ({
      ...p,
      price:'',
      marked: false,
    }))
  );

  //buscar precio
  const updatePrice = (id, value) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, price: parseFloat(value) || 0 } : p
      )
    );
  };

  //toggle compra
  const toggleBuy = id => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, marked: !p.marked } : p
      )
    );
  };

  //calcular total
  const calculateTotal = () => {
    return products
      .filter(p => p.marked)
      .reduce((total, p) => total + p.price * p.quantity, 0)
      .toFixed(2);
  };


  //comprar y guardar
  const handleBuy = async () => {    
    //verificar supermercado
    if(!supermarket){
      alert("Ingrese el nombre del supermercado");
      return;
    }
    //verificar que haya productos comprados
    const comprados = products.filter(p => p.marked && p.price > 0);
      if (comprados.length === 0) {
      alert('Marca al menos un producto como comprado y agrega su precio');
      return;
    }
    const buy ={
      family_id: familyId,
      phone: phone,
      supermarket: supermarket,
      title: title,
      products: comprados,
      total: parseFloat(calculateTotal()),
      date: new Date().toISOString()
    }
    
    try{
      const URL_BUY = URL + "/buy";
      response = await fetch(URL_BUY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buy),
      });
      const data = await response.json();

      if(response.ok){
        alert("Compra guardada");
        navigation.navigate('HomeScreen', { user: { familyId, phone } });
      }
      else{
        alert(data.detail || 'Error al guardar la compra');
      }
    }catch(error){
      console.log(error);
      alert('No se pudo conectar al servidor');
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>
      </View>

      <TextInput
        style={styles.superInput}
        placeholder="Nombre del supermercado"
        value={supermarket}
        onChangeText={setSupermarket}
      />

      <Text style={styles.titulo}>{title}</Text>

      <View style={styles.tabla}>
        <View style={styles.tablaHeader}>
          <Text style={styles.col}>✓</Text>
          <Text style={styles.col}>Cantidad</Text>
          <Text style={styles.col}>Producto</Text>
          <Text style={styles.col}>Precio</Text>
        </View>

        <ScrollView style={styles.scrollProductos}>
          {products.map(p => (
            <View key={p.id} style={styles.fila}>
              <TouchableOpacity onPress={() => toggleBuy(p.id)}>
                <Ionicons
                  name={p.marked ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={p.marked ? '#f5ac70' : '#ccc'}
                />
              </TouchableOpacity>
              <Text style={styles.col}>{p.quantity}</Text>
              <Text style={styles.col}>{p.name}</Text>
              <TextInput
                style={styles.precioInput}
                placeholder="$"
                keyboardType="numeric"
                value={p.price.toString()}
                onChangeText={value => updatePrice(p.id, value)}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.totalRow}>
          <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
          <Text style={{ marginLeft: 'auto' }}>${calculateTotal()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.finalizarBtn} onPress={handleBuy}>
        <Text style={styles.finalizarText}>Finalizar compra</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 20,
    paddingRight: 30,
    //borderBottomLeftRadius: 20,
    //borderBottomRightRadius: 20,
  },
  superInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    minWidth: 160,
    marginBottom: 10,
    textAlign: 'right',
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
  scrollProductos: {
    maxHeight: 600,
  },
});