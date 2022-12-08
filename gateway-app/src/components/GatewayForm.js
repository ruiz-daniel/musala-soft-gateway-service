import React, { useState } from 'react'

import { InputText } from 'primereact/inputtext'

const GatewayForm = ({ name, setName, ip, setIP }) => {
  return (
    <>
      <div className="flex flex-column">
        <h4>Name</h4>
        <InputText value={name} onChange={(e) => setName(e.target.value)} />
        <h4>IP</h4>
        <InputText value={ip} onChange={(e) => setIP(e.target.value)} />
      </div>
    </>
  )
}

export default GatewayForm
