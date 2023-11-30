import React, { useEffect, useState } from 'react';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import GmailTemplateRow from './row/GmailTemplateRow';
import { useDispatch, useSelector } from 'react-redux';
import { getGmailTemplates, getKixieTemplates } from 'store/templates/templateThunk';
import { deleteTemplate, selectGmailTemplates, selectIsGmailLoading } from 'store/templates/templateSlice';
import AddGmailTemplate from './AddGmailTemplate';
// import { deleteGmailTemplate } from 'services/templateService';
import AlertDialog from 'components/alerts/confirmDelete';
import { deleteGmailTemplate } from 'services/templateService';

const TemplateManager = () => {
  const [isGmailTemplateOpen, setIsGmailTemplateOpen] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [templateId, setTemplateId] = useState()
  const [open, setOpen] = useState(false)

  const handleGmailTemplateEdit = (id) => {
    setActionType({ id, type: 'edit' });
    setIsGmailTemplateOpen(true);
  };

  const handleGmailTemplateDelete = async(id)=>{
    setTemplateId(id)
    setOpen(true)
    
    
  }

  const confirmDelete =async(id)=>{
    const res = await deleteGmailTemplate(id)
    console.log(res)
    if(res){
      dispatch(deleteTemplate({type:"gmail", id}))
    }
  }



  const gmailTemplates = useSelector(selectGmailTemplates);

  const isGmailLoading = useSelector(selectIsGmailLoading);

  const dispatch = useDispatch();
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    dispatch(getGmailTemplates());
    dispatch(getKixieTemplates());
  }, []);

  return (
    <Container>
      <Paper elevation={3} sx={{ borderRadius: 2, padding: 4, height: '78vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
          <Container component="span">Gmail Templates</Container>
          <Button
            variant="contained"
            color="primary"
            style={{ whiteSpace: 'nowrap', padding: '7px 30px' }}
            onClick={() => setIsGmailTemplateOpen(true)}
          >
            Add Gmail Template {isGmailLoading}
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ height: '64vh', overflowY: 'scroll' }}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Sl No</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Template Type</TableCell>

                <TableCell>Actions</TableCell>
                <TableCell>Preview</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {gmailTemplates &&
                gmailTemplates.length > 0 &&
                gmailTemplates.map((template, index) => (
                  <GmailTemplateRow key={template.id} {...template} index = {index} role={role} handleGmailTemplateEdit={handleGmailTemplateEdit} handleGmailTemplateDelete={handleGmailTemplateDelete} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {open && <AlertDialog id={templateId} confirmDelete={confirmDelete} open={open} setOpen={setOpen} />}

      {isGmailTemplateOpen && <AddGmailTemplate setIsGmailTemplateOpen={setIsGmailTemplateOpen} role={role} actionType={actionType} />}
    </Container>
  );
};

export default TemplateManager;
