import React from 'react';
import '../../../styles/Management.css';
import { Image } from 'primereact/image';
import config from "../../../utils/conf";

export default function RequestTrainersNutricionistAdd({ user }) {


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Preparar los datos para enviar a la API
    const userData = {
        ID_Solicitud_WEB: user.ID_Solicitud_WEB,
    };

    try {
        const response = await fetch(`${config.apiBaseUrl}/acceptandcreatetrainer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('La solicitud a la API falló');
        }

        const result = await response.json();
        console.log(result);
        alert('Entrenador/nutricionista aceptado con éxito');

        // Opcional: Redirigir o actualizar la vista después de la operación exitosa

    } catch (error) {
        console.error('Error al enviar los datos a la API:', error);
        alert('Hubo un error al aceptar el entrenador/nutricionista. Por favor, intenta de nuevo.');
    }
};

  // Función para manejar la descarga del PDF
  const handleDownloadPdf = () => {
    if(user.titulos) {
      // Crear un URL para el Blob
      const url = user.titulos;
      // Crear un elemento <a> temporal para simular el clic de descarga
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificado-${user.nombre}.pdf`);
      // Añadir el elemento al DOM, clickearlo y luego removerlo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No hay un certificado disponible para descargar.');
    }
  };


  return (
    <div className='container-edit'>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
          <div className="exercise-info">
            <div className="exercise-info-column">
              <div className="exercise-info-row">
                <Image src={user.foto_perfil} alt="Foto de perfil" width="250" height='350' preview />
              </div>
            </div>
            <div className="exercise-info-column">
              <div className="exercise-info-row">Email: {user.correo}</div>
              <div className="exercise-info-row">Nacimiento: {new Date(user.fecha_nacimiento.split('T')[0]).toLocaleDateString()}</div>
              <div className="exercise-info-row">
                Certificado: <button type="button" className='button-add' onClick={handleDownloadPdf}>Descargar PDF</button>
              </div>
              <div className="exercise-info-row">Experiencia: {user.experiencia_laboral}</div>
            </div>
          </div>
        </div>
        <button type="submit" className='add_button'>Aceptar nuevo {user.tipo_servicio}</button>
      </form>
    </div>
  );
}
