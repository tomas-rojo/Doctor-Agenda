const Patient = require('../models/Patient')
const Appointment = require('../models/Appointment')
const { validateAppointmentInfo } = require('../services/validations')
const {REDIS_URL, REDIS_PORT, REDIS_PASSWORD} = require('../config/globals')
const redis = require("redis");
const { promisify } = require("util");

// Connecting to redis
const client = redis.createClient({
    host : REDIS_URL, 
    port: REDIS_PORT,
    no_ready_check: true,
    auth_pass: `${REDIS_PASSWORD}`                                                                                                                                                           
}); 

// Promisifying Get and Set Methods
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

exports.getMain = async (req, res, next) => {
    res.render('addNewPatientForm', { error: false })
};

exports.addNewPatient = async (req, res, next) => {
    try {
        await Patient.addNewPatientToDB(req.body)
        res.status(200).redirect('/patients')
    }
    catch {
        res.render('addNewPatientForm', { error: true })
    }
};

exports.getAllPatients = async (req, res, next) => {
    try {
        // Search Data in Redis
        const reply = await GET_ASYNC("patients");

        // If exists returns from redis and finish with response
        if (reply) return res.render('getAllPatients', { patients: JSON.parse(reply) });
        
        // Fetching Data from DB
        const response = await Patient.getAllPatientsFromDB()

        // Saving the results in Redis. The "EX" and 60, sets an expiration of one minute
        await SET_ASYNC(
            "patients",
            JSON.stringify(response.rows),
            "EX",
            60
        );

        // Respond to Client
        res.render('getAllPatients', { patients: response.rows })
    }
    catch {
        res.status(200).redirect('/patients')
    }
};

exports.deletePatient = async (req, res, next) => {
    try {
        await Patient.deletePatientFromDB(req.params.id)
        res.status(200).redirect('/patients')
    }
    catch {
        res.status(200).redirect('/patients')
    }
};

exports.getAppointment = async (req, res, next) => {
    try {
        const patient = await Patient.findPatientFromDB(req.params.id)
        res.render('addNewAppointment', { error: false , success: false, patient: patient.rows[0] });
    } catch (error) {
        res.status(404).render('404')
    }
};

exports.addAppointment = async (req, res, next) => {
    const result = await validateAppointmentInfo(req.body)
    if (result == false) {
        res.render('addNewAppointment', { error: true , success: false, patient: req.body})
    }
    else {
        try {
            await Appointment.saveNewAppointmentToDB(req.body.email, req.body.datetime)
            res.render('addNewAppointment', { error: false , success: true, patient: req.body })

        } catch (error) {
            res.render('addNewAppointment', { error: true , success: false, patient: req.body})
        }
    }
};

exports.getAllAppointments = async (req, res, next) => {
    try {
        // Search Data in Redis
        const reply = await GET_ASYNC("appointments");

        // If exists returns from redis and finish with response
        if (reply) return res.render('getAllAppointments', { appointments: JSON.parse(reply) });

         // Fetching Data from DB
        const appointments = await Appointment.getAllAppointmentsFromDB()

        // Saving the results in Redis. The "EX" and 60, sets an expiration of one minute
        await SET_ASYNC(
            "appointments",
            JSON.stringify(appointments.rows),
            "EX",
            60
        );

        // Respond to Client
        res.render('getAllAppointments', {appointments: appointments.rows})

    } catch (error) {
        res.status(404).render('404')
    }
};

exports.deleteAppointment = async (req, res, next) => {
    try {
        await Appointment.deleteAppointmentFromDB(req.params.email)
        res.redirect('/all-appointments')
    } catch (error) {
        res.status(404).render('404')
    }
};