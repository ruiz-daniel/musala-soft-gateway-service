import React, { useState, useEffect } from 'react'
import api from '../api/api'

import { useNavigate, useSearchParams } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

const Gateway = () => {
  const [queryParams] = useSearchParams()
  const navigate = useNavigate()
  const gatewayid = queryParams.get('id')
  const [gateway, setGateway] = useState()
  
  

  useEffect(() => {
    api.getGateway(gatewayid, handleGateway)
  }, [])

  const handleGateway = (data) => {
    setGateway(data)
  }

  const statusBodyTemplate = (rowData) => {
    return rowData.status ? <p>Online</p> : <p>Offline</p>
  }

  const goBack = () => {
    navigate(`/`)
  }

  return(
    <>
    {gateway && <div className='p-5'>
      <h1><Button icon="pi pi-arrow-left" className="p-button-secondary p-button-raised p-button-rounded mr-2"  onClick={goBack}/>{gateway.name}</h1>
      <p style={{fontSize: '20px'}}>Serial: {gateway.ip}</p>
      <p style={{fontSize: '20px'}}>IP: {gateway.ip}</p>
      <p style={{fontSize: '20px'}}>Peripherals</p>
        <DataTable value={gateway.peripherals} responsiveLayout="scroll">
          <Column field="uid" header="UID" sortable></Column>
          <Column field="vendor" header="Vendor" sortable></Column>
          <Column field="date" header="Created" sortable></Column>
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
          ></Column>
        </DataTable>
    </div>}</>
    
  )
}

export default Gateway