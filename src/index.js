const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const invalidRoute = require('./routes/invalidRoutes')
const { connection } = require('./db/connection')
const { PORT } = require('./config/globals')
const app = express();
const compression = require('compression')

//SETTINGS
app.set('views', (__dirname + '/views'))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(compression())

app.use('/', routes)
app.use('*', invalidRoute)

connection().then((message) => {
    console.log(message)
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    })
})