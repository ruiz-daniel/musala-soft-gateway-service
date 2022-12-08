import React from 'react'

import { InputText } from 'primereact/inputtext'

const PeripheralForm = ({ vendor, setVendor }) => {
  return (
    <>
      <div className="flex flex-column">
        <h4>Vendor</h4>
        <InputText value={vendor} onChange={(e) => setVendor(e.target.value)} />
      </div>
    </>
  )
}

export default PeripheralForm
