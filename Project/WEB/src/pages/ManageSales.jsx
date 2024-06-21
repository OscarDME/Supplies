import React, { useState, useRef, useEffect } from 'react';
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
import { config } from "../utils/conf";

export const ManageSales = () => {
    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    const [products, setProducts] = useState(data);
    const [sales, setSales] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const [stats, setStats] = useState({
        CantidadVentas: 0,
        CantidadPedidos: 0,
        CantidadUsuarios: 0
    });

    useEffect(() => {
        fetchSalesData();
    }, []);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customer: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });

    const orderStatuses = [
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Enviado', value: 'Enviado' },
        { label: 'Entregado', value: 'Entregado' },
        { label: 'Cancelado', value: 'Cancelado' },
    ];
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');
        return formattedDate;
      };


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

    const fetchSalesData = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/sales`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSales(data.salesData);
            setStats(data.stats);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch sales data', life: 3000 });
        }
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
        return formatCurrency(rowData.Total);
    };

    const statusOrderBodyTemplate = (rowData) => {
        return <Tag value={rowData.EstadoPedido.toLowerCase()} severity={getOrderSeverity(rowData)}></Tag>;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown 
                value={options.value} 
                options={orderStatuses} 
                onChange={(e) => options.editorCallback(e.value)} 
                placeholder="Actualiza el estado" 
            />
        );
    };

    const onRowEditComplete = async (e) => {
        let { newData, index } = e;
    
        try {
            const response = await fetch(`${config.apiBaseUrl}/sales/${newData.ID_Pedido}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ EstadoPedido: newData.EstadoPedido }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
    
            let _sales = [...sales];
            _sales[index] = newData;
            setSales(_sales);
    
            toast.current.show({ severity: 'success', summary: 'Estado Actualizado', detail: `Pedido ${newData.ID_Pedido} actualizado a ${newData.EstadoPedido}`, life: 3000 });
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update order status', life: 3000 });
        }
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

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.FechaCreacion);
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
        return <img src={`https://primefaces.org/cdn/primereact/images/product/bamboo-watch.jpg`} alt={rowData.image} width="64px" className="shadow-4" />;
    };

    const allowExpansion = (rowData) => {
        return true;
    };

    
    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Productos de la orden: {data.ID_Pedido}</h5>
                <DataTable value={data.Productos}>
                    <Column header="Imagen" body={imageBodyTemplate} />
                    <Column field="Producto" header="Nombre" sortable />
                    <Column field="Precio" header="Precio" sortable body={(rowData) => formatCurrency(rowData.Precio)} />
                    <Column field="Cantidad" header="Cantidad" sortable />
                    <Column field="Descripcion" header="Descripción" sortable />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="p-d-flex p-jc-between p-mb-4">
                <div>
                    <h3>Cantidad de Ventas: {stats.CantidadVentas}</h3>
                    <h3>Cantidad de Pedidos: {stats.CantidadPedidos}</h3>
                    <h3>Cantidad de Usuarios: {stats.CantidadUsuarios}</h3>
                </div>
            </div>
            <DataTable value={sales} expandedRows={expandedRows} header={header} filters={filters} editMode="row" 
             onRowEditComplete={onRowEditComplete}
             onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="ID_Pedido" tableStyle={{ minWidth: '60rem' }}>
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="ID_Pedido" header="Id" sortable></Column>
                <Column field="Usuario.Nombre_Usuario" header="Cliente" sortable></Column>
                <Column field="FechaCreacion" header="Fecha" body={dateBodyTemplate} sortable></Column>
                <Column field="Total" header="Total" body={amountBodyTemplate} sortable></Column>
                <Column 
    field="EstadoPedido" 
    header="Estado" 
    body={statusOrderBodyTemplate} 
    editor={(options) => statusEditor(options)} 
    sortable 
/>       <Column headerStyle={{ width: '4rem' }}></Column>
<Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>
        </div>
    );
};

export default ManageSales;
