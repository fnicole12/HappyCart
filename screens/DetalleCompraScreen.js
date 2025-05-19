import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { historialCompras } from '../data/mockData';

export default function DetalleCompraScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { compraId } = route.params;

  const compra = historialCompras.find(c => c.id === compraId);

  const total = compra.productos.reduce((acc, p) => acc + p.precio, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Ionicons name="cart" size={40} color="#f5ac70" />
      </View>

      {/*desc*/}
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitulo}>{compra.nombre}</Text>
          <Text style={styles.cardText}>{compra.supermercado}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.cardText}>{compra.fecha}</Text>
          <Text style={styles.cardText}>{compra.productos.length} productos</Text>
        </View>
      </View>

      {/*parte de arriba de la tabla*/}
      <View style={styles.tabla}>
        <View style={styles.tablaHeader}>
          <Text style={styles.col}>Cantidad</Text>
          <Text style={styles.col}>Producto</Text>
          <Text style={styles.col}>Precio</Text>
        </View>

        <ScrollView style={styles.scrollProductos}>
          {compra.productos.map((p) => (
            <View key={p.id} style={styles.fila}>
              <Text style={styles.col}>{p.cantidad}</Text>
              <Text style={styles.col}>{p.nombre}</Text>
              <Text style={styles.col}>${p.precio}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.totalRow}>
          <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
          <Text style={{ marginLeft: 'auto' }}>${total}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#eee',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    card: {
      backgroundColor: '#f5ac70',
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardTitulo: {
      fontWeight: 'bold',
      fontSize: 16,
      color: 'white',
    },
    tabla: {
      borderWidth: 1,
      borderColor: '#f5ac70',
      borderRadius: 12,
      padding: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      elevation: 2,
    },
    tablaHeader: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    fila: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    col: {
      flex: 1,
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
    cardText: {
      color: '#fff',
    },
    scrollProductos: {
      maxHeight: 400, //limitar productos mostrados sin scrolls
    },
  });
  