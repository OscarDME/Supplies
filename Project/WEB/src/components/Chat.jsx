import React, { useCallback, useState, useEffect, useRef } from 'react';
import '../styles/chat.css';
import { getFirestore, collection, query, where, getDocs, addDoc, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore"; 
import { useMsal } from "@azure/msal-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Image } from 'primereact/image';

export default function Chat({ reciever }) {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const sender = activeAccount.idTokenClaims.oid; // OID del usuario actual
  const [message, setMessage] = useState(''); // Almacenará los mensajes de la conversación
  const [messages, setMessages] = useState([]); // Almacenará los mensajes de la conversación
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);


  const db = getFirestore();

  console.log("reciever " + reciever);
  console.log("sender "+ sender);

  
  const uploadFiles = async (files) => {
    const storage = getStorage();
    files.forEach(async (file) => {
      const storageRef = ref(storage, 'chat-files/' + file.name);
      await uploadBytes(storageRef, file).then(snapshot => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          sendMessageWithFile(downloadURL, file.type);
        });
      });
    });
  };

  const sendMessageWithFile = async (fileUrl, fileType) => {
    const messagesRef = collection(db, "conversaciones", conversationId, "mensajes");
    await addDoc(messagesRef, {
      fileUrl,
      fileType: fileType === "application/pdf" ? "application/pdf" : "image/jpeg",
      enviadoPor: sender,
      enviadoEn: new Date(),
    });
  };
  

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => {
      if (file.type === "image/jpeg" && file.size <= 3000000) return true;
      if (file.type === "application/pdf" && file.size <= 50000000) return true;
      return false;
    });
    if (files.length > 0) {
      uploadFiles(files);
    }
  };
  


  useEffect(() => {
    let unsubscribe = () => {}; // Función para desuscribirse del listener

    const fetchConversationAndSubscribeToMessages = async () => {
      const conversationsRef = collection(db, "conversaciones");
      const q = query(conversationsRef, where("participantes", "array-contains", sender));

      // Busca la conversación una vez para obtener el ID
      const conversationsSnapshot = await getDocs(q);
      conversationsSnapshot.forEach((doc) => {
        if (doc.data().participantes.includes(reciever)) {
          const conversationId = doc.id;
          setConversationId(doc.id);
          
          // Una vez encontrada la conversación, suscríbete a los cambios en los mensajes
          const messagesRef = collection(db, "conversaciones", conversationId, "mensajes");
          const messagesQuery = query(messagesRef, orderBy("enviadoEn", "desc"));
          
          unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              enviadoEn: doc.data().enviadoEn.toDate(), // Convertir Timestamp a Date
            }));
            setMessages(fetchedMessages);
          });
        }
      });
    };

    fetchConversationAndSubscribeToMessages();

    // Función de limpieza para desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, [reciever, sender, db]);

  const sendMessage = async (e) => {
    e.preventDefault(); // Prevenir la recarga de la página
  
    // Verificar que el mensaje no esté vacío y que exista conversationId
    if (message.trim() === '' || !conversationId) return;
  
    // Referencia a la colección de mensajes dentro de la conversación actual
    const messagesRef = collection(db, "conversaciones", conversationId, "mensajes");
  
    // Obtener el documento de la conversación y actualizar modificadoEn
    const conversationRef = doc(db, "conversaciones", conversationId);
    await updateDoc(conversationRef, {
      modificadoEn: new Date(),
    });
  
    // Agregar el nuevo mensaje a Firestore
    await addDoc(messagesRef, {
      texto: message,
      enviadoPor: sender,
      enviadoEn: new Date(), // Firestore captura la fecha actual
    });
  
    // Limpiar el input después de enviar
    setMessage('');
  };
  
  

  // Otros métodos y el JSX siguen aquí
  return (
    <>
      <div className='chat-container'
        onDragOver={handleDragOver} 
        onDrop={handleDrop}
      >
      <div className='messages-container'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-container ${message.enviadoPor === sender ? 'message-sender' : 'message-receiver'}`}
          >
            <div className={`message ${message.enviadoPor === sender ? 'message-sender-color' : 'message-receiver-color'}`}>
              {/* Verificar si el mensaje contiene texto */}
              {message.texto && <div>{message.texto}</div>}

              {/* Verificar si el mensaje tiene un archivo y renderizar según el tipo */}
              {message.fileUrl && (
                message.fileType === 'image/jpeg' ? (
                  <Image src={message.fileUrl} alt="Enviado"  width='150px'  preview />
                ) : (
                  <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">Abrir PDF</a>
                )
              )}

              <div className='message-date'>{message.enviadoEn.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
        <div className='input-chat-bar'>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='input-chat'
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
            placeholder="Ingrese un mensaje y presione Enter o arrastre y suelte un archivo ..."
          ></input>
        </div>
      </div>
    </>
  );
}
