const express = require('express');
const router = express.Router()

const {
    getMain,
    addNewPatient,
    getAllPatients,
    deletePatient,
    getAppointment, 
    addAppointment,
    getAllAppointments,
    deleteAppointment}
    = require('../controllers/patients')

router
    .get('/', (req, res) => { res.redirect('/patients') })
    .get("/add-patient", getMain)
    .post("/add-patient", addNewPatient)
    .get("/patients", getAllPatients)
    .get("/delete-patient/:id", deletePatient)
    .get("/appointments", getAllAppointments)
    .get("/add-appointment/:id", getAppointment)
    .get("/delete-appointment/:email", deleteAppointment)
    .post("/add-appointment", addAppointment)

module.exports = router