import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { InputNumber } from 'primereact/inputnumber';
import { Chip } from 'primereact/chip';
import { Badge } from 'primereact/badge';
import { config } from "../../utils/conf";
import { useMsal } from "@azure/msal-react"; 

export default function Cart() {
    const [visible, setVisible] = useState(false);
    const [items, setItems] = useState([]);

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    console.log("ID_Usuario:", ID_Usuario);

    useEffect(() => {
      if (ID_Usuario) {
          fetch(`${config.apiBaseUrl}/getCartProducts/${ID_Usuario}`)
          .then(response => response.json())
          .then(data => {
              if (Array.isArray(data)) {  // Verificar que data es un arreglo
                  setItems(data);
                  console.log("Productos del carrito cargados", data);
              } else {
                  console.error('Error al cargar productos del carrito: data no es un arreglo', data);
                  setItems([]);  // Asegurarse de que items sea un arreglo aunque data no lo sea
              }
          })
          .catch(error => {
              console.error('Error al cargar productos del carrito:', error);
              setItems([]);  // Asegurarse de que items sea un arreglo en caso de error
          });
      }
  }, [ID_Usuario]);
  

  const handleQuantityChange = (changeType, id) => {
    setItems(items.map(item => {
        if (item.ID_Producto === id) {
            return {
                ...item,
                Cantidad: changeType === 'increase' ? item.Cantidad + 1 : item.Cantidad > 1 ? item.Cantidad - 1 : 1
            };
        }
        return item;
    }));
};

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + item.Precio * item.Cantidad, 0);
    };

    const removeItem = (id) => {
      fetch(`${config.apiBaseUrl}/removeProductFromCart`, {
          method: 'POST',  // O 'DELETE', según tu implementación en el servidor
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              ID_Usuario: ID_Usuario,  // Asegúrate de tener disponible ID_Usuario
              ID_Producto: id
          })
      })
      .then(response => response.json())
      .then(data => {
          if (data.message) {
              console.log(data.message);
              // Filtrar el producto eliminado del estado local
              setItems(items.filter(item => item.ID_Producto !== id));
          } else {
              console.error('No se pudo eliminar el producto');
          }
      })
      .catch(error => {
          console.error('Error al eliminar producto del carrito:', error);
      });
  };
  

    const handleClose = () => setVisible(false);
    const handleCheckout = () => {
        // Implementar la lógica de checkout aquí
    };

    return (
        <>
            <Button
                icon="pi pi-shopping-cart"
                onClick={() => setVisible(true)}
                className="cart-button"
                badge={items.length}
                badgeClassName="p-badge-warning"
            />
            <Sidebar
                position="right"
                visible={visible}
                onHide={handleClose}
                className="p-sidebar-md"
            >
                <h1>Tu Carrito</h1>
            {items.map((item) => (
                <div key={item.ID_Producto} className="cart-item">
                    <img src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrfm4nwgfPvbTPtTDMi8rs14qATtohrpYrarQM3iOUow&s`} alt={item.Producto} className="product-image" />
                    <div className="item-details">
                        <h4>{item.Producto}</h4>
                        <p className="item-description">{item.Descripcion}</p>
                        <div className="quantity-controls">
                            <Button icon="pi pi-minus" className="p-button-rounded p-button-secondary" onClick={() => handleQuantityChange('decrease', item.ID_Producto)} />
                            <span>{item.Cantidad}</span>
                            <Button icon="pi pi-plus" className="p-button-rounded p-button-secondary" onClick={() => handleQuantityChange('increase', item.ID_Producto)} />
                        </div>
                    </div>
                    <h5 className="item-price">${(item.Precio || 0).toFixed(2)}</h5>
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-secondary p-button-outlined remove-item-btn" onClick={() => removeItem(item.ID_Producto)} />
                </div>
            ))}
                <div className="checkout-section">
                    <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                    <Button label="Check Out" className="checkout-btn" onClick={handleCheckout} />
                    <Button label="Continue Shopping" className="p-button-text shopping-btn" onClick={handleClose} />
                </div>
            </Sidebar>
        </>
    );
}
