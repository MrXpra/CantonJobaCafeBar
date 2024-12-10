import React from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../../../config/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SalesChart() {
  const [salesData, setSalesData] = React.useState({
    labels: [],
    datasets: []
  });

  React.useEffect(() => {
    const fetchWeeklySales = async () => {
      try {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);

        const { data: orders, error } = await supabase
          .from('orders')
          .select('created_at, total_price')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (error) throw error;

        const dailySales = new Array(7).fill(0);
        const labels = new Array(7).fill('').map((_, i) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          return days[date.getDay()];
        });

        orders?.forEach(order => {
          const orderDate = new Date(order.created_at);
          const dayIndex = Math.floor((orderDate - startDate) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < 7) {
            dailySales[dayIndex] += order.total_price || 0;
          }
        });

        setSalesData({
          labels,
          datasets: [
            {
              label: 'Ventas ($)',
              data: dailySales,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchWeeklySales();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Line data={salesData} options={options} />;
}

export default SalesChart;