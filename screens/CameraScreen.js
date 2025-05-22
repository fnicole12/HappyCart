import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { connectToPhotoSocket, sendPhotoToFamily, sendVoteToFamily, closePhotoSocket } from '../utils/websocket';
import { useRoute } from '@react-navigation/native';

// Utilidad rápida para generar un id único por foto:
const uuid = () => Math.random().toString(36).slice(2) + Date.now();

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);   // Preview de tu propia foto
  const [cameraType, setCameraType] = useState('back');
  const [photoReceived, setPhotoReceived] = useState(null); // Foto que llega de otro
  const [awaitingVote, setAwaitingVote] = useState(false);  // True si yo mandé una y espero votación
  const [lastPhotoId, setLastPhotoId] = useState(null);

  const route = useRoute();
  const familyId = route.params.familyId;
  const phone = route.params.phone;

  // 1. WS: Conectar/desconectar
  useEffect(() => {
    connectToPhotoSocket(
      familyId,
      (data) => {
        // Recibes foto de otro usuario
        if (data.sender !== phone) {
          setPhotoReceived({
            photo: data.photo,
            photoId: data.photoId,
            sender: data.sender,
          });
        }
      },
      (voteData) => {
        // Recibes resultado de tu foto enviada
        if (voteData.sender === phone) {
          Alert.alert("Votación recibida", 
            `Tu foto fue ${voteData.vote === 'accepted' ? 'ACEPTADA ✅' : 'RECHAZADA ❌'} por ${voteData.voter}`);
          setAwaitingVote(false);
        }
      }
    );
    return () => closePhotoSocket();
  }, [familyId]);

  // 2. Permisos cámara
  if (!permission) {
    return <View style={styles.center}><Text>Cargando permisos...</Text></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Necesitas dar acceso a la cámara</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={{ color: '#fff' }}>Permitir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Tomar foto propia
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  // 4. Enviar foto propia
  const confirmPhoto = async () => {
    // Convierte a base64
    const base64 = await FileSystem.readAsStringAsync(photoUri, { encoding: 'base64' });
    const photoId = uuid();
    sendPhotoToFamily(base64, phone, photoId);
    setPhotoUri(null);
    setAwaitingVote(true);
    setLastPhotoId(photoId);
  };

  // 5. Aceptar/rechazar foto recibida
  const handleVote = (vote) => {
    sendVoteToFamily(photoReceived.photoId, vote, phone, photoReceived.sender);
    setPhotoReceived(null);
  };

  // 6. Cancelar preview propia
  const cancelPreview = () => setPhotoUri(null);

  // 7. UI
  // Si tienes foto recibida para votar:
  if (photoReceived) {
    return (
      <View style={styles.center}>
        <Text>Foto recibida de {photoReceived.sender}</Text>
        <Image
          source={{ uri: 'data:image/jpeg;base64,' + photoReceived.photo }}
          style={styles.preview}
          resizeMode="contain"
        />
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <TouchableOpacity style={styles.confirmBtn} onPress={() => handleVote('accepted')}>
            <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            <Text style={styles.confirmText}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => handleVote('rejected')}>
            <Ionicons name="close-circle" size={40} color="#F44336" />
            <Text style={styles.confirmText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Si acabas de mandar foto y esperas voto:
  if (awaitingVote) {
    return (
      <View style={styles.center}>
        <Ionicons name="hourglass-outline" size={50} color="#f5ac70" />
        <Text style={{color: "white"}}>Esperando respuesta de tu familia...</Text>
      </View>
    );
  }

  // Si tienes tu propia foto para enviar:
  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <TouchableOpacity style={styles.confirmBtn} onPress={confirmPhoto}>
            <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            <Text style={styles.confirmText}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelPreview}>
            <Ionicons name="close-circle" size={40} color="#F44336" />
            <Text style={styles.confirmText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Si nada, mostrar cámara
  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={cameraType}
      >
        <View style={styles.overlay}>
          <TouchableOpacity onPress={takePicture}>
            <Ionicons name="camera" size={50} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCameraType(cameraType === 'back' ? 'front' : 'back')}
            style={{ marginTop: 20 }}
          >
            <Ionicons name="camera-reverse-outline" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Mejor para preview
  },
  btn: {
    backgroundColor: '#f5ac70',
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  preview: {
    width: '90%',
    height: '70%',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    bottom: 60, // Subir un poco el overlay
    alignItems: 'center',
    zIndex: 2,
  },
  confirmBtn: {
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.85)', // Verde translúcido
    padding: 10,
    borderRadius: 30,
    flexDirection: 'row',
  },
  cancelBtn: {
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.85)', // Rojo translúcido
    padding: 10,
    borderRadius: 30,
    flexDirection: 'row',
  },
  confirmText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchCameraBtn: {
    backgroundColor: 'rgba(33,33,33,0.7)',
    padding: 10,
    borderRadius: 22,
    alignSelf: 'center',
    marginBottom: 25, // Subir el botón para que no choque con barra de navegación
    marginTop: 10,
  },
});
