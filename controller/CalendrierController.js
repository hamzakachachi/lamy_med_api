'use strict';

const calendrierModel = require(__dirname +'/../model/Calendrier');
const DelegueModel = require(__dirname +'/../model/Delegue');
const { notify } = require(__dirname +"/NotificationController");


const getAllCalendriers = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const user = await DelegueModel.findOne({ username: req.params.username },{_id:1});
            const resultats = await calendrierModel.find({
              delegue: user._id,
              $or: [
                { deleted: false },
                { deleted: { $exists: false } }
              ]
            }).populate('medecin')  // Populate the 'medecin' field with doctor details
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
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const resultats = await calendrierModel.findOne({username:req.params.username, _id:req.params.id});
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const addCalendrier = async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
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
      if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
        // Extract dates from incoming calendriers
        const datesOnly = req.body.events.map(calendrier => {
          return new Date(calendrier.dateVisite.split('T')[0]).toISOString();
        });
  
        // Check for existing calendriers with the same medecin and dateVisite
        const existingCalendriers = await calendrierModel.find({
          medecin: { $in: req.body.events.map(calendrier => calendrier.medecin) },
          dateVisite: {
            $gte: datesOnly[0],
            $lt: new Date(new Date(datesOnly[0]).getTime() + 24 * 60 * 60 * 1000).toISOString()
          },
          $or: [
            { deleted: false },
            { deleted: { $exists: false } }
          ]
        });
        console.log(existingCalendriers);
  
        if (existingCalendriers.length > 0) {
          
          notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout du rendez-vous. Le rendez-vous est déjà exist pour la date: "+datesOnly[0].split('T')[0],
            recipient: req.decoded.username,
            type: "error"
          });
          return res.status(400).json({ success: false, message: 'One or more calendriers with the same medecin and dateVisite already exist' });
        }
        // If no conflicts, proceed with inserting calendriers
        const resultats = await calendrierModel.insertMany([...req.body.events]);
        const newRes = await calendrierModel.populate(resultats, { path: 'medecin' });
        
        notify({
            title: "Succès",
            message: `Le rendez-vous a été ajouté avec succés à la date ${datesOnly[0].split('T')[0]}.`,
            recipient: req.decoded.username,
            type: "success"
        });
        return res.status(200).json(newRes);
      } else {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    } catch (error) {
      notify({
        title: "Erreur",
        message: "Une erreur s'est produite lors de l'ajout du rendez-vous. Veuillez réessayer.",
        recipient: req.decoded.username,
        type: "error"
      });
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

const updateCalendrier= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const resultats= await calendrierModel.findOneAndUpdate({_id:req.params.id},{$set: {...req.body}},{ new: true }).populate("medecin").populate({
                path: 'produitCalendriers.produit',  // Populate the 'produit' within 'produitCalendriers'
                select: 'intitule nbStock'  // Select specific product fields
            });
            
            notify({
                title: "Succès",
                message: `Le rendez-vous a été modifié avec succés.`,
                recipient: req.decoded.username,
                type: "success"
            });
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        notify({
          title: "Erreur",
          message: "Une erreur s'est produite lors de la modifification du rendez-vous.",
          recipient: req.decoded.username,
          type: "error"
        });
        res.status(200).json({ success: false, message: error.message });
    }
    
}

const updateCalendrierDate = async (req, res) => {
    try {
      if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
        const oldCl = await calendrierModel.findOne({ _id: req.params.id });
        const datesOnly = new Date(req.body.date.split('T')[0]).toISOString();
        // Check if the new date already exists for the same medecin
        const existingCalendrier = await calendrierModel.findOne({
          medecin: oldCl.medecin,
          dateVisite: {
            $gte: datesOnly,
            $lt: new Date(new Date(datesOnly).getTime() + 24 * 60 * 60 * 1000).toISOString()
          },
          $or: [
            { deleted: false },
            { deleted: { $exists: false } }
          ]
        });
  
        if (existingCalendrier) {
          
          notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modifification du rendez-vous. Le rendez-vous est déjà exist pour la date: "+ req.body.date.split('T')[0],
            recipient: req.decoded.username,
            type: "error"
          });
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
        
        notify({
            title: "Succès",
            message: `La date du rendez-vous a été modifiée avec succès à ${+datesOnly.split('T')[0]} .`,
            recipient: req.decoded.username,
            type: "success"
        });
        return res.status(200).json(resultats);
      } else {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    } catch (error) {
      notify({
        title: "Erreur",
        message: "Une erreur s'est produite lors de la modifification du rendez-vous. Veuillez réessayer.",
        recipient: req.decoded.username,
        type: "error"
      });
      return res.status(500).json({ success: false, message: error.message });
    }
};
  

const updateCalendrierStatus = async (req = null, res = null) => {
  try {
      const moroccoTimeZone = 'Africa/Casablanca';

      // Get the current date and time in Morocco's time zone
      const currentDateInMorocco = new Date().toLocaleString('en-US', { timeZone: moroccoTimeZone });

      // Find and update calendrier entries where the date of visite has passed one day ago
      const result = await calendrierModel.updateMany(
          {
              dateVisite: { $lt: currentDateInMorocco },
              status: 0,
          },
          { $set: { status: 2 } } // Set status to 2 (or the desired status)
      );

      console.log(`Cron job executed. ${result.modifiedCount} calendrier entries updated.`);

      if (res) {
          return res.status(200).json({ success: true, message: `Cron job executed. ${result.modifiedCount} calendrier entries updated.` });
      } else {
          return result;
      }
  } catch (error) {
      console.error('Error during cron job:', error);
      console.log({ success: false, message: error.message });

      if (res) {
          return res.status(200).json({ success: false, message: `Error during cron job` });
      }
  }
};


const deleteCalendrier= async (req,res)=>{
  try {
    const resultats = await calendrierModel.findOneAndUpdate({ _id: req.params.id },{$set:{deleted : true}},{ new: true });
    notify({
        title: "Succès",
        message: `Produit ${resultats.intitule} a été supprimé avec succés.`,
        recipient: req.decoded.username,
        type: "success"
    });
    res.status(200).json(resultats);
} catch (error) {
    notify({
        title: "Erreur",
        message: "Une erreur s'est produite lors de la suppression du Produit. Veuillez réessayer.",
        recipient: req.decoded.username,
        type: "error"
    });
    res.status(200).json({ success: false, message: error.message });
}
    
}


module.exports={
    getAllCalendriers, getOneCalendrier, addCalendrier, updateCalendrier, deleteCalendrier, updateCalendrierStatus, addMultiCalendriers, updateCalendrierDate
}
