import React, { useState, useEffect, useReducer, useCallback, memo } from 'react';
import Papa from 'papaparse';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextareaAutosize,
  Container,
  TextField,
  Box,
  Typography,
  Grid,
  Modal,
  Snackbar,
  Alert
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';

import Confirm from './confirm';
import PreviewData from './summaryTable';

const tableReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TABLE_DATA':
      return action.data;
    case 'UPDATE_CELL':
      var newState = JSON.parse(JSON.stringify(state)); // Deep copy
      newState[action.rowIndex][action.column] = action.value;
      return newState;
    case 'ADD_ROW':
      return [...state, { Name: '', Phone: '', Email: '' }];
    case 'DELETE_ROW':
      return [...state.slice(0, action.rowIndex), ...state.slice(action.rowIndex + 1)];

    case 'CLEAR_DATA':
      return [];

    default:
      return state;
  }
};

const MemoTableRow = memo(({ row, rowIndex, handleCellChange, onDelete  }) => {
  const [localState, setLocalState] = useState(row);

  useEffect(() => {
    setLocalState(row);
  }, [row]);



  const handleBlur = (e, rowIndex, column) => {
    handleCellChange(e, rowIndex, column);
  };

  const handleLocalChange = (e, column) => {
    setLocalState({
      ...localState,
      [column]: e.target.value
    });
  };

  return (
    <TableRow key={rowIndex}>
      <TableCell sx={{ textAlign: 'center' }}>{rowIndex + 1}</TableCell>
      {['Name', 'Phone', 'Email'].map((column) => (
        <TableCell key={column}>
          <TextField
            fullWidth
            value={localState[column] || ''}
            onChange={(e) => handleLocalChange(e, column)}
            onBlur={(e) => handleBlur(e, rowIndex, column)}
          />
        </TableCell>
      ))}
      <TableCell>
        <CloseOutlined onClick={ ()=>onDelete(rowIndex)} style={{ cursor: 'pointer' }} />
      </TableCell>
    </TableRow>
  );
});

const DataPreview = () => {
  const [tableData, dispatch] = useReducer(tableReducer, []);
  const [pasteData, setPasteData] = useState('');
  const [actionType, setActionType] = useState(false);
  const [resData, setResData] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = (type) => {
    if (tableData.length > 0) {
      setActionType(type);
    } else {
      alert('Failed to send : No table data available.');
    }
  };
  const handleModal = () => {
    setOpen(!open);
  };

  const handleParse = () => {
    Papa.parse(pasteData, {
      delimiter: '\t',
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        const validatedData = results.data.map((row, index) => {
          let newRow = { ...row };

          // Validate phone
          const phoneRegex = /^(\+?1)?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
          if (row.Phone && !phoneRegex.test(row.Phone)) {
            console.warn(`Row ${index + 1}: Invalid US phone number - ${row.Phone}`);
            newRow.Phone = '';
          }

          // Validate email
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (row.Email && !emailRegex.test(row.Email)) {
            console.warn(`Row ${index + 1}: Invalid email address - ${row.Email}`);
            newRow.Email = '';
          }

          return newRow;
        });

        dispatch({ type: 'SET_TABLE_DATA', data: validatedData });
      }
    });

    setPasteData('');
  };
  const handleClear = () => {
    dispatch({ type: 'CLEAR_DATA' });
  };
  const handleCellChange = useCallback((e, rowIndex, column) => {
    let value = e.target.value;

    if (column === 'Phone') {
      // Basic US phone number validation: (123) 456-7890 or 123-456-7890
      const phoneRegex = /^(\+?1)?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
      if (!phoneRegex.test(value)) {
        alert('Invalid US phone number');
        return;
      }
    }

    if (column === 'Email') {
      // Basic email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        alert('Invalid email address');
        return;
      }
    }

    dispatch({
      type: 'UPDATE_CELL',
      rowIndex,
      column,
      value: value
    });
  }, []);

  const deleteRow = (index) => {
    dispatch({ type: 'DELETE_ROW', rowIndex: index });
};


  const addRow = () => {
    dispatch({ type: 'ADD_ROW' });
  };
  return (
    <Container>
      <Button
        variant="contained"
        onClick={handleModal}
        style={{ margin: '10px', position: 'absolute', top: '0', marginTop: '12vh', right: 20 }}
      >
        Instructions
      </Button>
      <Modal open={open} onClose={handleModal} aria-labelledby="instruction-modal-title" aria-describedby="instruction-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '80%',
            width: '500px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px'
          }}
        >
          <Typography
            id="instruction-modal-title"
            variant="h6"
            component="h2"
            sx={{ borderBottom: '2px solid #f3f3f3', paddingBottom: '16px', marginBottom: '16px' }}
          >
            Instructions for Pasting Data
          </Typography>
          <Typography id="instruction-modal-description" sx={{ mt: 2, fontSize: '0.9rem' }}>
            1. Begin by copying the desired data from the CRM website and paste it into a Google Sheet.
            <br />
            2. Ensure that the first row of your Google Sheet contains the headers: {'Name'}, {'Phone'}, and {'Email'}. The data will be
            parsed based on these headers.
            <br />
            3. After populating the Google Sheet, copy it again and paste it into the provided textarea on this site.
            <br />
            4. Please avoid copying and pasting data directly from the CRM website to this tool.
            <br />
            5. Choose your preferred sending method: SMS, Email, or both according to your needs.
            <br />
            6. Kindly note that the system can process up to 100 SMS and 100 emails at once.
          </Typography>
          <Button
            sx={{
              mt: 2,
              backgroundColor: '#3f51b5',
              color: 'white',
              '&:hover': {
                backgroundColor: '#303f9f'
              }
            }}
            variant="contained"
            onClick={handleModal}
          >
            Got it!
          </Button>
        </Box>
      </Modal>

      <TextareaAutosize
        placeholder="Paste your Excel data here"
        value={pasteData}
        onChange={(e) => setPasteData(e.target.value)}
        style={{ borderRadius: '15px', height: '10vh', width: '100%', overflow: 'scroll', padding: '10px 0 0 10px' }}
      />
      <Button variant="contained" color="primary" onClick={handleParse} style={{ margin: '10px' }}>
        Parse Data
      </Button>
      <Paper elevation={3} style={{ marginTop: '20px', overflow: 'scroll', height: '45vh' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>SL No</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <MemoTableRow row={row} key={rowIndex} rowIndex={rowIndex} onDelete={deleteRow}  handleCellChange={handleCellChange} />
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Grid>
        <Button variant="contained" color="primary" onClick={addRow} style={{ margin: '10px' }}>
          Add Row
        </Button>
        <Button variant="contained" style={{ backgroundColor: 'rgb(243 69 69)', color: 'white', margin: '10px' }} onClick={handleClear}>
          Clear
        </Button>
      </Grid>

      {/* buttons for sending SMS, Email, and both */}
      <Grid style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Button variant="contained" onClick={() => handleClick('sms')} style={{ backgroundColor: '#4CAF50', color: 'white' }}>
          Send SMS
        </Button>
        <Button variant="contained" onClick={() => handleClick('email')} style={{ backgroundColor: '#2196F3', color: 'white' }}>
          Send Email
        </Button>
        <Button variant="contained" onClick={() => handleClick('both')} style={{ backgroundColor: '#FFC107', color: 'black' }}>
          Send SMS & Email
        </Button>
      </Grid>
      {actionType && (
        <Confirm
          loadingSend={loading}
          setIsSendLoading={setIsLoading}
          actionType={actionType}
          setActionType={setActionType}
          tableData={tableData}
          setResData={setResData}
        />
      )}
      {console.log(resData)}
      <>
      {resData && resData.message && <SnackBar />}
      </>
      {resData && !resData.message && <PreviewData resData={resData} setResData={setResData} />}
    </Container>
  );
};



const SnackBar = ()=>{
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return(
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical:"top", horizontal:"right" }}>
    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
      Scheduled Successfully
    </Alert>
  </Snackbar>
  )
}

export default DataPreview;
