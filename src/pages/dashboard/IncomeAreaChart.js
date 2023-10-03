import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getEmailReport } from 'store/reports/reportsThunk';
import { useSelector } from '../../../node_modules/react-redux/es/exports';
import { selectMonthlyEmailReport, selectWeeklyEmailReport } from 'store/reports/reportsSlice';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

const IncomeAreaChart = ({ slot, refresh, setRefresh }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);

  const dispatch = useDispatch();

  const dataForSlot = useSelector(slot === 'month' ? selectMonthlyEmailReport : selectWeeklyEmailReport);

  useEffect(() => {
    console.log(dataForSlot);
    console.log(dataForSlot && Object.keys(dataForSlot).length === 0);
    if (refresh) {
      dispatch(getEmailReport(slot)).then((action) => {
        // Checking if the action was fulfilled
        if (getEmailReport.fulfilled.match(action)) {
          const response = action.payload.report;
          if (response?.emailSent && response?.emailOpened) {
            setSeries([
              {
                name: 'Emails Sent',
                data: response.emailSent
              },
              {
                name: 'Emails Opened',
                data: response.emailOpened
              }
            ]);
          }
        }
      });
      setRefresh(false);
    } else if (dataForSlot && Object.keys(dataForSlot).length === 0) {
      const localStorageData = JSON.parse(localStorage.getItem(slot));

      if (localStorageData && localStorageData.emailSent && localStorageData.emailOpened) {
        setSeries([
          {
            name: 'Emails Sent',
            data: localStorageData.emailSent
          },
          {
            name: 'Emails Opened',
            data: localStorageData.emailOpened
          }
        ]);
      } else {
        dispatch(getEmailReport(slot)).then((action) => {
          // Checking if the action was fulfilled
          if (getEmailReport.fulfilled.match(action)) {
            const response = action.payload.report;
            if (response?.emailSent && response?.emailOpened) {
              setSeries([
                {
                  name: 'Emails Sent',
                  data: response.emailSent
                },
                {
                  name: 'Emails Opened',
                  data: response.emailOpened
                }
              ]);
            }
          }
        });
      }
    } else {
      setSeries([
        {
          name: 'Emails Sent',
          data: dataForSlot.emailSent
        },
        {
          name: 'Emails Opened',
          data: dataForSlot.emailOpened
        }
      ]);
    }
  }, [slot, dispatch, dataForSlot, refresh]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories:
          slot === 'month'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: new Array(12).fill(secondary)
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [primary, secondary, line, theme, slot]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
