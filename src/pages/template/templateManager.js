import React, { useEffect, useState } from 'react';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import GmailTemplateRow from './row/GmailTemplateRow';
import KixieTemplateRow from './row/KixieTemplateRow';
import { useDispatch, useSelector } from 'react-redux';
import { getGmailTemplates, getKixieTemplates } from 'store/templates/templateThunk';
import { selectGmailTemplates, selectIsGmailLoading, selectIsKixieLoading, selectKixieTemplates } from 'store/templates/templateSlice';
import AddKixieTempate from './AddKixieTemplate';
import AddGmailTemplate from './AddGmailTemplate';

const TemplateManager = () => {
  const [isKixieTemplateOpen, setIsKixieTemplateOpen] = useState(null);
  const [isGmailTemplateOpen, setIsGmailTemplateOpen] = useState(null);
  const [actionType, setActionType] = useState(null)

  const handleGmailTemplateEdit = (id)=>{
    setActionType({id, type:'edit'})
    setIsGmailTemplateOpen(true)

    
  }
  const handleKixieTemplateEdit = (id)=>{
    setActionType({id, type:'edit'})
    setIsKixieTemplateOpen(true)
    
  }

  const gmailTemplates = useSelector(selectGmailTemplates);

  const kixieTemplates = useSelector(selectKixieTemplates);

  const isGmailLoading = useSelector(selectIsGmailLoading);
  const isKixieLoading = useSelector(selectIsKixieLoading);


  const dispatch = useDispatch();
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    dispatch(getGmailTemplates());
    dispatch(getKixieTemplates());
  }, []);

  return (
    <Container>
      <Paper elevation={3} sx={{ borderRadius: 2, padding: 4, minHeight: '70vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
          <Container component="span">Gmail Templates</Container>
          <Button
            variant="contained"
            color="primary"
            style={{ whiteSpace: 'nowrap', padding: '7px 30px' }}
            onClick={() => setIsGmailTemplateOpen(true)}
          >
            Add Gmail Template {isGmailLoading} {isKixieLoading}
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ height: '30vh', overflowY: 'scroll' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gmailTemplates &&
                gmailTemplates.length > 0 &&
                gmailTemplates.map((template) => <GmailTemplateRow key={template.id} {...template} role={role} handleGmailTemplateEdit={handleGmailTemplateEdit} />)}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3, marginBottom: 3 }}>
          <Container component="span">Kixie Templates</Container>
          <Button
            variant="contained"
            color="primary"
            style={{ whiteSpace: 'nowrap', padding: '7px 30px' }}
            onClick={() => setIsKixieTemplateOpen(true)}
          >
            Add Kixie Template
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ height: '30vh', overflowY: 'scroll' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kixieTemplates &&
                kixieTemplates.length > 0 &&
                kixieTemplates.map((template) => <KixieTemplateRow key={template.id} {...template} role={role} handleKixieTemplateEdit={handleKixieTemplateEdit} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {isKixieTemplateOpen && <AddKixieTempate setIsKixieTemplateOpen={setIsKixieTemplateOpen} role={role} actionType={actionType} />}
      {isGmailTemplateOpen && <AddGmailTemplate setIsGmailTemplateOpen={setIsGmailTemplateOpen} role={role} actionType={actionType} />}
    </Container>
  );
};

export default TemplateManager;
