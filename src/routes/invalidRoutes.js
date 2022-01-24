const express = require('express');
const router = express.Router()

router.all('*', (req, res) => {
    res.status(404).render('404');
})

module.exports = router