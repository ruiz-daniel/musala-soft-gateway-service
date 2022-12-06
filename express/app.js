const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const crypto = require ('crypto')

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
}
const prepared = prepare()

async function set(serial, name, ip) {
  await prepared
  await db.query(sql`
    INSERT INTO gateway (serial, name, ip)
      VALUES (${serial}, ${name}, ${ip})
    ON CONFLICT (serial) DO UPDATE
      SET name=excluded.name;
      SET ip=excluded.ip
  `)
}

async function getAll() {
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

async function remove(serial) {
  await prepared
  await db.query(sql`
    DELETE FROM gateway WHERE serial=${serial};
  `)
}

async function run() {
  await set(crypto.randomUUID(), 'Gateway1', '192.168.1.1')
  await set(crypto.randomUUID(), 'Gateway2', '192.168.1.2')
  await set(crypto.randomUUID(), 'Gateway3', '192.168.1.3')
  await set(crypto.randomUUID(), 'Gateway4', '192.168.1.4')
  await set(crypto.randomUUID(), 'Gateway5', '192.168.1.5')
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
  const response = await getAll()
  res.send(response)
})

app.get('/gateway', async (req, res) => {
  const response = await getBySerial(req.query.serial)
  console.log(response)
  res.send(response)
})

app.post('/gateway', (req, res) => {
  console.log('Connected to React')
  res.send('Test')
})
