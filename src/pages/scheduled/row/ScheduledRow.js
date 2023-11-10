import React, {useState} from 'react';
import {
  TableCell,
  TableRow,
  Button
  //  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Report from 'pages/sendEmailSms/summaryTable';


const samplaData = 
{
		"smsSummary": [
			{
				"status": "Failed",
				"value": {
					"Phone": "12675772930",
					"status": "Failed"
				},
				"_id": "654d826c834c971a3ff46a34"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "18168835200",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a35"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "16027902960",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a36"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12018988822",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a37"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12195888003",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a38"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "15086038722",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a39"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12673241560",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a3a"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "17036776978",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a3b"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "16787245597",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a3c"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "15742144383",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a3d"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12195888003",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a3e"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "2052993079",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a3f"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "17577980024",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a40"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "19196081225",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a41"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14698773372",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a42"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "13176037769",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a43"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14154812162",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a44"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "17203629441",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a45"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "16788907522",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a46"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "18484447775",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a47"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12704383321",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a48"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "13479080859",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a49"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12345211607",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a4a"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "15152572482",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a4b"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "19724678171",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a4c"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "15732105125",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a4d"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "15014155718",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a4e"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "17029790302",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a4f"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "16066187205",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a50"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "18084689678",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a51"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "15043123334",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a52"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14096832294",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a53"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12673210262",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a54"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "13185941748",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a55"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "18067826648",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a56"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14706526204",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a57"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12563382381",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a58"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "16514789898",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a59"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14234305670",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a5a"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14782133127",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a5b"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "12144055595",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a5c"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "16613486617",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a5d"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "16627010699",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a5e"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "16017153593",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a5f"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "17146505824",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a60"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14342228332",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a61"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "19126611099",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a62"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14073148744",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a63"
			},
			{
				"status": "fulfilled",
				"value": {
					"Phone": "14094544500",
					"status": "Success"
				},
				"_id": "654d826c834c971a3ff46a64"
			}
		],
		"emailSummary": {
			"successfulEmailsCount": 49,
			"successfulEmails": [
				{
					"Email": "korantengprince38@gmail.com",
					"status": "Success"
				},
				{
					"Email": "birenchyus@gmail.com",
					"status": "Success"
				},
				{
					"Email": "nayetzli@gmail.com",
					"status": "Success"
				},
				{
					"Email": "ombagifred27@gmail.com",
					"status": "Success"
				},
				{
					"Email": "mwoffo5@gmail.com",
					"status": "Success"
				},
				{
					"Email": "bt789010@gmail.com",
					"status": "Success"
				},
				{
					"Email": "hrwilliams10@yahoo.com",
					"status": "Success"
				},
				{
					"Email": "mem8782@yahoo.com",
					"status": "Success"
				},
				{
					"Email": "rashadhu15@gmail.com",
					"status": "Success"
				},
				{
					"Email": "emilyvargas739@gmail.com",
					"status": "Success"
				},
				{
					"Email": "mwoffo5@gmail.com",
					"status": "Success"
				},
				{
					"Email": "bear5041987@gmail.com",
					"status": "Success"
				},
				{
					"Email": "shalaskalla@gmail.com",
					"status": "Success"
				},
				{
					"Email": "leamwilliams1025@icloud.com",
					"status": "Success"
				},
				{
					"Email": "terryayanah@gmail.com",
					"status": "Success"
				},
				{
					"Email": "uj.adirieje@gmil.com",
					"status": "Success"
				},
				{
					"Email": "kidheartbreakk@yahoo.com",
					"status": "Success"
				},
				{
					"Email": "martinatsosie16@gmail.com",
					"status": "Success"
				},
				{
					"Email": "richardsoncarlecia@gmail.com",
					"status": "Success"
				},
				{
					"Email": "valdezelizaa@gmail.com",
					"status": "Success"
				},
				{
					"Email": "chriskeen98@gmail.com",
					"status": "Success"
				},
				{
					"Email": "ciarabeauhall@yahoo.com",
					"status": "Success"
				},
				{
					"Email": "tmunlimited01@gmail.com",
					"status": "Success"
				},
				{
					"Email": "sennie.kerby@gmail.com",
					"status": "Success"
				},
				{
					"Email": "adkins.jacob21@gmail.com",
					"status": "Success"
				},
				{
					"Email": "lightwillconquer67@gmail.com",
					"status": "Success"
				},
				{
					"Email": "dodsonscarlett11@outlook.com",
					"status": "Success"
				},
				{
					"Email": "jreinecke1@gmail.com",
					"status": "Success"
				},
				{
					"Email": "jaymodesitt5@gmail.com",
					"status": "Success"
				},
				{
					"Email": "tgmitchell86@gmail.com",
					"status": "Success"
				},
				{
					"Email": "brentromero45@gmail.com",
					"status": "Success"
				},
				{
					"Email": "latoyadecuire3@gmail.com",
					"status": "Success"
				},
				{
					"Email": "rozenaroach@gmail.com",
					"status": "Success"
				},
				{
					"Email": "babdrikac@gmail.com",
					"status": "Success"
				},
				{
					"Email": "nathanbusby0214@gmail.com",
					"status": "Success"
				},
				{
					"Email": "nrosejr@gmail.com",
					"status": "Success"
				},
				{
					"Email": "charitybenafieldfnp@gmail.com",
					"status": "Success"
				},
				{
					"Email": "pe3177qk@gmail.com",
					"status": "Success"
				},
				{
					"Email": "jessicaforbes210@gmail.com",
					"status": "Success"
				},
				{
					"Email": "rosamallett1@gmail.com",
					"status": "Success"
				},
				{
					"Email": "lindseymoney30@gmail.com",
					"status": "Success"
				},
				{
					"Email": "denisedrummer18@gmail.com",
					"status": "Success"
				},
				{
					"Email": "shontabowen334@gmail.com",
					"status": "Success"
				},
				{
					"Email": "djpohlig@gmail.com",
					"status": "Success"
				},
				{
					"Email": "kellyc.rueda@gmail.con",
					"status": "Success"
				},
				{
					"Email": "ashleyscarbrough85@gmail.com",
					"status": "Success"
				},
				{
					"Email": "mycierra@comcast.net",
					"status": "Success"
				},
				{
					"Email": "akiramcneil@gmail.com",
					"status": "Success"
				},
				{
					"Email": "ddavislachaun@gmail.com",
					"status": "Success"
				}
			],
			"failedEmails": [{
        "Email": "mycierra@comcast.net",
        "status": "failed"
      },
      {
        "Email": "akiramcneil@gmail.com",
        "status": "failed"
      },
      {
        "Email": "ddavislachaun@gmail.com",
        "status": "failed"
      }]
		},
	}

// {"smsSummary":[], emailSummary:{}}

const ScheduledRow = ({ index, _id, count, created, scheduled, status, type }) => {
  const [showReport, setShowReport] = useState(false);

  const handleReport = ()=>{
    setShowReport(true)
  }

  return (
    <>
      <TableRow key={_id}>
        <TableCell sx={{
          zIndex:1, textAlign: 'center' }}>{index + 1}</TableCell>
        <TableCell sx={{
          zIndex:1, textAlign: 'center' }}>
          {type === 'both' ? 'SMS and Email' : type.charAt(0).toUpperCase() + type.slice(1)}
        </TableCell>
        <TableCell sx={{
          zIndex:1, textAlign: 'center' }}>{count}</TableCell>
        <TableCell sx={{
          zIndex:1, textAlign: 'center' }}>
          <FormatDateToIST utcString={created} />
        </TableCell>
        <TableCell sx={{
          zIndex:1, textAlign: 'center' }}>
          {' '}
          <FormatDateToIST utcString={scheduled} />
        </TableCell>
        <TableCell sx={{
          zIndex:1, textAlign: 'center' }}>{status}</TableCell>
        <TableCell sx={{
          zIndex:1, textAlign: 'center' }}>
          {status === 'pending' ? (
            <Button
              variant="outlined"
              sx={{
                zIndex:1,
                backgroundColor: 'white', // White background to match the theme
                color: '#1976D2', // Blue text that matches your button color
                border: `1px solid #1976D2`, // Blue border for consistency
                textTransform: 'none',
                fontWeight: '500',
                padding: '6px 16px',
                '&:hover': {
                  backgroundColor: '#1976D2', // Blue background on hover
                  color: 'white' // White text on hover
                }
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                zIndex:1,
                backgroundColor: '#1976D2', // Blue that matches other buttons
                color: 'white',
                fontWeight: '500',
                padding: '6px 16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#115293' // A darker shade of blue on hover
                }
              }}
              onClick={()=>{handleReport()}}
            >
              Report
            </Button>
          )}
        </TableCell>
      </TableRow>

      {showReport && <Report resData={{smsSummary:samplaData.smsSummary, successfulEmails:samplaData.emailSummary.successfulEmails, failedEmails:samplaData.emailSummary.failedEmails}} handleClose = {setShowReport}/>}
    </>
  );
};

export default ScheduledRow;

const FormatDateToIST = ({ utcString }) => {
  const formatISTDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Kolkata' // Use the desired time zone
    };

    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  };

  return <span>{formatISTDate(utcString)}</span>;
};
