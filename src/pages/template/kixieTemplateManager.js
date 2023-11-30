import React, { useEffect, useState } from 'react';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import KixieTemplateRow from './row/KixieTemplateRow';
import { useDispatch, useSelector } from 'react-redux';
import { getGmailTemplates, getKixieTemplates } from 'store/templates/templateThunk';
import { deleteTemplate, selectIsKixieLoading, selectKixieTemplates } from 'store/templates/templateSlice';
import AddKixieTempate from './AddKixieTemplate';
import { deleteKixieTemplate } from 'services/templateService';
import AlertDialog from 'components/alerts/confirmDelete';

const TemplateManager = () => {
  const [isKixieTemplateOpen, setIsKixieTemplateOpen] = useState(null);
  const [actionType, setActionType] = useState(null)
  const [open, setOpen] = useState()
  const [templateId, setTemplateId] = useState()

  const handleKixieTemplateEdit = (id)=>{
    setActionType({id, type:'edit'})
    setIsKixieTemplateOpen(true)
    
  }
  const handleKixieTemplateDelete = (id)=>{
    setTemplateId(id)
    setOpen(true)
  }

  const confirmDelete = async(id)=>{
    const res = await deleteKixieTemplate(id)
    console.log(res)
    if(res){
      dispatch(deleteTemplate({type:"kixie", id}))
    }
  }
  const kixieTemplates = useSelector(selectKixieTemplates);
  const isKixieLoading = useSelector(selectIsKixieLoading);


  const dispatch = useDispatch();
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    dispatch(getGmailTemplates());
    dispatch(getKixieTemplates());
  }, []);

  return (
    <Container>
      <Paper elevation={3} sx={{ borderRadius: 2, padding: 4, height: '78vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3, marginBottom: 3 }}>
          <Container component="span">Kixie Templates</Container>
          <Button
            variant="contained"
            color="primary"
            style={{ whiteSpace: 'nowrap', padding: '7px 30px' }}
            onClick={() => setIsKixieTemplateOpen(true)}
          >
            Add Kixie Template {isKixieLoading}
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ height: '62vh', overflowY: 'scroll' }}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell style={{whiteSpace:"nowrap"}}>SL NO</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Status</TableCell>
                <TableCell >Actions</TableCell>
                <TableCell >Preview</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {kixieTemplates &&
                kixieTemplates.length > 0 &&
                kixieTemplates.map((template, index) => <KixieTemplateRow key={template.id} index= {index} {...template} role={role} handleKixieTemplateEdit={handleKixieTemplateEdit} handleKixieTemplateDelete={handleKixieTemplateDelete} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {isKixieTemplateOpen && <AddKixieTempate setIsKixieTemplateOpen={setIsKixieTemplateOpen} role={role} actionType={actionType} />}

      {open && <AlertDialog id={templateId} open={open} setOpen={setOpen} confirmDelete={confirmDelete} />}

    </Container>
  );
};

export default TemplateManager;
