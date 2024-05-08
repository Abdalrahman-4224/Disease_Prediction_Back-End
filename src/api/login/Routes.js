const express   = require('express');
const router    = express.Router();
const controller = require('./Controller')

router.post('/', (req, res) => {
    
    controller.createToken(req, response =>{
        res.json(response)
    })
});

router.post('/token', (req, res) => {
    controller.checkToken(req, response =>{
        res.json(response)
    })
});

module.exports = router