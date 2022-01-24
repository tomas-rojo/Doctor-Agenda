const Patient = require('../models/Patient')
const Appointment = require('../models/Appointment')
const { validateAppointmentInfo } = require('../services/validations')

const redis = require("redis");
// const responseTime = require("response-time");
const { promisify } = require("util");

// Connecting to redis
const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

// Promisifying Get and set methods
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
        // if (reply) return res.send(JSON.parse(reply));
        if (reply) return res.render('getAllPatients', { patients: JSON.parse(reply) });
        

        // Fetching Data from DB
        const response = await Patient.getAllPatientsFromDB()

        // Saving the results in Redis. The "EX" and 1880, sets an expiration of 1800 Seconds = 30 minutes
        await SET_ASYNC(
            "patients",
            JSON.stringify(response.rows),
            "EX",
            1800
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
        res.send(error)
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
        const appointments = await Appointment.getAllAppointmentsFromDB()
        res.render('getAllAppointments', {appointments: appointments.rows})
    } catch (error) {
        res.json(error)
    }
};

exports.deleteAppointment = async (req, res, next) => {
    try {
        await Appointment.deleteAppointmentFromDB(req.params.email)
        res.redirect('/all-appointments')
    } catch (error) {
        res.json(error)
    }
};