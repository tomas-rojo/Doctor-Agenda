var validator = require('validator');

exports.validatePatientInfo = (data) => {
    const { name, email, phone_number } = data
    return
}



exports.validateAppointmentInfo = (data) => {
    const { name, email, datetime } = data
    const name_validation = validator.isAlpha(name, ['es-ES'], { ignore: ' ' })
    const email_validation = validator.isEmail(email)
    const date = datetime.split(' ')[0]
    const date_validation = validator.isAfter(date)
    return (name_validation === true && email_validation === true && date_validation === true) ? true : false
}

