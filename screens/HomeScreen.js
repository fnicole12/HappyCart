import { useEffect, useState, useCallback} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { URL } from './constants';


export default function HomeScreen( { route }) {
  const navigation = useNavigation();

  const [familyId, setFamilyId] = useState('');
  const [phone, setPhone] = useState('');
  const [lists, setLists] = useState([]);
  const [showCode, setShowCode] = useState(false);


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

  //unirte a otra familia
  const handleJoinFamily = async () => {
    try{
      URL_JOIN = URL + "/join";
      const response = await fetch(URL_JOIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyId: familyId,
          phone: phone,
        }),
      })
      data = await response.json();
      if(response.ok){
        alert("Unido a la familia.");
        console.log("Nuevo familyID: ", familyId);
        navigation.navigate('HomeScreen', { user: { familyId, phone } });
      }
      else{
        alert(data.detail || "Error al unirse a la familia");
      }
    }catch(error){
      console.log(error);
      alert('No se pudo conectar al servidor');
    }
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
          {/* Crear nueva lista */}
          <TouchableOpacity style={styles.opcion} onPress={() => navigation.navigate('ListaDetalles', {mode: 'new',familyId: familyId,phone: phone,})}>
            <Ionicons name="clipboard-outline" size={24} color="white" />
            <Text style={styles.opcionTexto}>Nueva lista de mandado</Text>
          </TouchableOpacity>
        
          {/* Unirse a nueva familia */}
          {/*<View style={styles.filaUnir}>*/}
          <TouchableOpacity style={styles.opcion} onPress={() => setShowCode(!showCode)}>
            <Ionicons name="people-outline" size={24} color="white" />
            <Text style={styles.opcionTexto}>Unirte a familia</Text>
          </TouchableOpacity>

          {/* Historial */}
          <TouchableOpacity style={styles.opcion} onPress={() => navigation.navigate('HistorialScreen', {user:{ familyId: familyId, phone: phone }})}>
            <Ionicons name="calendar-outline" size={24} color="white" />
            <Text style={styles.opcionTexto}>Ver compras anteriores</Text>
          </TouchableOpacity>
        </View>
          {showCode && (
            <View style={styles.codigoGroup}>
              <TextInput
                style={styles.codigoInput}
                placeholder="Código"
                value={familyId}
                onChangeText={setFamilyId}
              />
              <TouchableOpacity style={styles.confirmarBtn} onPress={handleJoinFamily}>
                <Text style={styles.confirmarTexto}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
        {/*</View>*/}
      </View>

     {/* Listas activas */}
      <View style={{ flex: 1, marginBottom: 130 }}>
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

      <View style={styles.footer} >
      <TouchableOpacity style={styles.opcion} onPress={() => navigation.navigate('CameraScreen', { familyId, phone })}>
            <Ionicons name="camera" size={24} padding = {10} color="#f5ac70" backgroundColor= 'white' borderRadius = {40}/>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
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
    marginHorizontal: 10,
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
    //flexDirection: 'column',
    alignItems: 'center',
    gap: 10, //codigo y confirmar demasiado juntos
  },
  filaUnir: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  footer: {
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#f5ac70',
    //justifyContent: 'center',
    height: 105,
    alignItems: 'center',
},
});
