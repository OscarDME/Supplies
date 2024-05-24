import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { config } from "../utils/conf";
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast'; 
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "../styles/Products.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { useMsal } from "@azure/msal-react"; 


export const Products = () => { 
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]); 


    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    const toast = useRef(null); 


    const getSeverity = (product) => {
        if (product.Stock) {
            return 'success'; 
        } else {
            return 'danger';
        }
    }

    const addToCart = (productId) => {
        if (isProductInCart(productId)) {
            toast.current.show({ severity: 'warn', summary: 'Producto ya en el carrito', detail: 'Ya has añadido este producto al carrito.', life: 3000 });
            return;
        }
    
        fetch(`${config.apiBaseUrl}/addProductToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ID_Usuario: ID_Usuario,
                ID_Producto: productId
            })
        })
        .then(response => {
            if (response.ok) {  // Si el estado HTTP es 200-299 (éxito)
                updateCart(productId);
                window.location.reload();
                return response.json().then(data => toast.current.show({ severity: 'success', summary: 'Añadido al carrito', detail: data.message, life: 3000 }));
            } else if (response.status === 400) {
                return response.json().then(data => toast.current.show({ severity: 'error', summary: 'Error al añadir', detail: data.message, life: 3000 }));
            } else {
                throw new Error('Unexpected error occurred');
            }
        })
        .catch(error => {
            console.error('Error al añadir producto al carrito:', error);
            toast.current.show({ severity: 'error', summary: 'Error al añadir', detail: 'No se pudo añadir el producto al carrito debido a un error interno.', life: 3000 });
        });
    };      
    
    const updateCart = (productId) => {
        setCart(prevCart => {
            const productSet = new Set([...prevCart, productId]);
            return [...productSet];
        });
    }
    
    const isProductInCart = (productId) => {
        return cart.includes(productId);
    };

    const itemTemplate = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrfm4nwgfPvbTPtTDMi8rs14qATtohrpYrarQM3iOUow&s`} alt={data.Producto} />
                    <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
                        <div className="flex flex-column align-items-center lg:align-items-start gap-3">
                            <div className="flex flex-column gap-1">
                                <div className="text-2xl font-bold text-900">{data.Producto}</div>
                                <div className="text-700">{data.Descripcion}</div>
                            </div>
                            <div className="flex flex-column gap-2">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag product-category-icon"></i>
                                    <span className="font-semibold">{data.Tipo}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row lg:flex-column align-items-center lg:align-items-end gap-4 lg:gap-2">
                            <span className="text-2xl font-semibold">${data.Precio}</span>
                            <Button icon="pi pi-shopping-cart" label="Añadir al carrito" disabled={!data.Stock} onClick={() => addToCart(data.ID_Producto)}></Button>
                            <Tag value={data.Stock ? 'En Stock' : 'Sin Stock'} severity={getSeverity(data)}></Tag>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getAllProducts`) 
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
            });
    }, []);

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataScroller value={products} itemTemplate={itemTemplate} rows={10} inline scrollHeight="500px" header="Haga scroll para cargar más productos..." />
        </div>
    )
}
