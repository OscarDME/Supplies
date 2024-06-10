import React, { useState, useEffect, useRef } from 'react';
import { config } from "../utils/conf";
import { useMsal } from "@azure/msal-react"; 
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { data } from '../components/DATA_PEDIDOS';

export const MisPedidos = () => {
    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    const [products, setProducts] = useState(data);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Pedido Expandido', detail: event.data.id, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Pedido Colapsado', detail: event.data.id, life: 3000 });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    };

    const statusOrderBodyTemplate = (rowData) => {
        return <Tag value={rowData.status.toLowerCase()} severity={getOrderSeverity(rowData)}></Tag>;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getProductSeverity(rowData)}></Tag>;
    };

    const getProductSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return null;
        }
    };

    const getOrderSeverity = (order) => {
        switch (order.status) {
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            case 'PENDING':
                return 'warning';
            case 'RETURNED':
                return 'info';
            default:
                return null;
        }
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} width="64px" className="shadow-4" />;
    };

    const allowExpansion = (rowData) => {
        return true;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Productos de la orden: {data.id}</h5>
                <DataTable value={data.products}>
                    <Column field="name" header="Nombre" sortable />
                    <Column header="Imagen" body={imageBodyTemplate} />
                    <Column field="price" header="Precio" sortable body={priceBodyTemplate} />
                    <Column field="category" header="Categoría" sortable />
                    <Column field="inventoryStatus" header="Estado" sortable body={statusBodyTemplate} />
                    <Column field="quantity" header="Cantidad" sortable />

                </DataTable>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="id" tableStyle={{ minWidth: '60rem' }}>
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="id" header="Id" sortable></Column>
                <Column field="customer" header="Cliente" sortable></Column>
                <Column field="date" header="Fecha" sortable></Column>
                <Column field="amount" header="Cantidad" body={amountBodyTemplate} sortable></Column>
                <Column field="status" header="Estado" body={statusOrderBodyTemplate} sortable></Column>
                <Column headerStyle={{ width: '4rem' }}></Column>
            </DataTable>
        </div>
    );
};

export default MisPedidos;
