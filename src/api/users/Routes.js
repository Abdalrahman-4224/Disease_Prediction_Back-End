// Here we define our API endpoints for the corresponding component and assign the controller methods to them. 
// Moreover we can do things like authorization (e.g. JWT), permission validation (e.g. ACL) 
// or add component specific middleware.
const express   = require('express');
const router    = express.Router();
const controller = require('./Controller')


router.put('/roles/:id', (req, res) => {
    controller._updateRoles(req, response =>{
        res.json(response)
    })
});

router.post('/', (req, res) => {
    controller._insert(req, response =>{
        res.json(response)
    })
});

router.put('/:id', (req, res) => {
    controller._update(req, response =>{
        res.json(response)
    })
});



router.get('/:id', (req, res) => {
    controller._get(req, response =>{
        res.json(response)
    })
});

router.get('/', (req, res) => {
    
    controller._gets(req, response =>{
        res.json(response)
    })
});

router.delete('/:id', (req, res) => {
    controller._delete(req, response =>{
        res.json(response)
    })
});




module.exports = router