const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

const { connectDB, disconnectDB } = require('./mongodb')
const gatewayService = require('./services/gateway')
const peripheralService = require('./services/peripheral')

const testData = require('./testData.json')

app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)
const server = app.listen(port, console.log(`Server started on port ${port}`))

connectDB()

// set up test data
testData.gateways.forEach(async (element) => {
  await gatewayService.handler.create(element)
})

// Endpoints

app.get('/v2/gateway', async (req, res) => {
  const response = await gatewayService.handler.get()
  res.send(response)
})

app.get('/v2/gateway/:id', async (req, res) => {
  const response = await gatewayService.handler.find(req.params.id)
  res.send(response)
})

app.post('/v2/gateway', async (req, res) => {
  const response = await gatewayService.handler
    .create(req.body)
    .catch((error) => {
      return error.message
    })
  if (response?._id) {
    res.status(201).send(response)
  } else if (response) {
    res.status(400).send(response)
  } else {
    res.status(500).send()
  }
})

app.patch('/v2/gateway', async (req, res) => {
  const response = await gatewayService.handler
    .update(req.body)
    .catch((error) => {
      return error.message
    })
  if (response?._id) {
    res.send(response)
  } else if (response) {
    res.status(400).send(response)
  } else {
    res.status(500).send()
  }
})

app.put('/v2/gateway', async (req, res) => {
  const response = await gatewayService.handler
    .updateOverride(req.body)
    .catch((error) => {
      return error.message
    })
  if (response?._id) {
    res.send(response)
  } else if (response) {
    res.status(400).send(response)
  } else {
    res.status(500).send()
  }
})

app.delete('/v2/gateway/:id', async (req, res) => {
  await gatewayService.handler.delete(req.params.id)
  const response = await gatewayService.handler.get()
  res.send(response)
})

app.get('/v2/peripheral', async (req, res) => {
  const response = await peripheralService.handler.get()
  res.send(response)
})

app.get('/v2/peripheral/:id', async (req, res) => {
  const response = await peripheralService.handler
    .find(req.params.id)
    .catch((error) => {
      return error.message
    })
  res.send(response)
})

app.get('/v2/peripheral/gateway/:id', async (req, res) => {
  const gateway = await gatewayService.handler.find(req.params.id)
  const response = gateway.peripherals || []
  res.send(response)
})

app.post('/v2/peripheral', async (req, res) => {
  const response = await peripheralService.handler
    .create(req.body)
    .catch((error) => {
      return error.message
    })
  if (response?._id) {
    res.status(201).send(response)
  } else if (response) {
    res.status(400).send(response)
  } else {
    res.status(500).send()
  }
})

app.patch('/v2/peripheral', async (req, res) => {
  const response = await peripheralService.handler
    .update(req.body)
    .catch((error) => {
      return error.message
    })
  if (response?._id) {
    res.send(response)
  } else if (response) {
    res.status(400).send(response)
  } else {
    res.status(500).send()
  }
})

app.put('/v2/peripheral', async (req, res) => {
  const response = await peripheralService.handler
    .updateOverride(req.body)
    .catch((error) => {
      return error.message
    })
  if (response?._id) {
    res.send(response)
  } else if (response) {
    res.status(400).send(response)
  } else {
    res.status(500).send()
  }
})

app.delete('/v2/peripheral/:id', async (req, res) => {
  const response = await peripheralService.handler
    .delete(req.params.id)
    .catch((error) => {
      return error.message
    })
  res.send(response)
})

module.exports = { app, server }
