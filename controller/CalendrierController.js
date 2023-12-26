'use strict';

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

const addMultiCalendriers = async (req, res) => {
    try {
      if (req.decoded.username === req.params.username) {
        // Extract dates from incoming calendriers
        const datesOnly = req.body.events.map(calendrier => {
          return new Date(calendrier.dateVisite.split('T')[0]).toISOString();
        });
  
        // Check for existing calendriers with the same medecin and dateVisite
        const existingCalendriers = await calendrierModel.find({
          medecin: { $in: req.body.events.map(calendrier => calendrier.medecin) },
          dateVisite: {
            $gte: datesOnly,
            $lt: datesOnly.map(date => new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString())
          },
        });
        console.log(existingCalendriers);
  
        if (existingCalendriers.length > 0) {
          return res.status(400).json({ success: false, message: 'One or more calendriers with the same medecin and dateVisite already exist' });
        }
  
        // If no conflicts, proceed with inserting calendriers
        const resultats = await calendrierModel.insertMany([...req.body.events]);
        const newRes = await calendrierModel.populate(resultats, { path: 'medecin' });
  
        return res.status(200).json(newRes);
      } else {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

const updateCalendrier= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats= await calendrierModel.findOneAndUpdate({_id:req.params.id},{$set: {...req.body}},{ new: true }).populate("medecin").populate({
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

const updateCalendrierDate = async (req, res) => {
    try {
      if (req.decoded.username === req.params.username) {
        const oldCl = await calendrierModel.findOne({ id: req.params.id });
  
        // Check if the new date already exists for the same medecin
        const existingCalendrier = await calendrierModel.findOne({
          medecin: oldCl.medecin,
          dateVisite: new Date(req.body.date),
        });
  
        if (existingCalendrier) {
          return res.status(400).json({ success: false, message: 'Calendrier with the same medecin and dateVisite already exists' });
        }
  
        const newCl = {
          medecin: oldCl.medecin,
          dateVisite: req.body.date,
          status: 0,
          produitCalendriers: [...oldCl.produitCalendriers],
          delegue: oldCl.delegue,
          note: oldCl.note,
        };
  
        const Calendrier = new calendrierModel(newCl);
        const rep = await Calendrier.save();
        const resultats = await calendrierModel.findOne({ _id: rep._id }).populate('medecin');
        return res.status(200).json(resultats);
      } else {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
};
  

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
    getAllCalendriers, getOneCalendrier, addCalendrier, updateCalendrier, deleteCalendrier, updateCalendrierStatus, addMultiCalendriers, updateCalendrierDate
}
