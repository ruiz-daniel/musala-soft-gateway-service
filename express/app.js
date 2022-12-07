const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const crypto = require('crypto')

const {database} = require('./sqlitedb')
const { connectDB, disconnectDB } = require('./mongodb');

app.use(cors())
app.listen(port, console.log(`Server started on port ${port}`))

database.run()
connectDB()

// Endpoints

app.get('/v1/gateway', async (req, res) => {
  let response = await database.getAllGateways()
  const promises = response.map(async (element) => 
    element.peripherals = await database.getPeripherals(element.serial)
  )
  Promise.all(promises).then(() => {
    res.send(response)
  })
  
})

app.get('/v1/gateway/:serial', async (req, res) => {
  let response = await database.getBySerial(req.params.serial)
  const promises = response.peripherals = await database.getPeripherals(response.serial)
  Promise.all(promises).then(() => {
    res.send(response)
  })
  res.send(response)
})

app.delete('/v1/gateway/:serial', async (req, res) => {
  await database.removeGateway(req.params.serial)
  const response = await database.getAllGateways()
  res.send(response)
})

app.get('/v1/peripheral/gateway/:gatewayid', async (req, res) => {
  const response = await database.getPeripherals(req.params.gatewayid)
  res.send(response)
})

app.get('/v1/peripheral/:id', async (req, res) => {
  const response = await database.getPeripheral(req.params.id)
  res.send(response)
})

app.delete('/v1/peripheral/:id', async (req, res) => {
  const peripheral = await database.getPeripheral(req.params.id)
  const gateway = peripheral.gatewayid
  await database.removePeripheral(req.params.id)
  const response = await database.getPeripherals(gateway)
  res.send(response)
})
