// KixieTemplateRow.js
import React, { useState } from 'react';
import { TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import truncateWithEllipsis from 'utils/truncate';

const KixieTemplateRow = ({ id, name, content, status, template_type, role }) => {
  const [editMode, setEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <TableRow key={id}>
      <TableCell>{name}</TableCell>
      <TableCell>{truncateWithEllipsis(content, 150)}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell style={{ width: '25%' }}>
        {(role === 'director' || role === 'manager' || template_type === 'personal') && (
          <Button onClick={() => setEditMode(!editMode)}>Edit</Button>
        )}

        <Button onClick={() => setShowPreview(true)}>Preview</Button>

        <Dialog open={showPreview} onClose={() => setShowPreview(false)}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Preview</DialogTitle>
          
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
