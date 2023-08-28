import React from 'react'
import Personnel from '../Personnel/Personnel'
import { useState } from 'react'

const Correspondence = () => {

  const [isCorrespondence] = useState(true)  

  return (
    <>
      <div>
        <Personnel isCorres={isCorrespondence}/>
      </div>
    </>
  )

}

export default Correspondence