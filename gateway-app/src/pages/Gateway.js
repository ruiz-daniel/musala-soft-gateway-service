import React, { useState, useEffect } from 'react'
import api from '../api/api'

import { useNavigate, useSearchParams } from 'react-router-dom'

import Peripherals from '../components/Peripherals'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import PeripheralForm from '../components/PeripheralForm'

const Gateway = () => {
  const [queryParams] = useSearchParams()
  const navigate = useNavigate()
  const gatewayid = queryParams.get('id')

  const [gateway, setGateway] = useState()
  const [addModal, toggleAddModal] = useState(false)
  const [vendor, setVendor] = useState()

  useEffect(() => {
    api.getGateway(gatewayid, handleGateway)
  }, [])

  const handleGateway = (data) => {
    setGateway(data)
  }

  const handleCreate = () => {
    if (vendor?.length) {
      gateway.peripherals.push({ date: new Date().toString(), vendor })
      api.updateGateway(gateway, onCreate)
    }
  }

  const onCreate = () => {
    api.getGateway(gatewayid, handleGateway)
    toggleAddModal(false)
  }

  const handleDeletePeripheral = (peripheral) => {
    api.deletePeripheral(peripheral._id, () => {
      api.getGateway(gatewayid, handleGateway)
    })
  }

  const hide = () => {
    toggleAddModal(false)
  }

  const handlePeripheralChangeStatus = (peripheral) => {
    peripheral.status = !peripheral.status
    api.updatePeripheral(peripheral, () => {
      api.getGateway(gatewayid, handleGateway)
    })
  }

  const goBack = () => {
    navigate(`/`)
  }

  const footer = (
    <div>
      <Button label="Create" icon="pi pi-check" onClick={handleCreate} />
      <Button label="Cancel" icon="pi pi-times" onClick={hide} />
    </div>
  )

  return (
    <>
      <Dialog
        header="New Gateway"
        footer={footer}
        visible={addModal}
        style={{ width: '40vw' }}
        modal
        onHide={hide}
      >
        <PeripheralForm vendor={vendor} setVendor={setVendor} />
      </Dialog>
      {gateway && (
        <div className="p-5">
          <h1>
            <Button
              icon="pi pi-arrow-left"
              className="p-button-secondary p-button-raised p-button-rounded mr-2"
              onClick={goBack}
            />
            {gateway.name}
          </h1>
          <p style={{ fontSize: '20px' }}>Serial: {gateway.ip}</p>
          <p style={{ fontSize: '20px' }}>IP: {gateway.ip}</p>
          <p style={{ fontSize: '20px' }}>Peripherals</p>
          <Button
            label="Add Peripheral"
            icon="pi pi-plus"
            className="p-button-sm mb-2"
            onClick={() => {
              setVendor('')
              toggleAddModal(true)
            }}
          />
          <Peripherals
            peripherals={gateway.peripherals}
            changeStatus={handlePeripheralChangeStatus}
            handleDelete={handleDeletePeripheral}
          />
        </div>
      )}
    </>
  )
}

export default Gateway
