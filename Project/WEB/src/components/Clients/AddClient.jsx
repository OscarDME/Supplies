import React, { useState, useEffect } from 'react';
import { addDoc, collection, getFirestore, serverTimestamp, updateDoc, doc, query, where, getDocs } from "firebase/firestore";
import { UserCard } from "../DATA_USER_CARD";
import SearchBar from "../SearchBar";
import "../../styles/Management.css";
import { useMsal } from "@azure/msal-react";
import config from "../../utils/conf";

export default function AddClient() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [addClient, setAddClient] = useState(null);
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [users, setUsers] = useState([]);


    const sender = activeAccount.idTokenClaims.oid; // OID del usuario actual

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/mobileuser`); // Ajusta esto a la ruta correcta de tu API
          if (!response.ok) {
            throw new Error("Respuesta de red no fue ok");
          }
          const data = await response.json();
          console.log(data);
          setUsers(data); // Actualiza el estado con los datos de los usuarios
        } catch (error) {
          console.error("Error al obtener los usuarios:", error);
        }
      };
  
      fetchUsers();
    }, []);
    
    const filteredUsers = users.filter(user =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (user) => {
      if (expandedRow === user.ID_Usuario) {
        setExpandedRow(null);
        setAddClient(null);
        setSelectedUser(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (addClient && addClient.ID_Usuario === user.ID_Usuario) {
          setAddClient(null);
        }
        setAddClient(null);
        setExpandedRow(user.ID_Usuario);
        setSelectedUser(user); // Selecciona la fila al hacer clic
      }
    };


    const handleAddClick = (user) => {
      if (addClient && addClient.ID_Usuario === user.ID_Usuario) {
        setAddClient(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== user.ID_Usuario) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedUser(null);
          setAddClient(null);
        }
        setExpandedRow(null);
        setSelectedUser(null);
        setAddClient(user); 
      }
    };

    const checkIfRequestAlreadyExists = async (senderId, receiverId) => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/checkpendingrequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderOID: senderId,
            receiverID: receiverId,
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result.exists; // Asume que la API devuelve un objeto con una propiedad 'exists' que es un booleano
      } catch (error) {
        console.error('Error checking for existing request:', error);
        return false; // En caso de error, supone que no existe una solicitud para no bloquear la creación
      }
    };
    

    const createConversation = async (sender, receiver) => {
      const db = getFirestore();
      const conversationsRef = collection(db, "conversaciones");
    
      // Consulta para buscar conversaciones en las que participa el sender
      const q = query(conversationsRef, where("participantes", "array-contains", sender));
    
      // Ejecuta la consulta
      const querySnapshot = await getDocs(q);
    
      // Verifica si alguna conversación contiene al receiver como participante
      const existingConversation = querySnapshot.docs.find(doc => doc.data().participantes.includes(receiver));
    
      // Si ya existe una conversación, imprime un mensaje y retorna
      if (existingConversation) {
        console.log("Ya existe una conversación entre los participantes.");
        return;
      }
    
      // Si no existe una conversación, crea una nueva
      const conversationDocRef = await addDoc(conversationsRef, {
        creadoEn: serverTimestamp(), // Timestamp del momento de creación
        modificadoEn: serverTimestamp(), // Timestamp del momento de modificación
        participantes: [sender, receiver], // Array con los ID de los participantes
      });
    
      console.log("Nueva conversación creada:", conversationDocRef.id);
    };
    

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      if (!sender || !addClient || !addClient.ID_Usuario) {
        console.error("Datos de usuario inválidos.");
        return;
      }
    
      // Verifica primero si ya existe una solicitud pendiente
      const requestExists = await checkIfRequestAlreadyExists(sender, addClient.ID_Usuario);
      if (requestExists) {
        alert("Ya existe una solicitud pendiente entre ustedes. Por favor, espera a que el otro usuario responda.");
        return; // Detiene la ejecución si ya existe una solicitud pendiente
      }
      console.log("No existe una solicitud pendiente.");

      try {
        // Si no existe una solicitud pendiente, procede a crear la conversación y enviar la solicitud
        await createConversation(sender, addClient.ID_Usuario);
    
        const response = await fetch(`${config.apiBaseUrl}/solicitud`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: sender,
            receiver: addClient.ID_Usuario,
          }),
        });
    
        if (!response.ok) {
          throw new Error("Error al enviar la solicitud.");
        }
    
        // Recargar la página después de enviar la solicitud
        window.location.reload();
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
      }
    };
    
    

    return (
      <div className="container2">
          <div className="search-bar-container2">
            <div className='search-bar'>
            <div className='addclient card-icon'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>
          <ul className='cardcontainer'>
            {filteredUsers.map((user) => (
              <li key={user.ID_Usuario} className={`row ${((selectedUser && selectedUser.ID_Usuario === user.ID_Usuario) || (addClient && addClient.ID_Usuario === user.ID_Usuario)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(user)} className={`row_header ${((selectedUser && selectedUser.ID_Usuario === user.ID_Usuario) || (addClient && addClient.ID_Usuario === user.ID_Usuario)) ? 'selected' : ''}`}>
                <div className='UserCard'>
                              {user.sexo === "M" && (
                                  <div className='icon'><i className="bi bi-person-standing-dress"></i></div>
                              )}
                              {user.sexo === "H" && (
                                  <div className='icon'><i className="bi bi-person-standing"></i></div>
                              )}
                              <div>
                                  <div className='row_name'>{user.nombre}</div>
                                  <div className='row_description'>{user.tipo_descripcion}</div>
                              </div>
                          </div>
                    <div className="row_edit">
                      <i className={`bi bi-plus-circle-fill card-icon ${addClient && addClient.ID_Usuario === user.ID_Usuario ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleAddClick(user); }}></i>
                    </div>
                </div>
                {expandedRow === user.ID_Usuario && (
                <>
                    <>
                    <div className="exercise-info">
                      No puede acceder al chat si no manda una solicitud a {user.nombre} primero
                    </div>
                    </>
                </>
                )}
                {addClient && addClient.ID_Usuario === user.ID_Usuario && (
                  <>
                  <div className="exercise-info">
                  <form className='form_add_exercise' onSubmit={handleSubmit}>
                    <button type="submit" className='add_button'>Mandar solicitud a {user.nombre}</button>
                  </form>
                  </div>
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
