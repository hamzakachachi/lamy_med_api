const MedecinModel = require('../model/Medecin');
const DelegueModel = require('../model/Delegue');

const getAllMedecins = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username) {
            const user = await DelegueModel.findOne({ username: req.params.username },{_id:1});
            const resultats = await MedecinModel.find({assignedTo: user._id});
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const getOneMedecin = async (req,res)=>{
    try {
        if (req.decoded.username === req.params.username) {
            const resultats = await MedecinModel.findOne({username:req.params.username, id:req.params.id});
            res.status(200).json(resultats);
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        
        res.status(200).json({ success: false, message: error.message });
    }
}


const addMedecin = async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const Medecin = new MedecinModel({...req.body});
            const resultats= await Medecin.save();
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


const updateMedecin= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats= await MedecinModel.findOneAndUpdate({username:req.params.username, id:req.params.id},{...req.body});
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


const deleteMedecin= async (req,res)=>{
    try {
        
        if (req.decoded.username === req.params.username) {
            const resultats=await MedecinModel.findOneAndDelete({username:req.params.username, id:req.params.id});
            res.status(200).json(resultats);
        
        }else 
            res.status(403).json({ success: false, message: 'Forbidden' });
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
    
}


module.exports={
    getAllMedecins, getOneMedecin, addMedecin, updateMedecin, deleteMedecin
}
