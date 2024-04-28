import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import Chat from '../Chat';
import { deleteDoc, collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { useMsal } from "@azure/msal-react";
import config from "../../utils/conf";

export default function PendingToAcceptClients() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [eliminatingClient, setEliminatingClient] = useState(null);
    const [pendingClients, setPendingClients] = useState([]);
    const [acceptingClient, setAcceptingClient] = useState(null);

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const senderOID = activeAccount.idTokenClaims?.oid;

    useEffect(() => {
        const fetchPendingClients = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/pendingrequests/${senderOID}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPendingClients(data);
            } catch (error) {
                console.error('Error fetching pending clients:', error);
            }
        };
        if (senderOID) {
            fetchPendingClients();
        }
    }, [senderOID]);

    const handleRowClick = (user) => {
        if (expandedRow === user.ID_UsuarioMovil) {
            setExpandedRow(null);
            setEliminatingClient(null);
            setSelectedUser(null);
            setAcceptingClient(null);
        } else {
            setSelectedUser(user);
            setEliminatingClient(null);
            setExpandedRow(user.ID_UsuarioMovil);
            setSelectedUser(user);
        }
    };

    const handleDeleteClick = (user) => {
        if (eliminatingClient && eliminatingClient.ID_UsuarioMovil === user.ID_UsuarioMovil) {
            setEliminatingClient(null);
        } else {
            setExpandedRow(null);
            setSelectedUser(null);
            setAcceptingClient(null);
            setEliminatingClient(user);
        }
    };

    const handleAcceptClick = (user) => {
        if (acceptingClient && acceptingClient.ID_UsuarioMovil === user.ID_UsuarioMovil) {
            setAcceptingClient(null);
        } else {
            setExpandedRow(null);
            setSelectedUser(null);
            setEliminatingClient(null);
            setAcceptingClient(user);
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

    const acceptClientRequest = async (ID_Usuario_Movil) => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/acceptclienttrainer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ senderOID, ID_Usuario_Movil }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        alert("Solicitud aceptada correctamente. El cliente ha sido agregado.");
        window.location.reload();
      } catch (error) {
        console.error('Error al aceptar la solicitud:', error);
        alert("Error al aceptar la solicitud.");
      }
    };
    
    const deleteClientRequest = async (ID_Usuario_Movil) => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/deletesolicitudtrainer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ senderOID, ID_Usuario_Movil }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        alert("Solicitud eliminada correctamente.");
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar la solicitud:', error);
        alert("Error al eliminar la solicitud.");
      }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (eliminatingClient && eliminatingClient.ID_UsuarioMovil) {
            try {
                await deleteConversation(senderOID, eliminatingClient.ID_UsuarioMovil);
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
                {pendingClients.map((user) => (
                    <li key={user.ID_UsuarioMovil} className={`row ${((selectedUser && selectedUser.ID_UsuarioMovil === user.ID_UsuarioMovil) || (eliminatingClient && eliminatingClient.ID_UsuarioMovil === user.ID_UsuarioMovil) || (acceptingClient && acceptingClient.ID_UsuarioMovil === user.ID_UsuarioMovil)) ? 'selected' : ''}`}>
                        <div onClick={() => handleRowClick(user)} className={`row_header ${((selectedUser && selectedUser.ID_UsuarioMovil === user.ID_UsuarioMovil) || (eliminatingClient && eliminatingClient.ID_UsuarioMovil === user.ID_UsuarioMovil) || (acceptingClient && acceptingClient.ID_UsuarioMovil === user.ID_UsuarioMovil)) ? 'selected' : ''}`}>
                            <div className='UserCard'>
                                { user.sexo === "H" && (
                                    <div  className='icon'><i class="bi bi-person-standing"></i></div>
                                )}
                                {user.sexo === "M" &&(
                                    <div  className='icon'><i class="bi bi-person-standing-dress"></i></div>
                                )}
                                <div>
                                    <div className='row_name'>{user.nombre} {user.apellido}</div>
                                    <div className='row_description'>{user.tipo_usuario_movil}</div>
                                </div>
                            </div>
                            <div className="row_buttons">
                                <div className="row_edit">
                                    <i className={`bi bi-trash card-icon ${eliminatingClient && eliminatingClient.ID_UsuarioMovil === user.ID_UsuarioMovil ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleDeleteClick(user); }}></i>
                                </div>
                                <div className="row_edit">
                                    <i className={`bi bi-database-add card-icon ${acceptingClient && acceptingClient.ID_UsuarioMovil === user.ID_UsuarioMovil ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleAcceptClick(user); }}></i>
                                </div>
                            </div>
                        </div>
                        {expandedRow === user.ID_UsuarioMovil && (
                            <>
                                <Chat reciever={user.ID_Usuario}/>
                            </>
                        )}
                        {eliminatingClient && eliminatingClient.ID_UsuarioMovil === user.ID_UsuarioMovil && (
                            <>
                                <div className="exercise-info">
                                    <form className='form_add_exercise' onSubmit={handleSubmit}>
                                    <button type="submit" className='delete_button' onClick={() => deleteClientRequest(user.ID_UsuarioMovil)}>Eliminar solicitud de cliente pendiente</button>
                                    </form>
                                </div>
                            </>
                        )}
                        {acceptingClient && acceptingClient.ID_UsuarioMovil === user.ID_UsuarioMovil && (
                            <>
                                <div className="exercise-info">
                                <button className='add_button' onClick={() => acceptClientRequest(user.ID_UsuarioMovil)}>Aceptar solicitud y agregar a mis clientes</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
