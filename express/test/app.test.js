const supertest = require('supertest')
const { app, server } = require('../app')
const request = supertest(app)

const { connectDB, disconnectDB } = require('../mongodb')

describe('API test', () => {
  afterAll(() => {
    disconnectDB()
    server.close()
  })

  describe('gateways endpoints', () => {
    it('Get all gateways', async () => {
      const res = await request.get('/v2/gateway')

      expect(res.status).toBe(200)
    })
    it('Create gateway', async () => {
      const res = await request
        .post('/v2/gateway')
        .set('Content-type', 'application/json')
        .send({
          name: 'GatewayTest',
          ip: '192.168.128.1',
          peripherals: [
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Razer',
            },
            {
              vendor: 'Logitech',
            },
          ],
        })

      expect(res.status).toBe(201)
      expect(res.body._id).toBeTruthy()
    })
    it('Create gateway with invalid IP case 1', async () => {
      const res = await request
        .post('/v2/gateway')
        .set('Content-type', 'application/json')
        .send({
          name: 'GatewayTest',
          ip: '260.168.128.1',
          peripherals: [
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Razer',
            },
            {
              vendor: 'Logitech',
            },
          ],
        })

      expect(res.status).toBe(400)
      expect(res.text).toEqual("Invalid IP. Must be a valid IPv4 address")
    })
    it('Create gateway with invalid IP case 2', async () => {
      const res = await request
        .post('/v2/gateway')
        .set('Content-type', 'application/json')
        .send({
          name: 'GatewayTest',
          ip: '260.168.128.1.9',
          peripherals: [
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Razer',
            },
            {
              vendor: 'Logitech',
            },
          ],
        })

      expect(res.status).toBe(400)
      expect(res.text).toEqual("Invalid IP. Must be a valid IPv4 address")
    })
    it('Create gateway with more than 10 peripherals', async () => {
      const res = await request
        .post('/v2/gateway')
        .set('Content-type', 'application/json')
        .send({
          name: 'GatewayTest',
          ip: '192.168.128.1',
          peripherals: [
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Razer',
            },
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Razer',
            },
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Razer',
            },
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Razer',
            },
            {
              vendor: 'Logitech',
            },
          ],
        })

      expect(res.status).toBe(400)
      expect(res.text).toEqual('A gateway cannot have more than 10 peripherals')
    })
    it('Get created gateway', async () => {
      const res1 = await request
        .post('/v2/gateway')
        .set('Content-type', 'application/json')
        .send({
          name: 'GatewayTest',
          ip: '192.168.128.1',
        })

      expect(res1.status).toBe(201)
      expect(res1.body._id).toBeTruthy()

      const res2 = await request.get(`/v2/gateway/${res1.body._id}`)

      expect(res2.status).toBe(200)
      expect(res2.body._id).toEqual(res1.body._id)
    })
    it('Patch created gateway', async () => {
      const res1 = await request
        .post('/v2/gateway')
        .set('Content-type', 'application/json')
        .send({
          name: 'GatewayTest',
          ip: '192.168.128.1',
        })

      expect(res1.status).toBe(201)
      expect(res1.body._id).toBeTruthy()

      const res2 = await request.patch('/v2/gateway/').send({
        _id: res1.body._id,
        ip: '192.168.252.1',
      })

      expect(res2.status).toBe(200)
      // keep the other fields
      expect(res2.body.name).toBeTruthy()
      // update the ip
      expect(res2.body.ip).toEqual('192.168.252.1')
    })
    it('Put created gateway', async () => {
      const res1 = await request
        .post('/v2/gateway')
        .set('Content-type', 'application/json')
        .send({
          name: 'GatewayTest',
          ip: '192.168.128.1',
        })

      expect(res1.status).toBe(201)
      expect(res1.body._id).toBeTruthy()

      const res2 = await request.put('/v2/gateway/').send({
        _id: res1.body._id,
        serial: res1.body.serial,
        name: 'GatewayTest',
      })

      expect(res2.status).toBe(200)
      // remove IP
      expect(res2.body.ip).toEqual(undefined)
    })
    it('Delete gateway', async () => {
      const res1 = await request.get('/v2/gateway')

      expect(res1.status).toBe(200)

      const res2 = await request.delete(`/v2/gateway/${res1.body[0]._id}`)

      expect(res2.status).toBe(200)

      const res3 = await request.get('/v2/gateway')

      // first one was deleted
      expect(res3.body.length).toEqual(res1.body.length - 1)
    })
  })
  describe('peripheral endpoints', () => {
    it('Get all peripherals', async () => {
      const res = await request.get('/v2/peripheral')

      expect(res.status).toBe(200)
    })
    it('Create peripheral', async () => {
      const res = await request
        .post('/v2/peripheral')
        .set('Content-type', 'application/json')
        .send({
              vendor: 'Logitech'
            })

      expect(res.status).toBe(201)
      expect(res.body._id).toBeTruthy()
    })
    it('Get created peripheral', async () => {
      const res1 = await request
        .post('/v2/peripheral')
        .set('Content-type', 'application/json')
        .send({
              vendor: 'Logitech',
            })

      expect(res1.status).toBe(201)
      expect(res1.body._id).toBeTruthy()

      const res2 = await request.get(`/v2/peripheral/${res1.body._id}`)

      expect(res2.status).toBe(200)
      expect(res2.body._id).toEqual(res1.body._id)
    })
    it('Get peripheral from gateway', async () => {
      const res1 = await request
        .post('/v2/gateway')
        .set('Content-type', 'application/json')
        .send({
          name: 'GatewayTest',
          ip: '192.168.128.1',
          peripherals: [
            {
              vendor: 'Logitech',
            },
            {
              vendor: 'Razer',
            },
            {
              vendor: 'Logitech',
            },
          ],
        })

      expect(res1.status).toBe(201)
      expect(res1.body._id).toBeTruthy()

      const res2 = await request.get(`/v2/peripheral/gateway/${res1.body._id}`)

      expect(res2.status).toBe(200)
      expect(res2.body.length).toBeGreaterThan(0)
    })
    it('Patch created peripheral', async () => {
      const res1 = await request
        .post('/v2/peripheral')
        .set('Content-type', 'application/json')
        .send({
              vendor: 'Logitech',
            })

      expect(res1.status).toBe(201)
      expect(res1.body._id).toBeTruthy()
      expect(res1.body.status).toEqual(true)

      const res2 = await request.patch('/v2/peripheral/').send({
        _id: res1.body._id,
        status: 0
      })

      expect(res2.status).toBe(200)
      // keep the other fields
      expect(res2.body.vendor).toEqual('Logitech')
      // update the status to offline
      expect(res2.body.status).toEqual(false)
    })
    it('Put created peripheral', async () => {
      const res1 = await request
        .post('/v2/peripheral')
        .set('Content-type', 'application/json')
        .send({
              vendor: 'Logitech',
            })

      expect(res1.status).toBe(201)
      expect(res1.body._id).toBeTruthy()

      const res2 = await request.put('/v2/peripheral/').send({
        _id: res1.body._id,
        uid: res1.body.uid,
        created_date: res1.body.created_date,
        status: res1.body.status
      })

      expect(res2.status).toBe(200)
      // remove vendor
      expect(res2.body.vendor).toEqual(undefined)
    })
    it('Delete peripheral', async () => {
      const res1 = await request.get('/v2/peripheral')

      expect(res1.status).toBe(200)

      const res2 = await request.delete(`/v2/peripheral/${res1.body[0]._id}`)

      expect(res2.status).toBe(200)

      const res3 = await request.get('/v2/peripheral')

      // first one was deleted
      expect(res3.body.length).toEqual(res1.body.length - 1)
    })
  })
})
