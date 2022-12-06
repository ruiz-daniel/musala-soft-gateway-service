import React, { useState, useEffect } from 'react'
import api from '../api/api'

import { useNavigate } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

const Gateways = () => {
  const [gateways, setGateways] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    api.getGateways(handleGateways)
  }, [])

  const handleGateways = (data) => {
    setGateways([data])
  }

  const handleDetails = (serial) => {
    navigate(`/gateway/${serial}`)
  }

  const handleDelete = (serial) => {
    api.deleteGateway(serial, () => {
      setGateways(gateways.filter(gateway => gateway.serial !== serial))
    })
  }

  return (
    <div className="p-4">
      <h2 className="mb-3">List of gateways</h2>
      <DataTable value={gateways} responsiveLayout="scroll">
        <Column field="name" header="Name" />
        <Column field="ip" header="IP" />
        <Column field="serial" header="Serial ID" />
        <Column
          body={
            <>
              <Button
                onClick={() => {
                  handleDetails()
                }}
                icon="pi pi-eye"
                iconPos="right"
              />{' '}
              <Button
                className="p-button-danger"
                onClick={() => {
                  handleDelete()
                }}
                icon="pi pi-trash"
                iconPos="right"
              />
            </>
          }
        />
      </DataTable>
    </div>
  )
}

export default Gateways
