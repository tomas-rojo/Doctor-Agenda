require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8000,
    POSTGRESQL_HOST: process.env.POSTGRESQL_HOST,
    POSTGRESQL_USER: process.env.POSTGRESQL_USER,
    POSTGRESQL_PASSWORD: process.env.POSTGRESQL_PASSWORD,
    POSTGRESQL_DATABASE: process.env.POSTGRESQL_DATABASE,
    POSTGRESQL_PORT: process.env.POSTGRESQL_PORT
}