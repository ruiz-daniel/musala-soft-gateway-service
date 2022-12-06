import React, { useState, useEffect } from 'react'
import api from '../api/api'

import { useNavigate } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

const Gateways = () => {
  const navigate = useNavigate()
  const [gateways, setGateways] = useState([])

  useEffect(() => {
    api.getGateways(handleGateways)
  }, [])

  const handleGateways = (data) => {
    setGateways(data)
  }

  const optionsTemplate = (rowData) => {
    return (
      <>
        <Button
          onClick={() => {
            handleDetails(rowData)
          }}
          icon="pi pi-eye"
          iconPos="right"
        />{' '}
        <Button
          className="p-button-danger"
          onClick={() => {
            handleDelete(rowData)
          }}
          icon="pi pi-trash"
          iconPos="right"
        />
      </>
    )
  }

  const handleDetails = (rowData) => {
    navigate(`/gateway?serial=${rowData.serial}`)
  }

  const handleDelete = (rowData) => {
    api.deleteGateway(rowData.serial, () => {
      setGateways(
        gateways.filter((gateway) => gateway.serial !== rowData.serial),
      )
    })
  }

  return (
    <div className="p-4">
      <h2 className="mb-3">List of gateways</h2>

      {gateways && (
        <DataTable value={gateways} responsiveLayout="scroll">
          <Column field="name" header="Name" />
          <Column field="ip" header="IP" />
          <Column field="serial" header="Serial ID" />
          <Column body={optionsTemplate} />
        </DataTable>
      )}
    </div>
  )
}

export default Gateways
