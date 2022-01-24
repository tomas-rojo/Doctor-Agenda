// Connection with PostgreSQL and creating the table "Patients" & "Appointments" //

const { Client } = require('pg');

const { POSTGRESQL_HOST,
    POSTGRESQL_USER,
    POSTGRESQL_PASSWORD,
    POSTGRESQL_DATABASE,
    POSTGRESQL_PORT } = require('../config/globals')

const client = new Client({
    host: POSTGRESQL_HOST,
    user: POSTGRESQL_USER,
    password: POSTGRESQL_PASSWORD,
    database: POSTGRESQL_DATABASE,
    port: POSTGRESQL_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});


// CREATING TABLE OF PATIENTS



client.query(
    `CREATE TABLE IF NOT EXISTS patients (
        id serial PRIMARY KEY,
        name VARCHAR ( 50 ) NOT NULL,
        CONSTRAINT check_name CHECK (name ~ '[A-Za-z]+$'),
        email VARCHAR ( 255 ) UNIQUE NOT NULL
        CONSTRAINT check_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
        phone_number VARCHAR ( 15 ) UNIQUE NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE) `
)

client.query(
    `CREATE TABLE IF NOT EXISTS appointments (
        patient_id VARCHAR PRIMARY KEY REFERENCES patients(email),
        date VARCHAR ( 50 ) NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE) `
)

module.exports = client