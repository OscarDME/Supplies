import React, { useState, useEffect } from 'react';
import { deleteDoc, collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import Chat from '../Chat';
import { useMsal } from "@azure/msal-react";
import config from "../../utils/conf";

export default function MyClients() {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [eliminatingClient, setEliminatingClient] = useState(null);
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const senderId = activeAccount.idTokenClaims?.oid; // Acceder a idTokenClaims de manera segura

    useEffect(() => {
      const fetchClients = async () => {
          if (!activeAccount) return; // Verificar si activeAccount está definido
          const senderOID = activeAccount.idTokenClaims?.oid; // Acceder a idTokenClaims de manera segura
          console.log("Sender OID:", senderOID); // Agregar un console.log para verificar el OID del remitente
          try {
              const response = await fetch(`${config.apiBaseUrl}/allClients/${senderOID}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
  
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
  
              const data = await response.json();
              console.log(data);
              setClients(data);
          } catch (error) {
              console.error('There was an error fetching the clients:', error);
          }
      };
  
      fetchClients();
  }, []); // <- Array vacío indica que el efecto se ejecutará solo una vez
  

    const filteredClients = clients.filter(client =>
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (client) => {
        if (expandedRow === client.ID_Usuario) {
            setExpandedRow(null);
            setEliminatingClient(null);
            setSelectedClient(null);
        } else {
            if (eliminatingClient && eliminatingClient.ID_Usuario === client.ID_Usuario) {
                setEliminatingClient(null);
                setEliminatingClient(null);
            }
            setSelectedClient(client);
            setEliminatingClient(null);
            setExpandedRow(client.ID_Usuario);
            setSelectedClient(client);
        }
    };

    const handleDeleteClick = (client) => {
        if (eliminatingClient && eliminatingClient.ID_Usuario === client.ID_Usuario) {
            setEliminatingClient(null);
        } else {
            if (expandedRow && expandedRow !== client.ID_Usuario) {
                setExpandedRow(null);
                setSelectedClient(null);
                setEliminatingClient(null);
            }
            setExpandedRow(null);
            setSelectedClient(null);
            setEliminatingClient(client); 
        }
    };

    const handleDeleteClientFromTrainer = async (clientId) => {
      // Asegúrate de reemplazar `apiBaseUrl` y la ruta específica según tu configuración
      const senderOID = activeAccount.idTokenClaims?.oid; // OID del entrenador/nutricionista
  
      try {
          const response = await fetch(`${config.apiBaseUrl}/deleteClientFromTrainer`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  clientUserID: clientId, // El ID del cliente a eliminar
                  trainerUserID: senderOID, // El ID del entrenador/nutricionista
              }),
          });
  
          if (!response.ok) {
              throw new Error('Failed to delete the client from the trainer');
          }
  
          const result = await response.json();
          console.log(result.message);
  
          // Actualiza la lista de clientes después de la eliminación
          setClients(clients.filter(client => client.ID_Usuario !== clientId));
      } catch (error) {
          console.error('Error deleting the client from the trainer:', error);
      }
  };
  
  
  

    const deleteConversation = async (senderId, eliminatingClientId) => {
        const db = getFirestore();
        const conversationsRef = collection(db, "conversations");
    
        try {
            const querySender = query(conversationsRef, where("participants", "array-contains", senderId));
            const senderSnapshot = await getDocs(querySender);
    
            const queryEliminatingClient = query(conversationsRef, where("participants", "array-contains", eliminatingClientId));
            const eliminatingClientSnapshot = await getDocs(queryEliminatingClient);
    
            const conversationsToDelete = [];
            senderSnapshot.forEach((doc) => {
                if (eliminatingClientSnapshot.docs.some(eliminatingClientDoc => eliminatingClientDoc.id === doc.id)) {
                    conversationsToDelete.push(doc.ref);
                }
            });
    
            conversationsToDelete.forEach(async (conversationRef) => {
                await deleteDoc(conversationRef);
                console.log("Conversation deleted:", conversationRef.id);
            });
    
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };
    
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (eliminatingClient && eliminatingClient.ID_Usuario) {
            try {
                await deleteConversation(senderId, eliminatingClient.ID_Usuario);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting conversation:", error);
            }
        } else {
            console.error("No valid client selected to delete the conversation.");
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
                {filteredClients.map((client) => (
                    <li key={client.ID_Usuario} className={`row ${((selectedClient && selectedClient.ID_Usuario === client.ID_Usuario) || (eliminatingClient && eliminatingClient.ID_Usuario === client.ID_Usuario)) ? 'selected' : ''}`}>
                        <div onClick={() => handleRowClick(client)} className={`row_header ${((selectedClient && selectedClient.ID_Usuario === client.ID_Usuario) || (eliminatingClient && eliminatingClient.ID_Usuario === client.ID_Usuario)) ? 'selected' : ''}`}>
                            <div className='UserCard'>
                                { client.sexo === "H" && (
                                    <div  className='icon'><i class="bi bi-person-standing"></i></div>
                                )}
                                {client.sexo === "M" &&(
                                    <div  className='icon'><i class="bi bi-person-standing-dress"></i></div>
                                )}
                                <div>
                                    <div className='row_name'>{client.nombre} {client.apellido}</div>
                                    <div className='row_description'>{client.tipo_usuario_movil}</div>
                                </div>
                            </div>
                            <div className="row_edit">
                                <i className={`bi bi-trash card-icon ${eliminatingClient && eliminatingClient.ID_Usuario === client.ID_Usuario ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleDeleteClick(client); }}></i>
                            </div>
                        </div>
                        {expandedRow === client.ID_Usuario && (
                            <>
                                <Chat reciever={client.ID_Usuario}/>
                            </>
                        )}
                        {eliminatingClient && eliminatingClient.ID_Usuario === client.ID_Usuario && (
                            <>
                                <div className="exercise-info">
  <form onSubmit={(e) => e.preventDefault()}>
      <button type="button" onClick={() => handleDeleteClientFromTrainer(eliminatingClient.ID_Usuario)} className='delete_button'>Eliminar Cliente</button>
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
