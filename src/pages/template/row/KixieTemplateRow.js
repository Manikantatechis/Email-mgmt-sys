// KixieTemplateRow.js
import React, { useState } from 'react';
import { TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import truncateWithEllipsis from 'utils/truncate';

const KixieTemplateRow = ({
  index,
  _id,
  name,
  content,
  status,
  template_type,
  role,
  handleKixieTemplateEdit,
  handleKixieTemplateDelete
}) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <TableRow key={_id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{truncateWithEllipsis(content, 150)}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell >
        {(role === 'director' || role === 'manager' || template_type === 'personal') && (
          <>
            <Button onClick={() => handleKixieTemplateEdit(_id)}>Edit</Button>
            <Button onClick={() => handleKixieTemplateDelete(_id)}>Delete</Button>
          </>
        )}
      </TableCell>
      <TableCell>
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
