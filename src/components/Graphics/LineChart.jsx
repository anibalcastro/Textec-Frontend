import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale, //x axis
    LinearScale, //y axis
    PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineChart = ({ fechas = [], datosVentas = [] }) => {

    const data = {
        labels: fechas,
        datasets: [{
            labels: 'Ventas',
            data: datosVentas,
            backgroundColor:'aqua',
            borderColor : 'black',
            pointBorderColor: 'aqua',
            fill: true,
            tension: 0.4
        }],
    };

    const options = {
        plugins: {
            legend: true
        },
        scales : {
            y : {
               //min:3, 
                //max: 6
            }
        }
    }

    return (
        <div className="chart-container">
            <h2>Gráfico de Ventas</h2>
            <Line className="grafico" data={data} options={options}></Line>
        </div>
    );
};

export default LineChart;
