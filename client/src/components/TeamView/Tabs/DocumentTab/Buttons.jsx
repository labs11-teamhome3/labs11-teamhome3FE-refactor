import React from 'react'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'; 

export default props => 
  <div className='buttons fadein'>
    
    <div style={{display:'flex', alignItems:'center'}}>
      <label htmlFor='single'>
        <CloudUploadIcon style={{marginRight: '10px'}} />
      </label>
      <input type='file' accept="image/png, image/jpeg, image/gif, application/pdf" id='single' onChange={props.onChange} /> 
    </div>

  </div>