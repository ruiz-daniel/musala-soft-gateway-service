import React, { useState, useEffect } from 'react'
import api from '../api/api'

import { useNavigate } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import GatewayForm from '../components/GatewayForm'
import Peripherals from '../components/Peripherals'

const Gateways = () => {
  const navigate = useNavigate()
  const [gateways, setGateways] = useState([])
  const [expandedRows, setExpandedRows] = useState(null)
  const [addModal, toggleAddModal] = useState(false)
  const [editModal, toggleEditModal] = useState(false)

  // gateway fields
  const [name, setName] = useState('')
  const [ip, setIP] = useState('')
  const [id, setID] = useState()

  useEffect(() => {
    api.getGateways(handleGateways)
  }, [])

  const handleGateways = (data) => {
    setGateways(data)
  }

  const optionsTemplate = (rowData) => {
    return (
      <div>
        <Button
          onClick={() => {
            handleDetails(rowData)
          }}
          icon="pi pi-eye"
          iconPos="right"
          className="mr-2 p-button-rounded"
        />
        <Button
          onClick={() => {
            setName(rowData.name)
            setIP(rowData.ip)
            setID(rowData._id)
            toggleEditModal(true)
          }}
          icon="pi pi-pencil"
          iconPos="right"
          className="mr-2 p-button-rounded"
        />
        <Button
          className="p-button-danger p-button-rounded"
          onClick={() => {
            handleDelete(rowData)
          }}
          icon="pi pi-trash"
          iconPos="right"
        />
      </div>
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
      api.createGateway({ name, ip }, onCreate)
    }
  }
  const handleUpdate = () => {
    if (id?.length && name?.length && ip?.length) {
      api.updateGateway({ _id: id, name, ip }, onUpdate)
    }
  }

  const onCreate = (data) => {
    gateways.push(data)
    toggleAddModal(false)
  }
  const onUpdate = () => {
    api.getGateways((data) => {
      handleGateways(data)
      toggleEditModal(false)
    })
  }

  const hide = () => {
    toggleAddModal(false)
    toggleEditModal(false)
  }

  const allowExpansion = (rowData) => {
    return rowData.peripherals.length > 0
  }

  const handleForm = () => {
    if (addModal) {
      handleCreate()
    } else if (editModal) {
      handleUpdate()
    }
  }

  const handlePeripheralChangeStatus = (peripheral) => {
    peripheral.status = !peripheral.status
    api.updatePeripheral(peripheral, () => {
      api.getGateways(handleGateways)
    })
  }

  const footer = (
    <div>
      <Button
        label={addModal ? 'Create' : 'Update'}
        icon="pi pi-check"
        onClick={handleForm}
      />
      <Button label="Cancel" icon="pi pi-times" onClick={hide} />
    </div>
  )

  const rowExpansionTemplate = (data) => {
    return (
      <div className="px-5">
        <p>Peripherals</p>
        <Peripherals
          peripherals={data.peripherals}
          changeStatus={handlePeripheralChangeStatus}
        />
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
          onClick={() => {
            setName('')
            setIP('')
            toggleAddModal(true)
          }}
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
        <GatewayForm name={name} ip={ip} setName={setName} setIP={setIP} />
      </Dialog>
      <Dialog
        header="Update Gateway"
        footer={footer}
        visible={editModal}
        style={{ width: '40vw' }}
        modal
        onHide={hide}
      >
        <GatewayForm name={name} ip={ip} setName={setName} setIP={setIP} />
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
