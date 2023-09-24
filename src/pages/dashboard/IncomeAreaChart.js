import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

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

const IncomeAreaChart = ({ slot }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);
  const mockData = {
    month: {
      emailSent: [350, 400, 320, 500, 420, 650, 380, 460, 420, 570, 630, 500],
      emailOpened: [320, 350, 290, 480, 400, 620, 360, 440, 390, 550, 590, 470]
    },
    week: {
      emailSent: [80, 90, 85, 88, 92, 87, 91],
      emailOpened: [76, 82, 81, 84, 89, 83, 88]
    }
  };
  
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: slot === 'month' 
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

    const dataForSlot = mockData[slot];
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


    // Fetching data from backend
    // fetch(`/email-data?slot=${slot}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     setSeries([
    //       {
    //         name: 'Emails Sent',
    //         data: data.emailSent
    //       },
    //       {
    //         name: 'Emails Opened',
    //         data: data.emailOpened
    //       }
    //     ]);
    //   })
    //   .catch(error => {
    //     console.error("Error fetching email data:", error);
    //   });
  }, [primary, secondary, line, theme, slot]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
