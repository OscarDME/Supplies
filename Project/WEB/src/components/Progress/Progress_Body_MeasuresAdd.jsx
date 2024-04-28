import React, {useEffect, useState, useRef} from 'react'
import { InputNumber } from 'primereact/inputnumber';
import config from "../../utils/conf";
import { Galleria } from 'primereact/galleria';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Progress_Body_MeasuresAdd({onBackToList, selectedUser}) {
  const [weight, setWeight] = useState(null);
  const [fat, setFat] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [muscleMass, setMuscleMass] = useState(null);
  const [bloodPressure, setBloodPressure] = useState(null);
  const [neckCircumference, setNeckCircumference] = useState(null);
  const [hipCircumference, setHipCircumference] = useState(null);
  const [waistCircumference, setWaistCircumference] = useState(null);
  const [chestCircumference, setChestCircumference] = useState(null);
  const [bicepsCircumference, setBicepsCircumference] = useState(null);
  const [shoulderCircumference, setShoulderCircumference] = useState(null);
  const [forearmsCircumference, setForearmsCircumference] = useState(null);
  const [CuadricepsiCircumference, setCuadricepsCircumference] = useState(null);
  const [calfCircumference, setCalfCircumference] = useState(null);
  const [height, setHeight] = useState(null);
  const [IMC, setIMC] = useState(null);
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);    
  const galleria = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar el envío del formulario de forma predeterminada
  
    // Verificar que ningún campo se encuentre vacío
    const allMeasures = [
      weight, fat, pulse, muscleMass, bloodPressure,
      neckCircumference, hipCircumference, waistCircumference,
      chestCircumference, bicepsCircumference, shoulderCircumference,
      forearmsCircumference, CuadricepsiCircumference, calfCircumference
    ];
  
    if (allMeasures.some(measure => measure === null)) {
      alert("Todos los campos deben ser completados.");
      return;
    }
  
    // Validaciones específicas
    if (weight >= 300) {
      alert("El peso debe ser menor a 300 kg.");
      return;
    }
  
    if (fat < 0 || fat > 100) {
      alert("El porcentaje de grasa debe estar entre 0% y 100%");
      return;
    }
  
    if (muscleMass < 0 || muscleMass > 100) {
      alert("La masa muscular neta debe estar entre 0 y 100.");
      return;
    }
  
    if (pulse < 0 || pulse > 300) {
      alert("El ritmo cardíaco en reposo debe estar entre 0 bpm y 300 bpm");
      return;
    }
  
    if (bloodPressure < 0 || bloodPressure > 300) {
      alert("La presión arterial debe estar entre 0 y 300.");
      return;
    }
  
    const bodyMeasures = [
      neckCircumference, hipCircumference, waistCircumference,
      chestCircumference, bicepsCircumference, shoulderCircumference,
      forearmsCircumference, CuadricepsiCircumference, calfCircumference
    ];
  
    if (bodyMeasures.some(measure => measure < 0 || measure > 200)) {
      alert("Todas las medidas corporales deben estar entre 0 y 200 cm.");
      return;
    }

    const image1 = images.length > 0 ? images[0].itemImageSrc : null;
    const image2 = images.length > 1 ? images[1].itemImageSrc : null;
    const image3 = images.length > 2 ? images[2].itemImageSrc : null;
    console.log(image1);

    const bodyMeasurementsData = {
      porcentaje_grasa: fat,
      masa_muscular: muscleMass,
      presion_arterial: bloodPressure,
      ritmo_cardiaco: pulse,
      cuello: neckCircumference,
      pecho: chestCircumference,
      hombro: shoulderCircumference,
      bicep: bicepsCircumference,
      antebrazo: forearmsCircumference,
      cintura: waistCircumference,
      cadera: hipCircumference,
      pantorrilla: calfCircumference,
      muslo: CuadricepsiCircumference,
      fecha: new Date().toISOString(),
      ID_UsuarioMovil: selectedUser.ID_Usuario,
      estatura: height,
      peso: weight,
      IMC: IMC,
      foto_frente: image1,
      foto_lado: image2,
      foto_espalda: image3
    };

      console.log(bodyMeasurementsData);
      try {
        const response = await fetch(`${config.apiBaseUrl}/createMilestone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyMeasurementsData),
        });
  
        if (!response.ok) {
          throw new Error("Algo salió mal al guardar el Hito.");
        }
  
        // Respuesta del servidor
        const result = await response.json();
        console.log(result);
        alert("Hito añadido con éxito.");

        onBackToList(); 
      } catch (error) {
        console.error("Error al guardar el Hito:", error);
        alert("Error al guardar el Hito.");
      }
  }
  

  useEffect(() => {
    setIMC(weight/((height)**2));
  }, [weight, height]);


  const uploadFiles = async (files) => {
    const storage = getStorage();
    files.forEach(async (file) => {
      const storageRef = ref(storage, 'progress-images/' + file.name);
      await uploadBytes(storageRef, file).then(snapshot => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImages(images => [...images, {itemImageSrc: downloadURL, thumbnailImageSrc: downloadURL}]); 
        });
      });
    });
  };


  const handleDragOver = (e) => {
    console.log("DragOver");
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => {
      console.log(file.type);
      if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png" && file.size <= 3000000) return true;
      return false;
    });
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

    const itemTemplate = (item) => {
        return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: 'block' }} />;
    }

  return (
    <div className='container3 MainContainer'
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
    >
      <div className='add_header2'>
        <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
        <h1 className='mtitle'>Agregar un hito de progreso</h1>
      </div>
      <form className="form_add_exercise" onSubmit={handleSubmit}>
        <div className="add_exercise_area">
          <div>
            <div className="add_exercise_rows">
              Peso
              <InputNumber value={weight} onValueChange={(e) => setWeight(e.target.value)} maxFractionDigits={2} max={300} min={1} suffix='kg' />
            </div>
            <div className="add_exercise_rows">
              Altura
              <InputNumber value={height} onValueChange={(e) => setHeight(e.target.value)} maxFractionDigits={2} max={300} min={1} suffix='m' />
            </div>
            <div className="add_exercise_rows">
              IMC
              <InputNumber value={IMC} onValueChange={(e) => setIMC(e.target.value)} maxFractionDigits={2} max={300} min={1} disabled />
            </div>
            <div className="add_exercise_rows">
              % de grasa
              <InputNumber value={fat} onValueChange={(e) => setFat(e.target.value)} maxFractionDigits={2} max={100} min={1} suffix='%' />
            </div>
            <div className="add_exercise_rows">
              Ritmo cardiaco en reposo
              <InputNumber value={pulse} onValueChange={(e) => setPulse(e.target.value)} max={300} min={1} suffix='bpm' />
            </div>
          </div>
          <div>
          <div className="add_exercise_rows">
              Presión arterial
              <InputNumber value={bloodPressure} onValueChange={(e) => setBloodPressure(e.target.value)} max={300} min={1} suffix='mm Hg' />
            </div>
            <div className="add_exercise_rows">
              Masa muscular neta
              <InputNumber value={muscleMass} onValueChange={(e) => setMuscleMass(e.target.value)} maxFractionDigits={2} max={100} min={1} suffix='kg' />
            </div>
            <div className="add_exercise_rows">
              Cuello
              <InputNumber value={neckCircumference} onValueChange={(e) => setNeckCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Pecho
              <InputNumber value={chestCircumference} onValueChange={(e) => setChestCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Cintura
              <InputNumber value={waistCircumference} onValueChange={(e) => setWaistCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
          </div>
          <div>
          <div className="add_exercise_rows">
              Cadera
              <InputNumber value={hipCircumference} onValueChange={(e) => setHipCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Hombros
              <InputNumber value={shoulderCircumference} onValueChange={(e) => setShoulderCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Bicep
              <InputNumber value={bicepsCircumference} onValueChange={(e) => setBicepsCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Antebrazo
              <InputNumber value={forearmsCircumference} onValueChange={(e) => setForearmsCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
            <div className="add_exercise_rows">
              Muslos
              <InputNumber value={CuadricepsiCircumference} onValueChange={(e) => setCuadricepsCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>
          </div>
          <div>
          <div className="add_exercise_rows">
              Pantorrilla
              <InputNumber value={calfCircumference} onValueChange={(e) => setCalfCircumference(e.target.value)} maxFractionDigits={2} max={200} min={1} suffix='cm' />
            </div>

            <div className="add_exercise_rows">
            {/*Dont ask about this text, i know is wrong to do this, i just dont care atm :)*/}
            <div>
              Para agregar Imágenes de progreso:
            </div>
            <div>arrastre y suelte la imagen en cualquier</div>
            <div>lugar de la pantalla, puede agregar hasta  </div>
            <div>3 imágenes, y estas no se podrán </div>
            <div>borrar una vez las hayas agregado.</div>
            <div className="images-container flex justify-content-center">
            <Galleria ref={galleria} value={images} numVisible={7} style={{ maxWidth: '850px' }}
            activeIndex={activeIndex} onItemChange={(e) => setActiveIndex(e.index)}
            circular fullScreen showItemNavigators showThumbnails={false} item={itemTemplate} thumbnail={thumbnailTemplate} />
            <div className="grid" style={{ maxWidth: '400px' }}>
                {
                    images && images.map((image, index) => {
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

          </div>
        </div>
        <button type="submit" className="add_button">
          Guardar hito
        </button>
      </form>
    </div>
  )
}
