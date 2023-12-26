'use strict';
const DelegueModel = require(__dirname +'/../model/Delegue');


// const getAll = async (req,res)=>{
//     const resultats = await userModel.find()
//     res.status(200).json(resultats);
// }

// const getOneByMat= async (req,res)=>{
//     const resultats=await userModel.findOne({matricule:req.params.matricule});
//     res.status(200).json(resultats);
// }

// const getOneByUserName= async (req,res)=>{
//     const resultats=await userModel.findOne({username:req.params.username},{password:0, matricule:0, addresse:0, CIN:0});
//     res.status(200).json(resultats);
// }

const getMyInfos= async (req,res)=>{
    try {
        if (req.params.username === req.decoded.username) {
            const resultats=await DelegueModel.findOne({username:req.params.username},{password:0});
            res.status(200).json(resultats);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
        
    } catch (error) {
        res.status(200).json({ success: false, message: err.message });
    }
    
}
// const getUsersBySecteur= async (req,res)=>{
//     try {
//         const user = await userModel.findOne({username:req.decoded.username},{idSecteur:1});
//         if (req.params.secteur === user.idSecteur || req.decoded.role === 'admin') {
//             const resultats=await userModel.find({idSecteur:req.params.secteur},{password:0});
//             res.status(200).json(resultats);
//         } else {
//             res.status(403).json({ success: false, message: 'Forbidden' });
//         }
        
//     } catch (error) {
//         res.status(200).json({ success: false, message: error.message });
//     }
    
// }

// const updateMyInfos= async (req,res)=>{
//     try {
//         const {matricule, password, CIN, role, idSecteur, idCompagn} = req.body;
//         if (matricule || password || CIN || role || idSecteur || idCompagn) {
//             return res.status(403).json({ success: false, message: 'Forbidden' });
//         }
//         if (req.params.username === req.decoded.username) {
//             const resultats=await userModel.findOneAndUpdate({username:req.params.username},{...req.body});
//             return res.status(200).json(resultats);
//         } else {
//             return res.status(403).json({ success: false, message: 'Forbidden' });
//         }
        
//     } catch (error) {
//         res.status(200).json({ success: false, message: error.message });
//     }
    
// }

// const addUser= async (req,res)=>{
//     try {
//         const user = new userModel({...req.body});
//         const resultats= await user.save();
//         res.status(200).json(resultats);
//     } catch (error) {
//         res.status(200).json({ success: false, message: error.message });
//     }
    
// }


// const updateUser= async (req,res)=>{
//     const resultats= await userModel.findOneAndUpdate({matricule:req.params.matricule},{...req.body});
//     res.status(200).json(resultats);
// }

// const deleteUser= async (req,res)=>{
//     const resultats=await userModel.findOneAndDelete({matricule:req.params.matricule});
//     res.status(200).json(resultats);
// }


module.exports={
    getMyInfos,
}
