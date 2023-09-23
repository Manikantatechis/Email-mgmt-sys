import React, { useState } from 'react';
import { TableRow, TableCell, Button, Select, MenuItem } from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import { editKixieCred } from 'services/credentialsService';

const KixieRow = ({ _id, name, phone, status, index, role, type }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(status);
  const [newType, setNewType] = useState(type);


  const handleEdit = () => setIsEditing(true);
  const handleUpdate = async () => {

    try {
      const res = await editKixieCred({ status: newStatus, type: newType }, _id);
      if (res && res.message === 'Successfully updated') {
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => setIsEditing(false);

  

  return (
    <TableRow key={_id}>
      <TableCell style={{ width: '10%' }}>{index}</TableCell>
      <TableCell style={{ width: '20%' }}>{name}</TableCell>
      <TableCell style={{ width: '30%' }}>{phone}</TableCell>
      <TableCell style={{ width: '20%' }}>
        {isEditing ? (
          <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        ) : (
          newStatus || 'Active'
        )}
      </TableCell>
      <TableCell style={{ width: '20%' }}>
        {isEditing ? (
          <Select value={newType} onChange={(e) => setNewType(e.target.value)} style={{ minWidth: 60 }}>
            <MenuItem value="global">global</MenuItem>
            <MenuItem value="personal">personal</MenuItem>
          </Select>
        ) : (
          newType
        )}
      </TableCell>
      {(role === 'manager' || role === 'director' || type === 'personal') && (
        <TableCell style={{ width: '20%' }}>
          {isEditing ? (
            <>
              <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleUpdate}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
              Edit
            </Button>
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

export default KixieRow;
