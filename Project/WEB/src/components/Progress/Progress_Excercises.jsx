import React, {useEffect, useState} from 'react'
//import ".../styles/WhiteBoard.css";
import { Chart } from 'primereact/chart';
import Dropdown from '../DropdownCollections';
import config from "../../utils/conf";
import { useMsal } from "@azure/msal-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Progress_Excercises() {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  console.log(activeAccount.idTokenClaims.oid);

  const [chartData, setChartData] = useState({});
  useEffect(() => {
    // Inicialización con datasets vacíos
    setChartData({
      labels: [],
      datasets: [
        {
          label: 'Peso levantado',
          borderColor: 'rgba(255, 99, 132, 1)', // Usa el color que prefieras
          data: []
        },
        {
          label: '1RM',
          borderColor: 'rgba(54, 162, 235, 1)', // Usa el color que prefieras
          data: []
        },
        {
          label: 'Predicción1RM',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderDash: [5, 5],
          data: [],
        },
      ]
    });
  }, []);
  const [chartOptions, setChartOptions] = useState({});
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseLoads, setExerciseLoads] = useState([]);
  const [rmPredictions, setRmPredictions] = useState([]);
  const [rms, setRms] = useState([]);

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
        const data = await response.json();
        // Transformar datos si es necesario para que coincidan con lo esperado por SelectList
        const ejerciciosTransformados = data.map((ejercicio) => ({
          value: ejercicio.ID_Ejercicio.toString(),
          label: ejercicio.ejercicio,
          type: ejercicio.Modalidad,
        }));
        setEjercicios(ejerciciosTransformados);
      } catch (error) {
        console.error("Error al obtener los ejercicios:", error);
      }
    };

    fetchEjercicios();
  }, []);

  
  useEffect(() => {
    if (selectedExercise) {
      const ID_Usuario = activeAccount.idTokenClaims.oid; // Asume que esto obtiene el ID del usuario
      const ID_Ejercicio = selectedExercise.value;
      const escala = 'seisMeses'; // Hardcodeado para siempre usar seis meses

      const fetchExerciseLoads = async () => {
        try {
          const url = `${config.apiBaseUrl}/Weights/${ID_Usuario}/${ID_Ejercicio}/${escala}`;
          const response = await fetch(url);
          const data = await response.json();

          // Transforma y actualiza los datos para el gráfico
          const updatedChartData = { ...chartData }; // Copia el estado actual de chartData
          updatedChartData.labels = data.map(entry => entry.fecha);
          updatedChartData.datasets[0].data = data.map(entry => entry.PesoMaximo); // Asume el primer dataset es 'Peso levantado'
          setChartData(updatedChartData);
        } catch (error) {
          console.error("Error al obtener los pesos máximos:", error);
        }
      };

      fetchExerciseLoads();
    }
  }, [selectedExercise]);

  useEffect(() => {
    const fetchWeights = async () => {
      if (selectedExercise) {
        // Obtén el ID del usuario de alguna manera, aquí estamos utilizando MSAL
        const ID_Usuario = activeAccount.idTokenClaims.oid;
        const ID_Ejercicio = selectedExercise.value;
        const escala = 'seisMeses'; // Predefinido a seis meses como requerido
  
        try {
          const url = `${config.apiBaseUrl}/HistoricalRMs/${ID_Usuario}/${ID_Ejercicio}/${escala}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('La solicitud a la API falló');
          }
          const data = await response.json();
  
          // Asignar los datos recibidos al estado para actualizar el gráfico
          const newChartData = { ...chartData };
          newChartData.labels = data.map(entry => entry.fecha);
          // Asumiendo que el dataset[0] es para 'Peso levantado'
          newChartData.datasets[1].data = data.map(entry => entry.RM);
          setChartData(newChartData);
        } catch (error) {
          console.error('Error al obtener los pesos máximos:', error);
        }
      }
    };
  
    fetchWeights();
  }, [selectedExercise]);

  useEffect(() => {
    if (selectedExercise) {
      const ID_Usuario = activeAccount.idTokenClaims.oid;
      const ID_Ejercicio = selectedExercise.value;
  
      const fetchHistoricalRMData = async () => {
        const url = `${config.apiBaseUrl}/HistoricalRM/${ID_Usuario}/${ID_Ejercicio}`;
  
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch historical RM data');
          }
          const rmData = await response.json();
  
          // Calcular las predicciones como antes
          let L = rmData[0]?.Max1RM ?? 0; // Nivel inicial
          let T = (rmData[1]?.Max1RM - L) ?? 0; // Tendencia inicial
          const alpha = 0.9; // Factor de suavizado para el nivel
          const beta = 0.6; // Factor de suavizado para la tendencia
  
          rmData.forEach((_, index) => {
            if (index >= 1) {
              const actual = rmData[index].Max1RM;
              let Lt = L;
              L = alpha * actual + (1 - alpha) * (Lt + T);
              T = beta * (L - Lt) + (1 - beta) * T;
            }
          });
  
          // Suponiendo que quieres predecir los siguientes 3 meses
          const predictions = Array.from({ length: 3 }, (_, i) => L + (i + 1) * T);
          console.log(predictions);
  
          // Generar etiquetas para los próximos tres meses
          const lastDate = new Date(rmData[rmData.length - 1]?.fecha);
          const predictionLabels = Array.from({ length: 3 }, (_, i) => {
            const futureDate = new Date(lastDate.setMonth(lastDate.getMonth() + 1));
            return `${futureDate.getFullYear()}-${futureDate.getMonth() + 1}`;
          });
  
          setChartData(prevChartData => {
            const updatedLabels = [...prevChartData.labels, ...predictionLabels];
            return {
              ...prevChartData,
              labels: updatedLabels,
              datasets: [
                ...prevChartData.datasets.slice(0, 2), // Mantener los primeros 2 datasets como están
                {
                  ...prevChartData.datasets[2], // Actualizar el tercer dataset con las predicciones
                  data: [...Array(prevChartData.labels.length - 1).fill(null), ...predictions] // Rellenar con null hasta las predicciones
                }
              ]
            };
          });
        } catch (error) {
          console.error("Error fetching historical RM data:", error);
        }
      };
  
      fetchHistoricalRMData();
    }
  }, [selectedExercise]);
  
//   useEffect(() => {
//     const documentStyle = getComputedStyle(document.documentElement);
//     const textColor = documentStyle.getPropertyValue('--text');
//     const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
//     const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
//     const data = {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',],
//         datasets: [
//             {
//                 label: 'Peso levantado',
//                 fill: false,
//                 borderColor: documentStyle.getPropertyValue('--accent'),
//                 yAxisID: 'y',
//                 tension: 0.4,
//                 data: [65, 59,null,null, 56, 55, 10]
//             },
//             {
//               label: '1RM',
//               fill: false,
//               borderColor: documentStyle.getPropertyValue('--primary'),
//               yAxisID: 'y',
//               tension: 0.4,
//               data: [65, 5, 8, 81, 56, 55, 10]
//           },
//           {
//             label: 'Predicción 1RM',
//             fill: false,
//             borderDash: [5, 5],
//             borderColor: documentStyle.getPropertyValue('--primary'),
//             yAxisID: 'y',
//             tension: 0.4,
//             data: [65, 55, 10,10,15,123,53]
//         }
//         ]
//     };
//     const options = {
//         stacked: false,
//         maintainAspectRatio: false,
//         aspectRatio: 0.6,
//         plugins: {
//             legend: {
//                 labels: {
//                     color: textColor
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 ticks: {
//                     color: textColorSecondary
//                 },
//                 grid: {
//                     color: surfaceBorder
//                 }
//             },
//             y: {
//                 type: 'linear',
//                 display: true,
//                 position: 'left',
//                 ticks: {
//                     color: textColorSecondary
//                 },
//                 grid: {
//                     color: surfaceBorder
//                 }
//             }
//         }
//     };

//     setChartData(data);
//     setChartOptions(options);
// }, []);

const exercisesOptions = [
    { label: "Cuello", value: 1 },
    { label: "Bicep", value: 2 },
    { label: "Cintura", value: 3 },
    { label: "Cadera", value: 4 },
    { label: "Pecho", value: 5 },
    { label: "Muslo", value: 6 },
  ];

  const handleExerciseToShowChange = (selectedOption) => {
    setSelectedExercise(selectedOption ?? null);
    console.log(selectedOption);
  };

  const downloadPdfDocument = () => {
    const input = document.getElementById('capture');
    if (!input) {
      console.error('No se encontró el elemento para capturar');
      return;
    }
  
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait', 
          unit: 'pt',
          format: 'a4'
        });
  
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Ajustar la imagen a la página
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        // Comprobar si la altura ajustada es mayor que la altura de la página
        if (imgHeight > pdfHeight) {
          // Si es mayor, ajustar el ancho basado en la altura de la página para mantener la proporción
          const imgWidthNew = (imgWidth * pdfHeight) / imgHeight;
          const marginLeft = (pdfWidth - imgWidthNew) / 2; // Para centrar horizontalmente
          pdf.addImage(imgData, 'PNG', marginLeft, 0, imgWidthNew, pdfHeight);
        } else {
          // Si la altura ajustada es menor o igual, usar la altura y ancho ajustados
          const marginTop = (pdfHeight - imgHeight) / 2; // Para centrar verticalmente
          pdf.addImage(imgData, 'PNG', 0, marginTop, imgWidth, imgHeight);
        }
  
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('es-ES').replace(/\//g, '-');
    

        pdf.save(`mediciones-${formattedDate}-cliente-${activeAccount.idTokenClaims.oid}-medida-${selectedExercise.label}.pdf`);
      })
      .catch(err => console.error("Error al capturar el PDF", err));
  };
  

  return (
    <div className='MainContainer progress-exercise-container' id='capture'>
    <div className='body-measure-header'>
    <div className='body-dropdown-container'>
          <div className='body-dropdown-container'>
      <div>
      Selecciona un ejercicio para ver la gráfica
      </div>

      </div>
      <Dropdown 
            options={ejercicios} 
            selectedOption={selectedExercise} 
            onChange={handleExerciseToShowChange}
          />
          </div>
          <div className="row_edit">
        <i className={`bi bi-download card-icon`} onClick={downloadPdfDocument}></i>
      </div>
      </div>
          <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  )
}