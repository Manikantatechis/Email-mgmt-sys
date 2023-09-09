import React, { useEffect, useState } from 'react';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import GmailTemplateRow from './row/GmailTemplateRow';
import KixieTemplateRow from './row/KixieTemplateRow';
import AddTemplate from './AddTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { getGmailTemplates, getKixieTemplates } from 'store/templates/templateThunk';
import { selectGmailTemplates, selectIsGmailLoading, selectIsKixieLoading, selectKixieTemplates } from 'store/templates/templateSlice';

const TemplateManager = () => {
  const [actionType, setActionType] = useState(null); // 'gmailTemplate' or 'kixieTemplate'

  const gmailTemplates = useSelector(selectGmailTemplates)
  // [
  //   { id: 1, name: 'Template 1', content: 'Hello, this is Gmail template 1', status: 'Active' }
  //   // Add more Gmail templates here
  // ];

  const kixieTemplates =  useSelector(selectKixieTemplates)
  // [
  //   { id: 1, name: 'Template 1', content: 'Hello, this is Kixie template 1', status: 'Active' }
  //   // Add more Kixie templates here
  // ];
  const isGmailLoading = useSelector(selectIsGmailLoading)
  const isKixieLoading = useSelector(selectIsKixieLoading);

const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getGmailTemplates())
    dispatch(getKixieTemplates())
  },[])

  return (
    <Container>
      <Paper elevation={3} sx={{ borderRadius: 2, padding: 4, minHeight: '70vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
          <Container component="span">Gmail Templates</Container>
          <Button
            variant="contained"
            color="primary"
            style={{ whiteSpace: 'nowrap', padding: '7px 30px' }}
            onClick={() => setActionType('gmail')}
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
              {gmailTemplates && gmailTemplates.length > 0 && gmailTemplates.map((template) => (
                <GmailTemplateRow key={template.id} {...template} actionType={actionType} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3, marginBottom: 3 }}>
          <Container component="span">Kixie Templates</Container>
          <Button
            variant="contained"
            color="primary"
            style={{ whiteSpace: 'nowrap', padding: '7px 30px' }}
            onClick={() => setActionType('kixie')}
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
                kixieTemplates.map((template) => <KixieTemplateRow key={template.id} {...template} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {actionType && <AddTemplate actionType={actionType} setActionType={setActionType} />}
    </Container>
  );
};

export default TemplateManager;
