// chart options

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts'; // Assuming this is how you import it
import { getSMSReport } from 'store/reports/reportsThunk';
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  grid: {
    show: false
  }
};

const MonthlyBarChart = ({ refresh, setRefresh }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const smsData = useSelector((state) => state.reports.smsData); // Using a selector just like in the IncomeAreaChart

  const [options, setOptions] = useState(barChartOptions);
  const [series, setSeries] = useState([{ name: 'SMS Count', data: smsData }]);

  useEffect(() => {

    if (refresh) {
      dispatch(getSMSReport()).then((action) => {
        if (getSMSReport.fulfilled.match(action)) {
          const response = action.payload.report;
          if (response) {
            setSeries([{ name: 'SMS Count', data: response }]);
          }
        }
      });
      setRefresh(false);
    }
    else if (smsData && smsData.length > 0) {
      setSeries([{ name: 'SMS Count', data: smsData }]);
    } else {
      const localStorageData = JSON.parse(localStorage.getItem('smsData'));

      if (localStorageData) {
        setSeries([{ name: 'SMS Count', data: localStorageData }]);
      }  else {
        dispatch(getSMSReport()).then((action) => {
          if (getSMSReport.fulfilled.match(action)) {
            const response = action.payload.report;
            if (response) {
              setSeries([{ name: 'SMS Count', data: response }]);
            }
          }
        });
      }
    }
  }, [dispatch, smsData, refresh]);

  useEffect(() => {
    const { secondary } = theme.palette.text;
    const info = theme.palette.info.light;

    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [theme]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={415} width={"100%"} />
    </div>
  );
};

export default MonthlyBarChart;
