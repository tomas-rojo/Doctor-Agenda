const client = require('../db/client')

exports.getAllAppointmentsFromDB = async () => {
    return client.query("                                               \
                        SELECT P.name, P.email, P.phone_number, A.date  \
                        FROM patients P, appointments A                 \
                        WHERE P.email = A.patient_id                    \
                        "
        )
}

exports.saveNewAppointmentToDB = async (patient_id, datetime) => {
    return client.query('INSERT INTO appointments (patient_id, date) VALUES ($1, $2)', [patient_id, datetime])
}

exports.deleteAppointmentFromDB = async(email) => {
    return client.query('DELETE FROM appointments WHERE patient_id = $1', [email])
}
