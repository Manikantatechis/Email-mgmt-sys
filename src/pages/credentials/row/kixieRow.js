import React, { useState } from 'react';
import { TableRow, TableCell, Button, Select, MenuItem } from '@mui/material';
import { EditOutlined } from '@ant-design/icons';

const KixieRow = ({ id, name, phone, status, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(status);

  const handleEdit = () => setIsEditing(true);
  const handleUpdate = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  return (
    <TableRow key={id}>
      <TableCell style={{ width: '10%' }}>{index}</TableCell>
      <TableCell style={{ width: '30%' }}>{name}</TableCell>
      <TableCell style={{ width: '30%' }}>{phone}</TableCell>
      <TableCell style={{ width: '20%' }}>
        {isEditing ? (
          <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        ) : (
          status || 'Active'
        )}
      </TableCell>
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
    </TableRow>
  );
};

export default KixieRow;
