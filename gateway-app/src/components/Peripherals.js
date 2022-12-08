import React from 'react'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'


const Peripherals = ({ peripherals, changeStatus, handleDelete }) => {
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

  const optionsTemplate = (rowData) => {
    return (
      <div>
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
        {handleDelete && <Column body={optionsTemplate} />}
      </DataTable>
    </div>
  )
}

export default Peripherals
