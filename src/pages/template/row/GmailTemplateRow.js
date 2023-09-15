// GmailTemplateRow.js
import React, { useState } from 'react';
import { TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import truncateWithEllipsis from 'utils/truncate';

const GmailTemplateRow = ({ subject, html, content, status, type }) => {
  const [editMode, setEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <TableRow>
      <TableCell>{subject}</TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>
        {type === 'text' && truncateWithEllipsis(content, 150)}
        {type === 'html' && <div  dangerouslySetInnerHTML={{ __html: truncateWithEllipsis(html, 800) }} />}
      </TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>
        <Button onClick={() => setEditMode(!editMode)}>Edit</Button>
        <Button onClick={() => setShowPreview(true)}>Preview</Button>

        <Dialog open={showPreview} onClose={() => setShowPreview(false)}>
          <DialogTitle>Preview</DialogTitle>
          <DialogContent>
            {type === 'content' && content}
            {type === 'html' && <div dangerouslySetInnerHTML={{ __html: html }} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default GmailTemplateRow;
