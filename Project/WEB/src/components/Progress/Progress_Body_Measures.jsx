import React, {useEffect, useState, useRef} from 'react'
import { Chart } from 'primereact/chart';
import Progress_Body_MeasuresAdd from './Progress_Body_MeasuresAdd';
import Dropdown from '../DropdownCollections';
import Progress_Body_MeasuresEdit from './Progress_Body_MeasuresEdit';
import { milestones } from '../DATA_MILESTONES';
import config from "../../utils/conf";
import { Galleria } from 'primereact/galleria';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Progress_Body_Measures({selectedUser}) {

  const [expandedRow, setExpandedRow] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [eliminatingMilestone, setEliminatingMilestone] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedMeasureToShow, setSelectedMeasureToShow] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);    
  const galleria = useRef(null);



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
    

        pdf.save(`mediciones-${formattedDate}-cliente-${selectedUser.nombre}-medida-${selectedMeasureToShow.label}.pdf`);
      })
      .catch(err => console.error("Error al capturar el PDF", err));
  };
  
  


  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      const data = {};
      const options = {
          stacked: false,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder
                  }
              },
              y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder
                  }
              }
          }
      };

      setChartData(data);
      setChartOptions(options);
  }, []);
  
  const handleRowClick = (milestone) => {

    if (expandedRow === milestone.ID_MedidasCorporales) {
      setExpandedRow(null);
      setEliminatingMilestone(null);
      setSelectedMilestone(null);
    } else {
      if (eliminatingMilestone && eliminatingMilestone !== milestone.ID_MedidasCorporales) {
      setEliminatingMilestone(null);
      setExpandedRow(null); 
      setSelectedMilestone(null);
      }
      setEliminatingMilestone(null);
      setExpandedRow(milestone.ID_MedidasCorporales);
      setSelectedMilestone(milestone); 
    }
  };

  const handleDeleteClick = (milestone) => {

    if (eliminatingMilestone && eliminatingMilestone.ID_MedidasCorporales === milestone.ID_MedidasCorporales) {
      setExpandedRow(null);
      setEliminatingMilestone(null);
      setSelectedMilestone(null);
    } else {
      if (expandedRow && expandedRow !== milestone.ID_MedidasCorporales) {
      setEliminatingMilestone(null);
      setExpandedRow(null); 
      setSelectedMilestone(null);
      }
      setExpandedRow(null);
      setSelectedMilestone(milestone); 
      setEliminatingMilestone(milestone);
    }
  };
  
  const handleAddClick = () => {
    setShowEditPage(false); 
    setShowAddPage(true); 
  };

  const handleEditClick = (milestone) => {
    setSelectedMilestone(milestone);
    setShowAddPage(false); 
    setShowEditPage(true); 
  };

  const handleBackToList = () => {
    setShowEditPage(false);
    setShowAddPage(false);
    fetchMilestones();
    fetchGraphData();
  };

  const handleDeleteMilestone = (milestone) => {
    deleteMilestone(milestone);
    setEliminatingMilestone(null);
    setSelectedMilestone(null);
    fetchMilestones();
    fetchGraphData();
  }

  const fetchMilestones = async () => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/allMilestones/${selectedUser.ID_Usuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            setMilestones(data);
            console.log("Mediciones cargadas", data);
        } else {
            console.error("Error al obtener las mediciones:", response.statusText);
        }
    } catch (error) {
        console.error("Error al obtener las mediciones:", error);
    }
};

  const fetchGraphData = async () => {
    if (!selectedMeasureToShow) {
      console.log("No se ha seleccionado una medida para mostrar");
      return;
    }
    
    try {
        const response = await fetch(`${config.apiBaseUrl}/allMilestones/${selectedUser.ID_Usuario}/${selectedMeasureToShow.value}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
          const { fechas, valores } = await response.json();
          console.log("Respuesta del backend:", { fechas, valores });
    
          // Actualiza los datos del gráfico
          setChartData({
            labels: fechas, // Las fechas van en el eje X
            datasets: [
              {
                label: selectedMeasureToShow.label,
                data: valores, // Los valores de la medida van en el eje Y
                fill: false,
                borderColor: '#0790cf',
                tension: 0.1,
              }
            ]
          });
          
          console.log("Datos del gráfico cargados", { fechas, valores });
        } else {
          console.error("Error al obtener las mediciones:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener las mediciones:", error);
      }
    };


    const deleteMilestone = async () => {
      try {
          const response = await fetch(`${config.apiBaseUrl}/allMilestones/${eliminatingMilestone.ID_MedidasCorporales}`, {
              method: "DELETE",
          });
  
          if (response.ok) {
            console.log("Hito eliminado correctamente");
          } else {
            console.error("Error al eliminar hito:", response.statusText);
          }
        } catch (error) {
          console.error("Error al obtener eliminar hito:", error);
        }
      };

  useEffect(() => {
    fetchMilestones();
    fetchGraphData();
    setSelectedMeasureToShow(null);
    setChartData({});
    setEliminatingMilestone(null);
    setShowAddPage(false);
    setShowEditPage(false);
  }, [selectedUser]);  

  useEffect(() => {
    if (!selectedMeasureToShow) {
      setChartData({});
    }
    fetchGraphData();
  },[selectedMeasureToShow]);

  useEffect(() => {
    console.log("Datos del gráfico actualizados", chartData);
  }, [chartData]);
  

  if (showAddPage) {
    return <Progress_Body_MeasuresAdd onBackToList={handleBackToList} selectedUser={selectedUser}/>;
  }

  if (showEditPage) {
    return <Progress_Body_MeasuresEdit onBackToList={handleBackToList} selectedUser={selectedUser} selectedMilestone={selectedMilestone}/>;
  }
  
  const measureOptions = [
    { label: "Cuello", value: "cuello" },
    { label: "Estatura", value: "estatura" },
    { label: "Peso", value: "peso" },
    { label: "IMC", value: "IMC" },
    { label: "Pecho", value: "pecho" },
    { label: "Hombro", value: "hombro" },
    { label: "Bicep", value: "bicep" },
    { label: "Antebrazo", value: "antebrazo" },
    { label: "Cintura", value: "cintura" },
    { label: "Cadera", value: "cadera" },
    { label: "Pantorilla", value: "pantorilla" },
    { label: "Muslo", value: "muslo" },
    { label: "Porcentaje de grasa", value: "porcentaje_grasa" },
    { label: "Masa muscular", value: "masa_muscular" },
    { label: "Presión arterial", value: "presion_arterial" },
    { label: "Ritmo cardiaco", value: "ritmo_cardiaco" },
  ];

  const handleMeasureToShowChange = (selectedOption) => {
    setSelectedMeasureToShow(selectedOption ?? null);
    console.log(selectedOption);
  };


  const itemTemplate = (item) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
  }

  const thumbnailTemplate = (item) => {
      return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: 'block' }} />;
  }

  return (
    <>
      <div className='MainContainer'>
      <div className='body-measure-container' id='capture'>
      <div className='body-measure-header'>
      <div className='body-dropdown-container'>
      <div>
      Selecciona una medida para ver la gráfica
      </div>
      <Dropdown 
            options={measureOptions} 
            selectedOption={selectedMeasureToShow} 
            onChange={handleMeasureToShowChange}
          />
      </div>
      <div className="row_edit">
        <i className={`bi bi-download card-icon`} onClick={downloadPdfDocument}></i>
      </div>
      </div>
      <Chart type="line" data={chartData} options={chartOptions} />
      </div>
      <div className='body-measure-container'>
      <div className="measures-list-container">
      <div className="measures-list-header">
            <h2 className=''>
            Lista de Hitos
            </h2>
            <div>
              <a className="iconadd" role="button" onClick={handleAddClick}><i className="bi bi-plus-circle-fill"></i></a>
            </div>
            </div>
            <ul className='cardcontainer cardcontainer2'>
            {milestones.map((milestone, milestoneIndex) => (
                <li className={`row ${((selectedMilestone && selectedMilestone.ID_MedidasCorporales === milestone.ID_MedidasCorporales)) ? 'selected' : ''}`} key={milestoneIndex} onClick={() => handleRowClick(milestone)}>
                  <div onClick={() => handleRowClick(milestone)} className={`row_header ${((selectedMilestone && selectedMilestone.ID_MedidasCorporales === milestone.ID_MedidasCorporales)) ? 'selected' : ''}`}>
                    <div>
                    <div className='row_description'>Fecha de creación:</div>
                      <div className='row_name'>{milestone.fecha}</div>
                    </div>
                    <div className="row_buttons">
                      <div className="row_edit">
                          <i className={`bi bi-trash card-icon ${eliminatingMilestone && eliminatingMilestone.ID_MedidasCorporales === milestone.ID_MedidasCorporales ? 'selected' : ''}`} onClick={(e) => { setSelectedMilestone(milestone); e.stopPropagation(); handleDeleteClick(milestone); }}></i>
                      </div>
                      <div className="row_edit">
                        <i className={`bi bi-pencil-square card-icon`} onClick={(e) => { e.stopPropagation(); handleEditClick(milestone); }}></i>
                      </div>
                  </div>
                  </div>
                  {expandedRow === milestone.ID_MedidasCorporales && (
                  <>
                  <div className='milestone-container'>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                      <div className="exercise-info-row"><h5>Datos biométricos</h5></div>
                        <div className="exercise-info-row">Peso: {milestone.peso}</div>
                        <div className="exercise-info-row">Estatura: {milestone.estatura}</div>
                        <div className="exercise-info-row">IMC: {milestone.IMC}</div>
                        <div className="exercise-info-row">Masa muscular neta: {milestone.masa_muscular}</div>
                        <div className="exercise-info-row">% de grasa: {milestone.porcentaje_grasa}</div>
                      <div className="exercise-info-row">Ritmo cardiaco en reposo: {milestone.ritmo_cardiaco}</div>
                      <div className="exercise-info-row">Presión arterial: {milestone.presion_arterial}</div>
                      </div>
                      <div className="exercise-info-column">
                      <div className="exercise-info-row"><h5>Medidas corporales</h5></div>
                        <div className="exercise-info-row">Cuello: {milestone.cuello} cm</div>
                        <div className="exercise-info-row">Pecho: {milestone.pecho} cm</div>
                        <div className="exercise-info-row">Cintura: {milestone.cintura} cm</div>
                        <div className="exercise-info-row">Cadera: {milestone.cadera} cm</div>
                      <div className="exercise-info-row">Hombros: {milestone.hombros} cm</div>
                      <div className="exercise-info-row">Bicep: {milestone.bicep} cm</div>
                      <div className="exercise-info-row">Antebrazos: {milestone.antebrazo} cm</div>
                      <div className="exercise-info-row">Muslos: {milestone.muslo} cm</div>
                      <div className="exercise-info-row">Pantorrilla: {milestone.pantorrilla} cm</div>
                      </div>
                      </div>
                      <div className="images-container2 flex justify-content-center">
                        <Galleria ref={galleria} value={[{itemImageSrc: selectedMilestone.foto_frente, thumbnailImageSrc: selectedMilestone.foto_frente},{itemImageSrc: selectedMilestone.foto_lado, thumbnailImageSrc: selectedMilestone.foto_lado},{itemImageSrc: selectedMilestone.foto_espalda, thumbnailImageSrc: selectedMilestone.foto_espalda} ]} numVisible={7} style={{ maxWidth: '850px' }}
                        activeIndex={activeIndex} onItemChange={(e) => setActiveIndex(e.index)}
                        circular fullScreen showItemNavigators showThumbnails={false} item={itemTemplate} thumbnail={thumbnailTemplate} />
                        <div className="grid" style={{ maxWidth: '400px' }}>
                            {
                              [{itemImageSrc: selectedMilestone.foto_frente, thumbnailImageSrc: selectedMilestone.foto_frente},{itemImageSrc: selectedMilestone.foto_lado, thumbnailImageSrc: selectedMilestone.foto_lado},{itemImageSrc: selectedMilestone.foto_espalda, thumbnailImageSrc: selectedMilestone.foto_espalda} ] && [{itemImageSrc: selectedMilestone.foto_frente, thumbnailImageSrc: selectedMilestone.foto_frente},{itemImageSrc: selectedMilestone.foto_lado, thumbnailImageSrc: selectedMilestone.foto_lado},{itemImageSrc: selectedMilestone.foto_espalda, thumbnailImageSrc: selectedMilestone.foto_espalda} ].map((image, index) => {
                                    let imgEl = <img src={image.thumbnailImageSrc} alt={image.alt} style={{ cursor: 'pointer', height:"100px", width:"100px" }} onClick={
                                        () => {setActiveIndex(index); galleria.current.show()}
                                    } />
                                    return (
                                        <div className="col-3" key={index}>
                                            {imgEl}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    </div>
                  </>
                )}
                {eliminatingMilestone && eliminatingMilestone.ID_MedidasCorporales === milestone.ID_MedidasCorporales && (
                  <>
                  <div className="exercise-info">
                  <button className='delete_button' onClick={(e) => { e.stopPropagation(); handleDeleteMilestone()}}>Eliminar hito</button>
                  </div>
                  </>
                )}
          </li>
        ))}
        </ul>
      </div>
      </div>
      </div>
    </>
  )
}


