const calendrierModel = require('../model/Calendrier');
const DelegueModel = require('../model/Delegue');


const getAllCalendriers = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username) {
            const user = await DelegueModel.findOne({ username: req.params.username },{_id:1});
            const resultats = await calendrierModel.find({delegue: user._id}).populate('medecin')  // Populate the 'medecin' field with doctor details
            .populate({
              path: 'produitCalendriers.produit',  // Populate the 'produit' within 'produitCalendriers'
              select: 'intitule nbStock'  // Select specific product fields
            });
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const getOneCalendrier = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username) {
            const resultats = await calendrierModel.findOne({username:req.params.username, id:req.params.id});
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const addCalendrier = async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const Calendrier = new calendrierModel({...req.body});
            const resultats= await Calendrier.save();
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


const updateCalendrier= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats= await calendrierModel.findOneAndUpdate({username:req.params.username, id:req.params.id},{...req.body});
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}

const updateCalendrierStatus = async () => {
    try {

        const moroccoTimeZone = 'Africa/Casablanca';
        const moment = require('moment-timezone');

        // Get the current date and time in Morocco's time zone
        const currentDateInMorocco = moment().tz(moroccoTimeZone);

        // Calculate the date one day ago in Morocco's time zone
        const oneDayAgoInMorocco = currentDateInMorocco.clone().subtract(1, 'days');

        // Find and update calendrier entries where the date of visite has passed one day ago
        const result = await calendrierModel.updateMany(
            {
                dateVisite: { $lt: oneDayAgoInMorocco.toDate() },
                status: 0,
            },
            { $set: { status: 2 } } // Set status to 2 (or the desired status)
        );
        return result;
    } catch (error) {
        console.log({ success: false, message: error.message });
    }

}


const deleteCalendrier= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats=await calendrierModel.findOneAndDelete({username:req.params.username, id:req.params.id});
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


module.exports={
    getAllCalendriers, getOneCalendrier, addCalendrier, updateCalendrier, deleteCalendrier, updateCalendrierStatus
}
