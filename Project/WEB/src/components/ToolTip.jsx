import React, {useState} from 'react';
import "../styles/ToolTip.css"

export const ToolTip = ({muscles,difficulty,material,type,children}) => {

    const [isVisible, setVisible] = useState(false)
  return (
    <div className="tooltip-container"
    onMouseEnter={()=> setVisible(true)}
    onMouseLeave={()=> setVisible(false)}>
    {children}
        {isVisible && <div className='tooltip-box'>
        <div> 
        Dificultad: {difficulty}
        </div>
        <div>
        Músculos que trabaja: {muscles}
        </div>
        <div>
        Material: {material}
        </div>
        <div>
        Tipo de ejercicio: {type}
        </div>
        </div>}
    </div>

  )
}
