// DataTable.jsx
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tooltip } from 'antd';
import { SearchOutlined, EditFilled, EyeFilled, EditOutlined, DeleteOutlined, SyncOutlined, DeleteFilled, EyeOutlined } from '@ant-design/icons';
import '../styles/DataTable.css';

const DataTable = ({ 
  columns, 
  dataSource, 
  loading, 
  onView, 
  onEdit, 
  onDelete,
  onToggleStatus, // Nueva prop para manejar el cambio de estado
  toggleStatusLoading, // Prop para controlar el estado de carga del botón
  toggleStatusIdLoading, // ID del elemento que está cambiando estado
  showToggleStatus = false, // Flag para mostrar/ocultar el botón de cambio de estado 
  pagination = true,
  showActions = true 
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Asegurarse que dataSource sea siempre un array
    if (Array.isArray(dataSource)) {
      setTableData(dataSource);
    } else {
      console.warn('dataSource no es un array:', dataSource);
      setTableData([]); // Usar array vacío si no es un array
    }
  }, [dataSource]);

  // Función para manejar la búsqueda
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // Función para resetear la búsqueda
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  // Renderizar texto con resaltado de búsqueda
  const renderColumnText = (text, dataIndex) => {
    if (searchedColumn === dataIndex && searchText) {
      const index = text ? text.toString().toLowerCase().indexOf(searchText.toLowerCase()) : -1;
      if (index >= 0) {
        const beforeStr = text.toString().substring(0, index);
        const matchStr = text.toString().substring(index, index + searchText.length);
        const afterStr = text.toString().substring(index + searchText.length);
        return (
          <span>
            {beforeStr}
            <span style={{ backgroundColor: '#ffc069' }}>{matchStr}</span>
            {afterStr}
          </span>
        );
      }
    }
    return text;
  };

  // Configuración para los filtros de búsqueda en cada columna
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
          className="search-input"
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, background: '#d32929', borderColor: '#d32929' }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#fff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text => renderColumnText(text, dataIndex),
  });

  // Aplicar propiedades de búsqueda a las columnas
  const enhancedColumns = columns.map(col => {
    if (col.searchable) {
      return {
        ...col,
        ...getColumnSearchProps(col.dataIndex),
      };
    }
    return col;
  });

  // Agregar columna de acciones si showActions es verdadero
  const columnsWithActions = showActions 
    ? [
        ...enhancedColumns,
        {
          title: 'Acciones',
          key: 'actions',
          align: 'center',
          width: 180,
          render: (_, record) => (
            <Space size="middle">
              {onView && (
                <Tooltip title="Ver detalles">
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => onView(record)} 
                    type="text" 
                    className="action-button view-button"
                  />
                </Tooltip>
              )}
              {onEdit && (
                <Tooltip title="Editar">
                  <Button 
                    icon={<EditOutlined />} 
                    onClick={() => onEdit(record)} 
                    type="text" 
                    className="action-button edit-button"
                  />
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Eliminar">
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={() => onDelete(record)} 
                    type="text" 
                    className="action-button delete-button"
                  />
                </Tooltip>
              )}
              {showToggleStatus && onToggleStatus && (
                <Tooltip title={(() => {
                    switch(record.estado) {
                      case 'Activo': return 'Desactivar';
                      case 'Completada': return 'Cancelar';
                      case 'Cancelada' : return 'Completar';
                      case 'Inactivo': return 'Activar';
                      default: return 'Acción';
                    }
                  })()}>
                  <Button 
                    icon={<SyncOutlined spin={toggleStatusLoading && toggleStatusIdLoading === record._id} />} 
                    onClick={() => onToggleStatus(record)} 
                    type="text" 
                    className={`action-button ${record.estado === 'Activo' || record.estado === 'Completada' ? 'status-active-button' : 'status-inactive-button'}`}
                  />
                </Tooltip>
              )}
            </Space>
          ),
        },
      ]
    : enhancedColumns;

  return (
    <div className="data-table-container">
      <Table
        columns={columnsWithActions}
        dataSource={tableData}
        loading={loading}
        rowKey="_id"
        pagination={pagination ? { 
          pageSize: 4, 
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} Registros` 
        } : false}
        className="custom-table"
        bordered
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default DataTable;