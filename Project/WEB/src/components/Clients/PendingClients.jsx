import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import Chat from '../Chat';
import { deleteDoc, collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { useMsal } from "@azure/msal-react";
import config from "../../utils/conf";

export default function PendingClients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [eliminatingClient, setEliminatingClient] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const sender = activeAccount.idTokenClaims.oid; // OID del usuario actual

  useEffect(() => {
      const fetchPendingRequests = async () => {
          try {
              const response = await fetch(`${config.apiBaseUrl}/pendingclients`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ sender })
              });

              if (!response.ok) {
                  throw new Error("Respuesta de red no fue ok");
              }

              const data = await response.json();
              console.log(data);
              setPendingRequests(data);
          } catch (error) {
              console.error("Error al obtener las solicitudes pendientes:", error);
          }
      };

      fetchPendingRequests();
  }, [sender]);

  const handleRowClick = (user) => {
    console.log("id:",user.id)
      if (expandedRow === user.id) {
          setExpandedRow(null);
          setEliminatingClient(null);
          setSelectedUser(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
          if (eliminatingClient && eliminatingClient.id === user.id) {
              setEliminatingClient(null);
              setEliminatingClient(null);
          }
          setEliminatingClient(null);
          setExpandedRow(user.id);
          setSelectedUser(user); // Selecciona la fila al hacer clic
      }
  };

  const handleDeleteClick = (user) => {
      if (eliminatingClient && eliminatingClient.id === user.id) {
          setEliminatingClient(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
      } else {
          if (expandedRow && expandedRow !== user.id) {
              setExpandedRow(null); 
              setSelectedUser(null);
              setEliminatingClient(null);
          }
          setExpandedRow(null);
          setSelectedUser(null);
          setEliminatingClient(user);
      }
  };

  const deleteConversation = async (sender, eliminatingClientId) => {
      const db = getFirestore();
      const conversationsRef = collection(db, "conversaciones");

      try {
          // Consulta para buscar las conversaciones que contienen al sender
          const querySender = query(conversationsRef, where("participantes", "array-contains", sender));
          const senderSnapshot = await getDocs(querySender);

          // Consulta para buscar las conversaciones que contienen al eliminatingClient
          const queryEliminatingClient = query(conversationsRef, where("participantes", "array-contains", eliminatingClientId));
          const eliminatingClientSnapshot = await getDocs(queryEliminatingClient);

          // Obtiene las conversaciones que cumplen ambas condiciones
          const conversationsToDelete = [];
          senderSnapshot.forEach((doc) => {
              if (eliminatingClientSnapshot.docs.some(eliminatingClientDoc => eliminatingClientDoc.id === doc.id)) {
                  conversationsToDelete.push(doc.ref);
              }
          });

          // Elimina las conversaciones encontradas
          conversationsToDelete.forEach(async (conversationRef) => {
              await deleteDoc(conversationRef);
              console.log("Conversación eliminada:", conversationRef.id);
          });

      } catch (error) {
          console.error("Error al eliminar la conversación:", error);
      }
  };

  const deleteTrainerClientRequest = async (sender, eliminatingClientId) => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/deleteolicitud`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sender, eliminatingClientId })
        });

        if (!response.ok) {
            throw new Error("Respuesta de red no fue ok");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error al eliminar la solicitud de entrenador a cliente:", error);
        throw error;
    }
};


const handleSubmit = async (event) => {
  event.preventDefault();

  if (eliminatingClient && eliminatingClient.id) {
      try {
          // Elimina la solicitud de entrenador a cliente
          await deleteTrainerClientRequest(sender, eliminatingClient.id);

          // Elimina la conversación entre el sender y el cliente seleccionado
          await deleteConversation(sender, eliminatingClient.id);

          window.location.reload();
      } catch (error) {
          console.error("Error al eliminar la solicitud de entrenador a cliente o la conversación:", error);
      }
  } else {
      console.error("No se seleccionó un cliente válido para eliminar la solicitud de entrenador a cliente.");
  }
};


  return (
      <div className="container2">
          <div className="search-bar-container2">
              <div className='search-bar'>
                  <div className='addclient'><i className="bi bi-search h4"></i></div>
                  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
          </div>
          <ul className='cardcontainer'>
              {pendingRequests.map((request) => (
                  <li key={request.ID_Usuario} className={`row ${((selectedUser && selectedUser.id === request.ID_Usuario) || (eliminatingClient && eliminatingClient.id === request.ID_Usuario)) ? 'selected' : ''}`}>
                      <div onClick={() => handleRowClick({ id: request.ID_Usuario })} className={`row_header ${((selectedUser && selectedUser.id === request.ID_Usuario) || (eliminatingClient && eliminatingClient.id === request.ID_Usuario)) ? 'selected' : ''}`}>
                          <div className='UserCard'>
                              {request.sexo === "M" && (
                                  <div className='icon'><i className="bi bi-person-standing-dress"></i></div>
                              )}
                              {request.sexo === "H" && (
                                  <div className='icon'><i className="bi bi-person-standing"></i></div>
                              )}
                              <div>
                                  <div className='row_name'>{request.nombre}</div>
                                  <div className='row_description'>{request.tipo_usuario_movil}</div>
                              </div>
                          </div>
                          <div className="row_edit">
                              <i className={`bi bi-trash card-icon ${eliminatingClient && eliminatingClient.id === request.ID_Usuario ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleDeleteClick({ id: request.ID_Usuario }); }}></i>
                          </div>
                      </div>
                      {expandedRow === request.ID_Usuario && (
                          <>
                              <>
                                  <Chat reciever={request.ID_Usuario} />
                              </>
                          </>
                      )}
                      {eliminatingClient && eliminatingClient.id === request.ID_Usuario && (
                          <>
                              <div className="exercise-info">
                                  <form className='form_add_exercise' onSubmit={handleSubmit}>
                                      <button type="submit" className='delete_button'>Eliminar solicitud de cliente pendiente</button>
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

