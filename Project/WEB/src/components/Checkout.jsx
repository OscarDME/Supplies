import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../styles/Checkout.css';
import { config } from "../utils/conf";
import { useMsal } from "@azure/msal-react"; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Toast } from 'primereact/toast';

const stripePromise = loadStripe('pk_test_51PQHcvRpTMMo5ccd9HQ7f6LgjDUAfoVX6nY1uJzjdN7wsKbz6VV4ynOVIrGGcQNu5aiX2PDhtffnAY0GuqgpU37C009is9tPIE');

const CheckoutForm = ({ total, onSubmit }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, token } = await stripe.createToken(cardElement);

        if (error) {
            console.error('Error al crear el token', error);
        } else {
            onSubmit(token);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <Button label="Confirmar Pedido" type="submit" className="p-button-success" />
        </form>
    );
};

const Checkout = () => {
    const toast = useRef(null);
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    console.log("ID_Usuario:", ID_Usuario);
    const location = useLocation();
    const { cartItems, total } = location.state || { cartItems: [], total: 0 };
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        direccion: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (token) => {
        // Datos del pedido
        const orderData = {
            ID_Usuario: ID_Usuario,
            Total: total,
            MetodoPago: token.id,
            DireccionEnvio: formData.direccion,
            NombreReceptor: formData.nombre,
            ApellidoReceptor: formData.apellido,
            productos: cartItems.map(item => ({
                ID_Producto: item.ID_Producto,
                Cantidad: item.Cantidad,
                PrecioUnitario: item.Precio
            }))
        };
        console.log(token, total);

        try {
            console.log("Entrando");
            const chargeResponse = await fetch('http://localhost:3002/charge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, amount: total * 100 }), // Monto en centavos
            });

            if (chargeResponse.ok) {
                console.log('Pago realizado:', await chargeResponse.json());

                // Llamada al backend para crear el pedido
                const orderResponse = await fetch(`${config.apiBaseUrl}/createOrder`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                if (orderResponse.ok) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Pedido realizado',
                        detail: 'Tu pedido ha sido procesado con éxito.',
                        life: 3000
                    });
                    const { ID_Pedido } = await orderResponse.json();
                    // Ahora añadir cada producto al pedido
                    for (const item of cartItems) {
                        await fetch(`${config.apiBaseUrl}/addProductToOrder`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ID_Pedido: ID_Pedido,
                                ID_Producto: item.ID_Producto,
                                Cantidad: item.Cantidad,
                                PrecioUnitario: item.Precio
                            })
                        });
                    }
                    navigate('/products'); // Redirigir a productos después de crear el pedido
                } else {
                    console.error('Error al crear el pedido');
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error al crear el pedido',
                        detail: 'Ha ocurrido un error al crear tu pedido. Por favor, inténtalo de nuevo.',
                        life: 3000
                    });                }
            } else {
                console.error('Error al procesar el pago:', await chargeResponse.json());
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error al crear el pedido',
                        detail: 'Ha ocurrido un error al crear tu pedido. Por favor, inténtalo de nuevo.',
                        life: 3000
                    }); 
            }
        } catch (error) {
            console.error('Error al enviar el pago al servidor:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error al crear el pedido',
                        detail: 'Ha ocurrido un error al crear tu pedido. Por favor, inténtalo de nuevo.',
                        life: 3000
                    }); 
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <div className="checkout-form">
                    <h1>Información de Envío</h1>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="apellido">Apellido</label>
                            <InputText id="apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="direccion">Dirección</label>
                            <InputText id="direccion" type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                        </div>
                        <label htmlFor="nombre">Datos de pago</label>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm total={total} onSubmit={handleSubmit} />
                        </Elements>
                    </div>
                </div>
                <div className="cart-summary">
                    <h2>Resumen del Pedido</h2>
                    {cartItems.map(item => (
                        <div key={item.ID_Producto} className="cart-item-summary">
                            <span>{item.Producto} - {item.Cantidad} x ${item.Precio.toFixed(2)}</span>
                        </div>
                    ))}
                    <span>Total: ${total.toFixed(2)}</span>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
};

export default Checkout;