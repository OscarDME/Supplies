import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { config } from "../utils/conf";
import { useMsal } from "@azure/msal-react"; 
import "../styles/Pedidos.css"; // Asegúrate de crear este archivo CSS

export const Pedidos = () => {
    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/getPedidos/${ID_Usuario}`);
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setPedidos(data);
            } else {
                console.error('Data received is not an array:', data);
                setPedidos([]); 
            }
        } catch (error) {
            console.error('Error fetching pedidos:', error);
            setPedidos([]);
        }
    };
    

    const cancelarPedido = async (ID_Pedido) => {
        const response = await fetch(`${config.apiBaseUrl}/cancelOrder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ID_Pedido })
        });
        if (response.ok) {
            fetchPedidos();
        } else {
            console.error('Error al cancelar el pedido');
        }
    };

    return (
        <div className="pedidos-container">
            <h1>Pedidos</h1>
            <div className="pedidos-list">
                {pedidos.map((pedido) => (
                    <div key={pedido.ID_Pedido} className="pedido-card">
                        <div className="pedido-info">
                            <p><strong>ID:</strong> {pedido.ID_Pedido}</p>
                            <p><strong>Estado:</strong> {pedido.EstadoPedido}</p>
                            <p><strong>Total:</strong> ${pedido.Total.toFixed(2)}</p>
                        </div>
                        <Button label="Cancelar Pedido" className="p-button-danger" onClick={() => cancelarPedido(pedido.ID_Pedido)} disabled={pedido.EstadoPedido !== 'Pendiente'} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pedidos;
