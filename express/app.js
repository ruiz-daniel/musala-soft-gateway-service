const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const crypto = require('crypto')

const { database } = require('./sqlitedb')
const { connectDB, disconnectDB } = require('./mongodb')
const gatewayService = require('./services/gateway')
const peripheralService = require('./services/peripheral')

const testData = require('./testData.json')

app.use(cors())
app.listen(port, console.log(`Server started on port ${port}`))

database.run()
connectDB()

// set up test data
testData.gateways.forEach(async (element) => {
  await gatewayService.handler.create(element)
})
testData.peripherals.forEach(async (element) => {
  element.uid = crypto.randomUUID()
  await peripheralService.handler.create(element)
})

// Endpoints

app.get('/v1/gateway', async (req, res) => {
  let response = await database.getAllGateways()
  const promises = response.map(
    async (element) =>
      (element.peripherals = await database.getPeripherals(element.serial)),
  )
  Promise.all(promises).then(() => {
    res.send(response)
  })
})

app.get('/v1/gateway/:serial', async (req, res) => {
  let response = await database.getBySerial(req.params.serial)
  const promises = (response.peripherals = await database.getPeripherals(
    response.serial,
  ))
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

//v2 (mongodb)

app.get('/v2/gateway', async (req, res) => {
  const response = await gatewayService.handler.get()
  res.send(response)
})

app.get('/v2/gateway/:id', async (req, res) => {
  const response = await gatewayService.handler.find(req.params.id)
  res.send(response)
})

app.patch('/v2/gateway', (req, res) => {
  const response = gatewayService.handler.update(req.body)
  res.send(response)
})

app.put('/v2/gateway', (req, res) => {
  const response = gatewayService.handler.updateOverride(req.body)
  res.send(response)
})

app.delete('/v2/gateway/:id', (req, res) => {
  const response = gatewayService.handler.delete(req.params.id)
  res.send(response)
})

app.get('/v2/peripheral', async (req, res) => {
  const response = await peripheralService.handler.get()
  res.send(response)
})
