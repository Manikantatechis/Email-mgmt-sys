import React, { useState, useEffect, useReducer, useCallback, memo } from 'react';
import Papa from 'papaparse';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextareaAutosize, Container, TextField, Grid } from '@mui/material';
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

      case 'CLEAR_DATA':
        return []
    default:
      return state;
  }
};

const MemoTableRow = memo(({ row, rowIndex, handleCellChange }) => {
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
          <TableCell sx={{textAlign:"center"}} >{rowIndex +1}</TableCell>
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
    </TableRow>
  );
});

const DataPreview = () => {
  const [tableData, dispatch] = useReducer(tableReducer, []);
  const [pasteData, setPasteData] = useState('');
  const [actionType, setActionType] = useState(false);
  const [resData, setResData] = useState(null);
const [loading, setIsLoading] = useState(false)


  const handleClick = (type)=>{
    if(tableData.length > 0){
      setActionType(type)
    }else{
      alert("Failed to send : No table data available.")
    }
  }


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
const handleClear = ()=>{
  dispatch({ type: 'CLEAR_DATA'});
}
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


  const addRow = () => {
    dispatch({ type: 'ADD_ROW' });
  };
  return (
    <Container>
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
              <TableCell style={{ fontWeight: 'bold', textAlign:"center" }}>SL No</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <MemoTableRow row={row} key={rowIndex} rowIndex={rowIndex} handleCellChange={handleCellChange} />
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
      {actionType && <Confirm loadingSend={loading} setIsSendLoading={setIsLoading} actionType={actionType} setActionType={setActionType} tableData={tableData} setResData={setResData} />}
      {console.log("after"
      ,resData)}
      {resData && <PreviewData resData={resData} setResData={setResData} />}
    </Container>
  );
};

export default DataPreview;
