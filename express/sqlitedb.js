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

async function getAllGateways() {
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
    return results
  } else {
    return undefined
  }
}

async function getPeripheral(id) {
  await prepared
  const results = await db.query(sql`
    SELECT * FROM peripheral WHERE id=${id};
  `)
  if (results.length) {
    return results[0]
  } else {
    return undefined
  }
}

async function removePeripheral(id) {
  await prepared
  await db.query(sql`
    DELETE FROM peripheral WHERE id=${id};
  `)
}

async function run() {
  await setGateway('GW1-TEST', 'Gateway1', '192.168.1.1')
  await setGateway('GW2-TEST', 'Gateway2', '192.168.1.2')
  await setGateway('GW3-TEST', 'Gateway3', '192.168.1.3')
  await setGateway('GW4-TEST', 'Gateway4', '192.168.1.4')
  await setGateway('GW5-TEST', 'Gateway5', '192.168.1.5')
  const gateways = await getAllGateways()
  gateways.forEach((element) => {
    setPeripheral('Logitech', true, element.serial)
    setPeripheral('Razer', true, element.serial)
    setPeripheral('Logitech', false, element.serial)
  })
}
