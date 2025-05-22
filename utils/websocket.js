import { URL } from "../screens/constants";
let socket = null;
let onPhotoReceived = null;
let onVoteReceived = null;

export function connectToPhotoSocket(familyId, onReceivePhoto, onReceiveVote) {
  if (socket) socket.close();

  const backendHost = URL.replace(/^https?:\/\//, '');
  socket = new WebSocket(`ws://${backendHost}/ws/photos/${familyId}`);
  onPhotoReceived = onReceivePhoto;
  onVoteReceived = onReceiveVote;

  socket.onopen = () => {
    console.log("Conectado a WebSocket de fotos");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.photo && onPhotoReceived) {
        onPhotoReceived(data);
      }
      if (data.vote && onVoteReceived) {
        onVoteReceived(data);
      }
    } catch (error) {
      console.log("Error al parsear mensaje WS:", error);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket cerrado");
  };

  socket.onerror = (error) => {
    console.log("WebSocket error", error);
  };
}

export function sendPhotoToFamily(photoBase64, sender, photoId) {
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify({ photo: photoBase64, sender, photoId }));
  } else {
    alert("WebSocket no conectado");
  }
}

export function sendVoteToFamily(photoId, vote, voter, sender) {
  // vote: "accepted" o "rejected"
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify({ vote, photoId, voter, sender }));
  } else {
    alert("WebSocket no conectado");
  }
}

export function closePhotoSocket() {
  if (socket) socket.close();
}