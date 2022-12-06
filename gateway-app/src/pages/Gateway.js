import React, { useState, useEffect } from 'react'
import api from '../api/api'

import { useSearchParams } from 'react-router-dom'

const Gateway = () => {
  const [queryParams] = useSearchParams()
  const serial = queryParams.get('serial')
  const [gateway, setGateway] = useState()

  useEffect(() => {
    api.getGateway(serial, handleGateway)
  }, [])

  const handleGateway = (data) => {
    setGateway(data)
  }

  return(
    <div></div>
  )
}

export default Gateway