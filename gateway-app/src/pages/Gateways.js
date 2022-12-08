import React, { useState, useEffect } from 'react'
import api from '../api/api'

import { useNavigate } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import CreateGatewayForm from '../components/CreateGatewayForm'

const Gateways = () => {
  const navigate = useNavigate()
  const [gateways, setGateways] = useState([])
  const [expandedRows, setExpandedRows] = useState(null)
  const [addModal, toggleAddModal] = useState(false)

  // new gateway fields
  const [name, setName] = useState("")
  const [ip, setIP] = useState("")

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
    navigate(`/gateway?id=${rowData._id}`)
  }

  const handleDelete = (rowData) => {
    api.deleteGateway(rowData._id, (data) => {
      setGateways(data)
    })
  }
  const handleCreate = () => {
    if (name?.length && ip?.length) {
      api.createGateway({name, ip}, onCreate)
    }
  }

  const onCreate = (data) => {
    gateways.push(data)
    toggleAddModal(false)
  }

  const hide = () => {
    toggleAddModal(false)
  }

  const allowExpansion = (rowData) => {
    console.log(rowData)
    return rowData.peripherals.length > 0
  }

  const statusBodyTemplate = (rowData) => {
    return rowData.status ? <p>Online</p> : <p>Offline</p>
  }

  const footer = (
    <div>
      <Button label="Create" icon="pi pi-check" onClick={handleCreate} />
      <Button label="Cancel" icon="pi pi-times" onClick={hide} />
    </div>
  )

  const rowExpansionTemplate = (data) => {
    return (
      <div className="px-5">
        <h5>Peripherals</h5>
        <DataTable value={data.peripherals} responsiveLayout="scroll">
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
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="mb-3">
        List of gateways{' '}
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-sm"
          onClick={() => toggleAddModal(true)}
        />
      </h2>
      <Dialog
        header="New Gateway"
        footer={footer}
        visible={addModal}
        style={{ width: '40vw' }}
        modal
        onHide={hide}
      >
        <CreateGatewayForm name={name} ip={ip} setName={setName} setIP={setIP} />
      </Dialog>

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
