import React, { useState, useEffect } from 'react'
import api from '../api/api'

import { useNavigate } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

const Gateways = () => {
  const navigate = useNavigate()
  const [gateways, setGateways] = useState([])
  const [expandedRows, setExpandedRows] = useState(null)

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
    api.deleteGateway(rowData.serial, (data) => {
      setGateways(data)
    })
  }

  const allowExpansion = (rowData) => {
    console.log(rowData)
    return rowData.peripherals.length > 0
  }

  const statusBodyTemplate = (rowData) => {
    return rowData.status ? <p>Online</p> : <p>Offline</p>
  }

  const rowExpansionTemplate = (data) => {
    return (
      <div className='px-5'>
        <h5>Peripherals</h5>
        <DataTable value={data.peripherals} responsiveLayout="scroll">
          <Column field="id" header="Id" sortable></Column>
          <Column field="vendor" header="Vendor" sortable></Column>
          <Column field="created_date" header="Created" sortable></Column>
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
          ></Column>
        </DataTable>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="mb-3">List of gateways</h2>

      {gateways && (
        <DataTable
          value={gateways}
          responsiveLayout="scroll"
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
        >
          <Column expander={allowExpansion} style={{ width: '3em' }} />
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
