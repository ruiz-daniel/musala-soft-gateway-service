import React from 'react'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'


const Peripherals = ({ peripherals, changeStatus }) => {
  const statusBodyTemplate = (rowData) => {
    return rowData.status ? (
      <p
        onClick={() => {
          changeStatus(rowData)
        }}
        style={{ color: 'green', cursor: 'pointer' }}
      >
        Online
      </p>
    ) : (
      <p
        onClick={() => {
          changeStatus(rowData)
        }}
        style={{ color: 'red', cursor: 'pointer' }}
      >
        Offline
      </p>
    )
  }

  return (
    <div>
      <DataTable value={peripherals} responsiveLayout="scroll">
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

export default Peripherals
