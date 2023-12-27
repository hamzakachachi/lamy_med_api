const express=require("express");
const { updateCalendrierStatus } = require(__dirname+"/../controller/CalendrierController");
const router=express.Router();


router.get('/changestatus', updateCalendrierStatus);

module.exports=router;