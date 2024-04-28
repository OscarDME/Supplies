import React, {useState} from 'react';
import "../styles/ToolTip.css"

export const ToolTipInfo = ({message,children}) => {

    const [isVisible, setVisible] = useState(false)
  return (
    <div className="tooltip-container"
    onMouseEnter={()=> setVisible(true)}
    onMouseLeave={()=> setVisible(false)}>
    {children}
        {isVisible && <div className='tooltip-box'>
        <div> 
        {message}
        </div>
        </div>}
    </div>

  )
}
