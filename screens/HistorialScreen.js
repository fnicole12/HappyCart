import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { historialCompras } from '../data/mockData';

export default function HistorialScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.titulo}>Historial de compras</Text>

      <FlatList
        data={historialCompras}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity
        onPress={() => navigation.navigate('DetalleCompra', { compraId: item.id })}>
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitulo}>{item.nombre}</Text>
              <Text style={styles.cardText}>{item.supermercado}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardText}>{item.fecha}</Text>
              <Text style={styles.cardText}>TOTAL: ${item.total}</Text>
              <Ionicons name="reorder-three-outline" size={20} color="white" />
            </View>
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
      color: '#fff',
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
  
