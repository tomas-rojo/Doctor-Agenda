const client = require('../db/client')

exports.addNewPatientToDB = async (data) => {
    const { name, email, phone_number } = data
    await client.query('INSERT INTO patients (name, email, phone_number) VALUES ($1, $2, $3)', [name, email, phone_number])
}

exports.getAllPatientsFromDB = async () => {
    return client.query('SELECT * FROM patients')
}

exports.findPatientFromDB = async (id) => {
    return client.query('SELECT * FROM patients WHERE id = $1', [id])
}

exports.deletePatientFromDB = async (id) => {
    return client.query('DELETE FROM patients WHERE id = $1', [id])
}

exports.addNewAppointmentToDB = async (data) => {
    const { name, email, datetime } = data
    return client.query('INSERT INTO appointments (name, email, datetime) VALUES ($1, $2, $3)', [name, email, datetime])
}