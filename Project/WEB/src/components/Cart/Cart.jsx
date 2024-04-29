import React, {useState, useEffect} from 'react'
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { InputNumber } from 'primereact/inputnumber';
import {Chip} from 'primereact/chip';
import {Badge} from 'primereact/badge';
import {data } from '../../components/DATA_PRODUCTS';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Asegúrate de tener el tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // y estos estilos básicos
import 'primeicons/primeicons.css'; // y los íconos

export default function Cart() {
    const [visible, setVisible] = useState(false);
    const [quantity, setQuantity] = useState();
    const [items, setItems] = useState(data);
  
    const handleClose = () => setVisible(false);
    const handleCheckout = () => {
    };
    const handleQuantityChange = (e, id) => {
      };
      
    const calculateTotal = () => {
      return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };
    const removeItem = (event, item) => {
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
              <div key={item.id} className="cart-item">
                <img src={`https://primefaces.org/cdn/primereact/images/product/${item.image}`} alt={item.name} className="product-image" />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-description">{item.description}</p>
                  <div className="quantity-controls">
                    <Button icon="pi pi-minus" className="p-button-rounded p-button-secondary" onClick={() => handleQuantityChange('decrease', item.id)} />
                    <span>{item.quantity}</span>
                    <Button icon="pi pi-plus" className="p-button-rounded p-button-secondary" onClick={() => handleQuantityChange('increase', item.id)} />
                  </div>
                </div>
                <h5 className="item-price">${item.price.toFixed(2)}</h5>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-secondary p-button-outlined remove-item-btn" onClick={() => removeItem(item.id)} />
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
