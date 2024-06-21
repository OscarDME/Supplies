import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { DataScroller } from 'primereact/datascroller';
import { config } from "../utils/conf";
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast'; 
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Slider } from 'primereact/slider';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "../styles/Products.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { useMsal } from "@azure/msal-react"; 


export const Products = () => { 
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]); 
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [searchTerm, setSearchTerm] = useState('');


    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    const toast = useRef(null); 


    const getSeverity = (product) => {
        if (product.Cantidad > 0) {
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
                            <span className="text-sm text-500">Disponibles: {data.Cantidad}</span>
                            <Button 
                                icon="pi pi-shopping-cart" 
                                label="Añadir al carrito" 
                                disabled={data.Cantidad === 0} 
                                onClick={() => addToCart(data.ID_Producto)}
                            ></Button>
                            <Tag value={data.Cantidad > 0 ? 'En Stock' : 'Sin Stock'} severity={getSeverity(data)}></Tag>
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
                setFilteredProducts(data);
                const uniqueTypes = [...new Set(data.map(product => product.Tipo))];
                setTypes(uniqueTypes.map(type => ({ label: type, value: type })));
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
            });
    }, []);

    useEffect(() => {
        const filtered = products.filter(product => 
            (!selectedType || product.Tipo === selectedType) &&
            (product.Precio >= priceRange[0] && product.Precio <= priceRange[1]) &&
            (product.Producto.toLowerCase().includes(searchTerm.toLowerCase()) || 
             product.Descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProducts(filtered);
    }, [selectedType, priceRange, searchTerm, products]);

    const header = () => {
        return (
            <div className="flex flex-wrap justify-content-between align-items-center gap-2">
                <Dropdown 
                    value={selectedType} 
                    options={types} 
                    onChange={(e) => setSelectedType(e.value)} 
                    placeholder="Seleccionar tipo"
                    className="w-full sm:w-14rem"
                />
                <span className="p-input-icon-left w-full sm:w-14rem">
                    <i className="pi pi-search" />
                    <InputText 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Buscar productos" 
                        className="w-full"
                    />
                </span>
                <div className="w-full sm:w-14rem">
                    <label htmlFor="price-range" className="block mb-2">Rango de precio: ${priceRange[0]} - ${priceRange[1]}</label>
                    <Slider 
                        value={priceRange} 
                        onChange={(e) => setPriceRange(e.value)} 
                        range 
                        min={0} 
                        max={100} 
                        className="w-full"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataView 
                value={filteredProducts} 
                itemTemplate={itemTemplate} 
                layout="grid"
                header={header()}
                paginator
                rows={9}
            />
        </div>
    )
}
