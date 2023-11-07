// GmailTemplateRow.js
import React, { useState } from 'react';
import { TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';

const GmailTemplateRow = ({index, _id, subject, html, content, status, template_type, cc, bcc, role, type, handleGmailTemplateEdit }) => {

  const [showPreview, setShowPreview] = useState(false);

  const dialogStyles = {
    maxWidth: '700px',
    margin: '0 auto'
  };

  const dialogTitleStyles = {
    fontWeight: 'bold',
    textAlign: 'center'
  };

  const dialogContentStyles = {
    padding: '16px'
  };

  const dialogActionsStyles = {
    justifyContent: 'flex-end'
  };

  const gridStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  };

  return (
    <TableRow key={_id}>
      <TableCell>{index +1}</TableCell>
      <TableCell>{subject}</TableCell>
      <TableCell>{type}</TableCell>

      <TableCell>{status}</TableCell>
      <TableCell>{template_type}</TableCell>

      <TableCell>
        {(role === 'manager' || role === 'director' || template_type === 'personal') && (
          <Button onClick={() => handleGmailTemplateEdit(_id)}>Edit</Button>
        )}
 </TableCell>
 <TableCell>
        <Button onClick={() => setShowPreview(true)}>Preview</Button>

 

        <Dialog open={showPreview} onClose={() => setShowPreview(false)} sx={dialogStyles}>
          <DialogTitle sx={dialogTitleStyles}>Preview</DialogTitle>
          <DialogContent sx={dialogContentStyles}>
            <Grid sx={gridStyles}>
              <h3>Subject:</h3>
              <p>{subject}</p>
            </Grid>

            <Grid sx={gridStyles}>
              {cc && cc.length > 0 && <h3>CC:</h3>}
              {cc && cc.map((c, index) => <p key={index}>{c}</p>)}
            </Grid>
            <Grid sx={gridStyles}>
              {bcc && bcc.length > 0 && <h3>BCC:</h3>}
              {bcc && bcc.map((bc, index) => <p key={index}>{bc}</p>)}
            </Grid>
            {type === 'content' && <h3>Content:</h3>}

            {type === 'content' && <p>{content}</p>}

            {type === 'html' && <h3>HTML:</h3>}
            {type === 'html' && <div dangerouslySetInnerHTML={{ __html: html }} />}
          </DialogContent>
          <DialogActions sx={dialogActionsStyles}>
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        </TableCell>
     
    </TableRow>
  );
};

export default GmailTemplateRow;
