import React, { useState, useEffect, useRef } from 'react';
import { config } from "../utils/conf";
import { useMsal } from "@azure/msal-react"; 
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

export const MisPedidos = () => {
    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    const [pedidos, setPedidos] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ID_Pedido: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });

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
            setPedidos(data);
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
            toast.current.show({ severity: 'success', summary: 'Pedido Cancelado', detail: 'El pedido ha sido cancelado exitosamente.', life: 3000 });
        } else {
            console.error('Error al cancelar el pedido');
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al cancelar el pedido.', life: 3000 });
        }
    };
    
    const eliminarPedidoCancelado = async (ID_Pedido) => {
        const response = await fetch(`${config.apiBaseUrl}/deleteCanceledOrder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ID_Pedido })
        });
        if (response.ok) {
          fetchPedidos();
          toast.current.show({ severity: 'success', summary: 'Pedido Eliminado', detail: 'El pedido ha sido eliminado exitosamente.', life: 3000 });
        } else {
          console.error('Error al eliminar el pedido');
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al eliminar el pedido.', life: 3000 });
        }
      };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Buscar pedido" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const estadoPedidoBodyTemplate = (rowData) => {
        return <Tag value={rowData.EstadoPedido.toLowerCase()} severity={getPedidoSeverity(rowData)}></Tag>;
    };

    const getPedidoSeverity = (pedido) => {
        switch (pedido.EstadoPedido) {
            case 'Entregado': return 'success';
            case 'Cancelado': return 'danger';
            case 'Pendiente': return 'warning';
            case 'Enviado': return 'info';
            default: return null;
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    label="Cancelar Pedido"
                    className="p-button-danger"
                    onClick={() => cancelarPedido(rowData.ID_Pedido)}
                    disabled={rowData.EstadoPedido !== 'Pendiente'}
                />
                {rowData.EstadoPedido === 'Cancelado' && (
                    <Button
                        label="Eliminar Pedido"
                        className="p-button-danger"
                        onClick={() => eliminarPedidoCancelado(rowData.ID_Pedido)}
                    />
                )}
            </div>
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Detalles del pedido: {data.ID_Pedido}</h5>
                <div className="p-grid">
                    <div className="p-col-12 p-md-6">
                        <p><strong>Dirección de envío:</strong> {data.DireccionEnvio}</p>
                        <p><strong>Receptor:</strong> {data.NombreReceptor} {data.ApellidoReceptor}</p>
                        <p><strong>Método de pago:</strong> {data.MetodoPago}</p>
                    </div>
                </div>
                <h6>Productos:</h6>
                <DataTable value={data.Productos}>
                    <Column field="Producto" header="Nombre" sortable />
                    <Column field="Descripcion" header="Descripción" />
                    <Column field="Cantidad" header="Cantidad" sortable />
                    <Column field="PrecioUnitario" header="Precio Unitario" body={(rowData) => formatCurrency(rowData.PrecioUnitario)} sortable />
                    <Column field="Subtotal" header="Subtotal" body={(rowData) => formatCurrency(rowData.Subtotal)} sortable />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable 
                value={pedidos} 
                expandedRows={expandedRows} 
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="ID_Pedido" 
                filters={filters} 
                filterDisplay="menu" 
                globalFilterFields={['ID_Pedido', 'EstadoPedido']} 
                header={header} 
                emptyMessage="No se encontraron pedidos"
                responsiveLayout="scroll"
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="ID_Pedido" header="ID Pedido" sortable filter filterPlaceholder="Buscar por ID" />
                <Column field="FechaCreacion" header="Fecha" sortable body={(rowData) => formatDate(rowData.FechaCreacion)} />
                <Column field="Total" header="Total" body={(rowData) => formatCurrency(rowData.Total)} sortable />
                <Column field="EstadoPedido" header="Estado" body={estadoPedidoBodyTemplate} sortable filter filterElement={(options) => <InputText type="text" onChange={(e) => options.filterCallback(e.target.value)} />} />
                <Column body={actionBodyTemplate} headerStyle={{ width: '8rem' }} />
            </DataTable>
        </div>
    );
};

export default MisPedidos;


