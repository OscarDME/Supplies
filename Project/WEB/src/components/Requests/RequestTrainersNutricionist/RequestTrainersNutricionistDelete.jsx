import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import config from "../../../utils/conf";


export default function RequestTrainersNutricionistDelete({ user }) {

    const [reason, setReason] = useState('');

    const handleReasonChange = (event) => setReason(event.target.value);

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!reason) { 
          alert('Debe escribir una razón para rechazar la solicitud.');
          return;
      }

      try {
          const response = await fetch(`${config.apiBaseUrl}/deletesolicitud1/${user.ID_Solicitud_WEB}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          if (!response.ok) {
              throw new Error('La solicitud no pudo ser rechazada.');
          }

          alert('Solicitud rechazada correctamente.');
          //TODO: Actualizar la lista de solicitudes o redirigir al usuario según sea necesario
      } catch (error) {
          console.error('Error al rechazar la solicitud:', error);
          alert('Ocurrió un error al rechazar la solicitud.');
      }
  };

    return (
        <div className='container-edit'>
            <form className='form_add_exercise' onSubmit={handleSubmit}>
                <div className='add_exercise_area'>
                    <div className="exercise-info">
                        <div className="exercise-info-column">
                            <div className="exercise-info-row">
                                {/*Foto de perfil: Agrega la lógica para mostrar la foto de perfil aquí*/}
                            </div>
                        </div>
                        <div className="exercise-info-column">
                            <div className="exercise-info-row">Email: {user.correo}</div>
                            <div className="exercise-info-row">Nacimiento: {new Date(user.fecha_nacimiento.split('T')[0]).toLocaleDateString()}</div>
                            <div className="exercise-info-row">Certificado: <a href={user.titulos} target="_blank" rel="noopener noreferrer">Ver certificado</a></div>
                            <div className="exercise-info-row">Experiencia: {user.experiencia_laboral}</div>
                        </div>
                    </div>
                </div>
                <div className='add_exercise_rows2'>
                    Razón de rechazo:
                    <textarea className='add_exercise_textarea' value={reason} onChange={handleReasonChange}></textarea>
                </div>
                <button type="submit" className='delete_button'>Rechazar solicitud</button>
            </form>
        </div>
    );
}
