import React, { useState, useEffect} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import config from '../utils/conf';
import { Button } from 'primereact/button'; // Add this import statement


export const Inventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/producto`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Error al obtener los productos');
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      }
    };

    fetchProducts();
  }, []);

    const columns = [
        { field: 'code', header: 'Codigo'},
        { field: 'name', header: 'Nombre' },
        { field: 'quantity', header: 'Cantidad' },
        { field: 'price', header: 'Precio' }
    ];

    const isPositiveInteger = (val) => {
        let str = String(val);

        str = str.trim();

        if (!str) {
            return false;
        }

        str = str.replace(/^0+/, '') || '0';
        let n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;
    };

    const deleteProduct = async (productId) => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/producto/${productId}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            window.location.reload();
            setProducts(products.filter((product) => product.ID_Producto !== productId));
          } else {
            console.error('Error al eliminar el producto');
          }
        } catch (error) {
          console.error('Error de conexión:', error);
        }
      };

    const onCellEditComplete = async (e) => {
        let { rowData, newValue, field } = e;
      
        let updatedFields = {};
      
        switch (field) {
          case 'Producto':
            updatedFields.Producto = newValue;
            break;
          case 'Precio':
            updatedFields.Precio = newValue;
            break;
          case 'Cantidad':
            updatedFields.Cantidad = newValue;
            break;
          default:
            break;
        }
      
        await updateProduct(rowData.ID_Producto, updatedFields);
      };

    const cellEditor = (options) => {
        if (options.field === 'price') return priceEditor(options);
        else return textEditor(options);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" onKeyDown={(e) => e.stopPropagation()} />;
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.Precio);
      };  

      const quantityEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
      };
    
      const onQuantityEditComplete = (e) => {
        let { rowData, newValue } = e;
        if (newValue >= 0) {
          rowData.Cantidad = newValue;
        }
      };  

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Productos</span>
        </div>
    );

    const updateProduct = async (productId, updatedFields) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/producto/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });
    window.location.reload();

    if (!response.ok) {
      console.error('Error al actualizar el producto');
    }
  } catch (error) {
    console.error('Error de conexión:', error);
  }
};
      
     

    const footer = `Hay un total de ${products ? products.length : 0} productos.`;
  return (
        <div className="card">
            <DataTable header={header} footer={footer} value={products} editMode="cell" tableStyle={{ minWidth: '50rem' }}>
       
        <Column field="ID_Producto" header="Código" sortable={true} style={{ width: '25%' }} />
        <Column field="Producto" header="Nombre" sortable={true} style={{ width: '25%' }} editor={(options) => textEditor(options)} onCellEditComplete={onCellEditComplete} />
        <Column field="Precio" header="Precio" sortable={true} style={{ width: '25%' }} body={priceBodyTemplate} editor={(options) => priceEditor(options)} onCellEditComplete={onCellEditComplete} />
        <Column field="Cantidad" header="Cantidad" sortable={true} style={{ width: '20%' }} editor={(options) => quantityEditor(options)} onCellEditComplete={onCellEditComplete} />
        <Column
  body={(rowData) => (
    <Button
      icon="pi pi-trash"
      className="p-button-rounded p-button-danger"
      onClick={() => deleteProduct(rowData.ID_Producto)}
    />
  )}
  style={{ width: '10%' }}
/>
              </DataTable>
        </div>
  )
}
