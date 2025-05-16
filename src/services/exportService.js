// services/exportServices.js
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

// Función para exportar a Excel
export const exportToExcel = (data, fileName = 'export') => {
  // Preparar los datos para Excel
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
  // Generar el archivo y descargarlo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

// Función para exportar a PDF
export const exportToPDF = (data, columns, fileName = 'export') => {
  const doc = new jsPDF();
  
  // Agregar título
  doc.setFontSize(18);
  doc.text(fileName, 14, 22);
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);
  
  // Preparar datos para jsPDF-AutoTable
  const tableColumn = columns.map(col => col.title);
  const tableRows = [];
  
  data.forEach(item => {
    const rowData = [];
    columns.forEach(column => {
      // Si hay una función render, usamos una versión simplificada para el PDF
      if (column.render && typeof column.render === 'function') {
        let value;
        
        // Manejo especial para columnas comunes
        if (column.dataIndex === 'estado') {
          value = item[column.dataIndex];
        } else if (column.dataIndex === 'createdAt' || column.dataIndex === 'updatedAt') {
          value = new Date(item[column.dataIndex]).toLocaleDateString('es-ES');
        } else if (column.dataIndex === 'total') {
          value = `${item[column.dataIndex].toLocaleString('es-ES')}`;
        } else if (column.dataIndex === 'cliente') {
            value = `${item[column.dataIndex].toLocaleString('es-ES')}`;
        } else if (column.dataIndex === 'repuestos') {
          value = item[column.dataIndex]?.length || 0;
        } else {
          try {
            // Intentar obtener el valor renderizado (simplificado)
            const renderedValue = column.render(item[column.dataIndex], item);
            // Si el valor renderizado es un objeto React, usamos el valor original
            value = typeof renderedValue === 'object' ? item[column.dataIndex] : renderedValue;
          } catch {
            value = item[column.dataIndex] || '';
          }
        }
        rowData.push(value);
      } else {
        rowData.push(item[column.dataIndex] || '');
      }
    });
    tableRows.push(rowData);
  });
  
  // Generar la tabla
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'left',
    },
    headStyles: {
      fillColor: [211, 41, 41], // Color rojo que coincide con tu tema
      textColor: 255,
      fontStyle: 'bold',
    },
  });
  
  // Guardar el PDF
  doc.save(`${fileName}.pdf`);
};

// Función para preparar datos de ventas para exportación
export const prepareVentasForExport = (sales, clientes) => {
  return sales.map(sale => {
    // Resolver nombre de cliente
    let clienteNombre = "No disponible";
    if (sale.idCliente && typeof sale.idCliente === 'object') {
      clienteNombre = sale.idCliente.nombre || sale.idCliente.razonSocial || "Sin nombre";
    } else if (clientes.length > 0) {
      const clienteEncontrado = clientes.find(c => c._id === sale.idCliente);
      clienteNombre = clienteEncontrado ? (clienteEncontrado.nombre || clienteEncontrado.razonSocial) : 'Cliente no identificado';
    }
    
    return {
      id: sale._id,
      fecha: new Date(sale.createdAt).toLocaleDateString('es-ES'),
      cliente: clienteNombre,
      cantidadRepuestos: sale.repuestos?.length || 0,
      total: `$${sale.total.toLocaleString('es-ES')}`,
      estado: sale.estado,
      ultimaActualizacion: sale.updatedAt ? new Date(sale.updatedAt).toLocaleDateString('es-ES') : '-'
    };
  });
};