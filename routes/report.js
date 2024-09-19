const express = require("express");
const router = express.Router();
const reportModel = require('../models/report');

router.post('/', async(req,res)=>{
    try{
    const { from, data } = req.body;  

    const report = await reportModel.create({
        from,
        data
     })
      
     res.status(200).json({msg: "Sucessfully reported/suggested"})

    }
    catch(err){
        res.status(400).json({ error: err.message });
    }
    });

module.exports = router;