// KixieTemplateRow.js
import React, { useState } from 'react';
import { TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const KixieTemplateRow = ({ id, name, content, status }) => {
  const [editMode, setEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <TableRow key={id}>
      <TableCell>{name}</TableCell>
      <TableCell>{content}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell style={{ width: '25%' }}>
        <Button onClick={() => setEditMode(!editMode)}>Edit</Button>
        <Button onClick={() => setShowPreview(true)}>Preview</Button>

        <Dialog open={showPreview} onClose={() => setShowPreview(false)}>
          <DialogTitle>Preview</DialogTitle>
          <DialogContent>{content}</DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default KixieTemplateRow;
