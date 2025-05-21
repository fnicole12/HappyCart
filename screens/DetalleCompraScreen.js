import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
//import { historialCompras } from '../data/mockData';

export default function DetalleCompraScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const purchase = route.params.purchase;

  const total = purchase.total.toFixed(2);
  const date = new Date(purchase.date);
  const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;

  

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Ionicons name="cart" size={40} color="#f5ac70" />
      </View>

      {/* Card resumen */}
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitulo}>{purchase.title}</Text>
          <Text style={styles.cardText}>{purchase.supermarket}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.cardText}>{dateString}</Text>
          <Text style={styles.cardText}>{purchase.products.length} productos</Text>
        </View>
      </View>

      {/* Tabla */}
      <View style={styles.tabla}>
        <View style={styles.tablaHeader}>
          <Text style={styles.col}>Cantidad</Text>
          <Text style={styles.col}>Producto</Text>
          <Text style={styles.col}>Precio</Text>
        </View>

        <ScrollView style={styles.scrollProductos}>
          {purchase.products.map((p) => (
            <View key={p.id} style={styles.fila}>
              <Text style={styles.col}>{p.quantity}</Text>
              <Text style={styles.col}>{p.name}</Text>
              <Text style={styles.col}>${p.price}</Text>
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
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
    color: '#fff',
  },
  cardText: {
    color: '#fff',
  },
  tabla: {
    borderWidth: 1,
    borderColor: '#f5ac70',
    borderRadius: 12,
    padding: 10,
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
  totalRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  scrollProductos: {
    maxHeight: 400,
  },
});