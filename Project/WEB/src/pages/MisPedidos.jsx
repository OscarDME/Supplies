import React, { useState, useEffect, useRef } from 'react';
import { config } from "../utils/conf";
import { useMsal } from "@azure/msal-react"; 
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');
    return formattedDate;
  };

export const MisPedidos = () => {
    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    const [pedidos, setPedidos] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        fetchPedidos();
    }, []);

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
            toast.current.show({ severity: 'success', summary: 'Pedido Cancelado', detail: 'El pedido ha sido cancelado exitosamente.', life: 3000 });
        } else {
            console.error('Error al cancelar el pedido');
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al cancelar el pedido.', life: 3000 });
        }
    };

    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Pedido Expandido', detail: event.data.ID_Pedido, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Pedido Colapsado', detail: event.data.ID_Pedido, life: 3000 });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const totalBodyTemplate = (rowData) => {
        return formatCurrency(rowData.Total);
    };

    const estadoPedidoBodyTemplate = (rowData) => {
        return <Tag value={rowData.EstadoPedido.toLowerCase()} severity={getPedidoSeverity(rowData)}></Tag>;
    };

    const getPedidoSeverity = (pedido) => {
        switch (pedido.EstadoPedido) {
            case 'Entregado':
                return 'success';
            case 'Cancelado':
                return 'danger';
            case 'Pendiente':
                return 'warning';
            case 'Devuelto':
                return 'info';
            default:
                return null;
        }
    };

    const allowExpansion = (rowData) => {
        return rowData.productos && rowData.productos.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Productos del pedido: {data.ID_Pedido}</h5>
                <DataTable value={data.productos}>
                    <Column field="Producto" header="Nombre" sortable />
                    <Column field="PrecioUnitario" header="Precio" sortable body={(rowData) => formatCurrency(rowData.PrecioUnitario)} />
                    <Column field="Cantidad" header="Cantidad" sortable />
                </DataTable>
            </div>
        );
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

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable value={pedidos} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                       dataKey="ID_Pedido" tableStyle={{ minWidth: '60rem' }}>
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="ID_Pedido" header="ID" sortable></Column>
                <Column
                field="FechaCreacion"
                header="Fecha"
                sortable
                body={(rowData) => formatDate(rowData.FechaCreacion)}
                ></Column>               
                <Column field="Total" header="Total" body={totalBodyTemplate} sortable></Column>
                <Column field="EstadoPedido" header="Estado" body={estadoPedidoBodyTemplate} sortable></Column>
                <Column body={actionBodyTemplate} headerStyle={{ width: '8rem' }}></Column>
                
            </DataTable>
        </div>
    );
};

export default MisPedidos;