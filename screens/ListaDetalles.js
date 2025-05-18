import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

import { sugerenciasAnteriores, resultadosBusqueda } from '../data/mockData';   //mockdata

const URL = "http://192.168.100.33:8000";     //cambiar segun necesario

export default function ListaDetalles() {
  const route = useRoute();
  const navigation = useNavigation();
    
  const mode = route.params.mode || 'new';  // 'new' o 'edit'
  const familyId = route.params.familyId;
  const phone = route.params.phone;
  const list = route.params?.list || null; //para editar una lista existente
  
  //estados locales
  const [title, setTitle] = useState(list ? list.title : '');
  const [newProduct, setNewProduct] = useState('');
  //inicializa productos con ids aleatorios
  const [products, setProducts] = useState(() => {
    if (list && list.products) {
      return list.products.map((p, i) => ({
        ...p,
        id: p.id || `${i}-${Date.now()}-${Math.random()}`
      }));
    }
    return [];
  });


  //manejo de productos, ids aleatorios
  const addProducts = (name) => {
    setProducts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, name, quantity: 1 }
    ]);
  };
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };
  const changeQuantity = (id, delta) => {
    setProducts((prev) =>
      prev.map(p =>
        p.id === id
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      )
    );
  };


  //guardar lista
  const localProducts = products.map(({name, quantity}) => ({name, quantity}));
  const handleSaveList = async () => {
    //validar nombre
    if(!title.trim()){
      alert('El nombre de la lista no puede estar vacío');
      return;
    }
    //validar productos
    if(products.length === 0){
      alert('La lista no puede estar vacía');
      return;
    }

    try{  //editar lista
      let response, data;
      const URL_LISTS = URL + "/lists";
      if(mode === 'edit' && list && list._id){    //verifica que la lista y su id existen
        response = await fetch(URL_LISTS + '/' + list._id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            products: products.map(({name, quantity}) => ({name, quantity})),
          }),
        })
        data = await response.json();
      }
      else{ //crear nueva lista
        response = await fetch(URL_LISTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          family_id: familyId,
          phone,
          title: title,
          products: localProducts,
        }),
        });
        data = await response.json();
      }
      

      if(response.ok){
        alert('Lista guardada :)');
        navigation.navigate('HomeScreen', { user: { familyId: familyId, phone } });
      }
      else
        alert(data.detail || 'Error al guardar la lista');
    }catch(error){
      console.log(error);
      alert('No se pudo conectar al servidor');
    }
  }


  return (
    <ScrollView style={styles.container}>
      {/*encabezado*/}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen', { user: { familyId: familyId, phone } })}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveList}>
          <Text style={{ color: '#fff' }}>Guardar lista</Text>
        </TouchableOpacity>
      </View>

      {/* Nombre de la lista */}
      <Text style={styles.label}>Nombre lista</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Mi lista de compras"
      />

      {/* Agregar producto */}
      <Text style={styles.label}>Agregar producto</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Nombre del producto"
          value={newProduct}
          onChangeText={setNewProduct}
        />
        <TouchableOpacity
          style={[styles.saveBtn, { marginLeft: 8 }]}
          onPress={() => {
            if (newProduct.trim()) {
              addProducts(newProduct.trim());
              setNewProduct('');
            }
          }}
        >
          <Text style={{ color: '#fff' }}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Productos agregados */}
      <View style={styles.listaContainer}>
        {products.map((p) => (
        <View key={p.id} style={styles.productoItem}>
          <TouchableOpacity onPress={() => changeQuantity(p.id, -1)} style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
          <Text style={styles.cantidad}>{p.quantity}</Text>
          <TouchableOpacity onPress={() => changeQuantity(p.id, 1)} style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
          <Text style={styles.productoTexto}>{p.name}</Text>
          <TouchableOpacity onPress={() => deleteProduct(p.id)} style={styles.eliminarBtn}>
            <Ionicons name="close" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      ))}
      </View>


      {/* ELEMENTOS NO FUNCIONALES */}
      {/* Sugerencias */}
      <Text style={styles.subtitulo}>Sugerencias de compras anteriores</Text>
      <View style={styles.chipsContainer}>
        {sugerenciasAnteriores.map((s, i) => (
          <TouchableOpacity key={i} style={styles.chip} onPress={() => addProducts(s)}>
            <Text>+ {s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/*buscador*/}
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


      {/*boton para iniciar compra*/}
      {mode === 'edit' && (
        <View>
          <TouchableOpacity style={styles.iniciarCompraBtn} onPress={() => navigation.navigate('Compra')}> 
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Iniciar compra</Text>
          </TouchableOpacity>
        </View>
      )}
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
  