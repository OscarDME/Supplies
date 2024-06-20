import React, { useState, useRef } from 'react';
import { useMsal } from "@azure/msal-react"; 
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { data } from '../components/DATA_PEDIDOS';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';

export const ManageSales = () => {
    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    const [products, setProducts] = useState(data);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customer: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });

    const orderStatuses = [
        { label: 'Delivered', value: 'DELIVERED' },
        { label: 'Cancelled', value: 'CANCELLED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Returned', value: 'RETURNED' },
    ];

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };
    
        _filters['global'].value = value;
        _filters['customer'].constraints[0].value = value;
    
        setFilters(_filters);
    };
    
    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';
    
        return (
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Buscar cliente..." />
            </IconField>
        );
    };

    const header = renderHeader();

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

    const statusEditor = (options) => {
        return (
            <Dropdown value={options.value} options={orderStatuses} onChange={(e) => onRowEditChange(options.rowData, e.value)} placeholder="Actualiza el estado" />
        );
    };

    const onRowEditChange = (rowData, value) => {
        const updatedProducts = products.map(product => {
            if (product.id === rowData.id) {
                product.status = value;
                toast.current.show({ severity: 'success', summary: 'Estado Actualizado', detail: `Pedido ${product.id} actualizado a ${value}`, life: 3000 });
            }
            return product;
        });
        setProducts(updatedProducts);
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
            <DataTable value={products} expandedRows={expandedRows} header={header} filters={filters} onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="id" tableStyle={{ minWidth: '60rem' }}>
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="id" header="Id" sortable></Column>
                <Column field="customer" header="Cliente" sortable></Column>
                <Column field="date" header="Fecha" sortable></Column>
                <Column field="amount" header="Cantidad" body={amountBodyTemplate} sortable></Column>
                <Column field="status" header="Estado" body={statusOrderBodyTemplate} editor={statusEditor} sortable></Column>
                <Column headerStyle={{ width: '4rem' }}></Column>
            </DataTable>
        </div>
    );
};

export default ManageSales;
