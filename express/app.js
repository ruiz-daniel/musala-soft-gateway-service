const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const crypto = require('crypto')

// const database = require('./sqlitedb')

// Database
const connect = require('@databases/sqlite')
const { sql } = require('@databases/sqlite')

const db = connect()

async function prepare() {
  await db.query(sql`
    CREATE TABLE gateway (
      serial VARCHAR NOT NULL PRIMARY KEY,
      name VARCHAR NOT NULL,
      ip VARCHAR NOT NULL
    );
  `)
  await db.query(sql`
    CREATE TABLE peripheral (
      id VARCHAR NOT NULL PRIMARY KEY,
      vendor VARCHAR,
      created_date VARCHAR,
      status TINYINT DEFAULT 0,
      gatewayid VARCHAR NOT NULL
    );
  `)
}
const prepared = prepare()

async function setGateway(serial, name, ip) {
  await prepared
  await db.query(sql`
    INSERT INTO gateway (serial, name, ip)
      VALUES (${serial}, ${name}, ${ip})
    ON CONFLICT (serial) DO UPDATE
      SET name=excluded.name;
      SET ip=excluded.ip;
  `)
}

async function setPeripheral(vendor, status, gateway) {
  const id = crypto.randomUUID()
  const date = new Date().toString()
  await prepared
  await db.query(sql`
    INSERT INTO peripheral (id, created_date, vendor, status, gatewayid)
      VALUES (${id}, ${date}, ${vendor}, ${status}, ${gateway})
    ON CONFLICT (id) DO UPDATE
      SET vendor=excluded.vendor;
      SET status=excluded.status;
  `)
}

async function getPeripherals(gateway) {
  await prepared
  const results = await db.query(sql`
    SELECT * FROM peripheral WHERE gatewayid=${gateway};
  `)
  if (results.length) {
    return results[0]
  } else {
    return undefined
  }
}

async function getAllGateway() {
  await prepared
  const results = await db.query(sql`SELECT * FROM gateway;`)
  if (results.length) {
    return results
  } else {
    return undefined
  }
}

async function getBySerial(serial) {
  await prepared
  const results = await db.query(sql`
    SELECT * FROM gateway WHERE serial=${serial};
  `)
  if (results.length) {
    return results[0]
  } else {
    return undefined
  }
}

async function removeGateway(serial) {
  await prepared
  await db.query(sql`
    DELETE FROM gateway WHERE serial=${serial};
  `)
}

async function run() {
  await setGateway('GW1-TEST', 'Gateway1', '192.168.1.1')
  await setGateway('GW2-TEST', 'Gateway2', '192.168.1.2')
  await setGateway('GW3-TEST', 'Gateway3', '192.168.1.3')
  await setGateway('GW4-TEST', 'Gateway4', '192.168.1.4')
  await setGateway('GW5-TEST', 'Gateway5', '192.168.1.5')
  const gateways = await getAllGateway()
  gateways.forEach((element) => {
    setPeripheral('Logitech', true, element.serial)
    setPeripheral('Razer', true, element.serial)
    setPeripheral('Logitech', false, element.serial)
  })
}
run().catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
//...........................................................

app.use(cors())
app.listen(port, console.log(`Server started on port ${port}`))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/gateways', async (req, res) => {
  let response = await getAllGateway()
  const promises = response.map(async (element) => 
    element.peripherals = await getPeripherals(element.serial)
  )
  Promise.all(promises).then(() => {
    res.send(response)
  })
  
})

app.get('/gateway', async (req, res) => {
  let response = await getBySerial(req.query.serial)
  const promises = response.peripherals = await getPeripherals(response.serial)
  Promise.all(promises).then(() => {
    res.send(response)
  })
  res.send(response)
})

app.delete('/gateway', async (req, res) => {
  await removeGateway(req.query.serial)
  const response = await getAllGateway()
  res.send(response)
})
