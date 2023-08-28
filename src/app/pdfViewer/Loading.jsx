import React from 'react'
import "./App.css"
import { CircularProgress } from '@material-ui/core'

const Loading = () => {
  return (
    <div className='pdf-loading'>
        <CircularProgress className="loading-icon-pdf" />
    </div>
  )
}

export default Loading