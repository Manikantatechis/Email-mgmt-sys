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



// {
//   "smsSummary": [
//       {
//           "status": "fulfilled",
//           "value": {
//               "Name": "asdfghjk",
//               "Phone": "9294516805",
//               "status": "Failed",
//               "reason": "This number is blocked by your company"
//           }
//       }
//   ],
//   "emailSummary": [
//       {
//           "status": "fulfilled",
//           "value": {
//               "to": "asdfghjk@sdfgh.dfghj",
//               "status": "Success"
//           }
//       }
//   ]
// }



// const samplaData = {
// 		"smsSummary": [
// 			{
// 				"status": "Failed",
// 				"value": {
// 					"Phone": "12675772930",
// 					"status": "Failed"
// 				},
// 				"_id": "654d826c834c971a3ff46a34"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "18168835200",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a35"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "16027902960",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a36"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12018988822",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a37"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12195888003",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a38"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "15086038722",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a39"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12673241560",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a3a"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "17036776978",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a3b"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "16787245597",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a3c"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "15742144383",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a3d"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12195888003",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a3e"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "2052993079",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a3f"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "17577980024",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a40"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "19196081225",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a41"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14698773372",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a42"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "13176037769",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a43"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14154812162",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a44"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "17203629441",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a45"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "16788907522",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a46"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "18484447775",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a47"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12704383321",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a48"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "13479080859",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a49"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12345211607",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a4a"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "15152572482",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a4b"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "19724678171",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a4c"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "15732105125",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a4d"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "15014155718",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a4e"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "17029790302",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a4f"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "16066187205",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a50"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "18084689678",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a51"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "15043123334",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a52"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14096832294",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a53"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12673210262",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a54"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "13185941748",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a55"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "18067826648",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a56"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14706526204",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a57"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12563382381",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a58"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "16514789898",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a59"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14234305670",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a5a"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14782133127",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a5b"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "12144055595",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a5c"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "16613486617",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a5d"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "16627010699",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a5e"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "16017153593",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a5f"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "17146505824",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a60"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14342228332",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a61"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "19126611099",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a62"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14073148744",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a63"
// 			},
// 			{
// 				"status": "fulfilled",
// 				"value": {
// 					"Phone": "14094544500",
// 					"status": "Success"
// 				},
// 				"_id": "654d826c834c971a3ff46a64"
// 			}
// 		],
// 		"emailSummary": {
// 			"successfulEmailsCount": 49,
// 			"successfulEmails": [
// 				{
// 					"Email": "korantengprince38@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "birenchyus@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "nayetzli@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "ombagifred27@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "mwoffo5@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "bt789010@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "hrwilliams10@yahoo.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "mem8782@yahoo.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "rashadhu15@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "emilyvargas739@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "mwoffo5@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "bear5041987@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "shalaskalla@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "leamwilliams1025@icloud.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "terryayanah@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "uj.adirieje@gmil.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "kidheartbreakk@yahoo.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "martinatsosie16@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "richardsoncarlecia@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "valdezelizaa@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "chriskeen98@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "ciarabeauhall@yahoo.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "tmunlimited01@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "sennie.kerby@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "adkins.jacob21@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "lightwillconquer67@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "dodsonscarlett11@outlook.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "jreinecke1@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "jaymodesitt5@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "tgmitchell86@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "brentromero45@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "latoyadecuire3@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "rozenaroach@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "babdrikac@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "nathanbusby0214@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "nrosejr@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "charitybenafieldfnp@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "pe3177qk@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "jessicaforbes210@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "rosamallett1@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "lindseymoney30@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "denisedrummer18@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "shontabowen334@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "djpohlig@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "kellyc.rueda@gmail.con",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "ashleyscarbrough85@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "mycierra@comcast.net",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "akiramcneil@gmail.com",
// 					"status": "Success"
// 				},
// 				{
// 					"Email": "ddavislachaun@gmail.com",
// 					"status": "Success"
// 				}
// 			],
// 			"failedEmails": [{
//         "Email": "mycierra@comcast.net",
//         "status": "Success"
//       },
//       {
//         "Email": "akiramcneil@gmail.com",
//         "status": "Success"
//       },
//       {
//         "Email": "ddavislachaun@gmail.com",
//         "status": "Success"
//       }]
// 		},
// 	}

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
      { resData &&<PreviewData resData={{smsSummary:resData.smsSummary, successfulEmails:resData.emailSummary.successfulEmails, failedEmails:resData.emailSummary.failedEmails}} handleClose={setResData} />}

    
      <>
      {resData && resData.message && <SnackBar />}
      </>
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
