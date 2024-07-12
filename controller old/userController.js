'use strict';
const DelegueModel = require(__dirname + '/../model/Delegue');
const { notify } = require(__dirname + "/NotificationController");
const bcrypt = require('bcrypt');

const getAllDelegues = async (req, res) => {
    try {
        const resultats = await DelegueModel.aggregate([
            {
                $match: {
                    username: { $ne: req.decoded.username },
                    $or: [
                        { deleted: false },
                        { deleted: { $exists: false } }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'calendriers', // Assuming the collection name is 'calendriers'
                    localField: '_id',
                    foreignField: 'delegue',
                    as: 'calendriers',
                },
            },
            {
                $project: {
                    _id: 1,
                    nom: 1,
                    prenom: 1,
                    username: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lastActivities: 1,
                    status: 1,
                    role: 1,
                    countStatus0: {
                        $size: {
                            $filter: {
                                input: '$calendriers',
                                as: 'calendrier',
                                cond: {
                                    $and: [
                                        { $eq: [{ $ifNull: ['$$calendrier.deleted', false] }, false] },
                                        { $eq: ['$$calendrier.status', 0] },
                                    ],
                                },
                            },
                        },
                    },
                    countStatus1: {
                        $size: {
                            $filter: {
                                input: '$calendriers',
                                as: 'calendrier',
                                cond: {
                                    $and: [
                                        { $eq: [{ $ifNull: ['$$calendrier.deleted', false] }, false] },
                                        { $eq: ['$$calendrier.status', 1] },
                                    ],
                                },
                            },
                        },
                    },
                    countStatus2: {
                        $size: {
                            $filter: {
                                input: '$calendriers',
                                as: 'calendrier',
                                cond: {
                                    $and: [
                                        { $eq: [{ $ifNull: ['$$calendrier.deleted', false] }, false] },
                                        { $eq: ['$$calendrier.status', 2] },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        ]);
        res.status(200).json(resultats);

    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
}

// const getOneByMat= async (req,res)=>{
//     const resultats=await userModel.findOne({matricule:req.params.matricule});
//     res.status(200).json(resultats);
// }

// const getOneByUserName= async (req,res)=>{
//     const resultats=await userModel.findOne({username:req.params.username},{password:0, matricule:0, addresse:0, CIN:0});
//     res.status(200).json(resultats);
// }

const getMyInfos = async (req, res) => {
    try {
        if (req.params.username === req.decoded.username) {
            const resultats = await DelegueModel.findOne({ username: req.params.username }, { password: 0 });
            res.status(200).json(resultats);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }

    } catch (error) {
        res.status(404).json({ success: false, message: err.message });
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

const addUser = async (req, res) => {
    try {
        const user = new DelegueModel({ ...req.body });
        user.password = await bcrypt.hash(req.body.password, 10);
        const resultats = await user.save();
        if(!resultats){
            throw new Error('username is duplicated');
        }
        const rep = await DelegueModel.aggregate([
            {
                $match: {
                    username: resultats.username ,
                    $or: [
                        { deleted: false },
                        { deleted: { $exists: false } }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'calendriers', // Assuming the collection name is 'calendriers'
                    localField: '_id',
                    foreignField: 'delegue',
                    as: 'calendriers',
                },
            },
            {
                $project: {
                    _id: 1,
                    nom: 1,
                    prenom: 1,
                    username: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lastActivities: 1,
                    status: 1,
                    role: 1,
                    countStatus0: {
                        $size: {
                            $filter: {
                                input: '$calendriers',
                                as: 'calendrier',
                                cond: {
                                    $and: [
                                        { $eq: [{ $ifNull: ['$$calendrier.deleted', false] }, false] },
                                        { $eq: ['$$calendrier.status', 0] },
                                    ],
                                },
                            },
                        },
                    },
                    countStatus1: {
                        $size: {
                            $filter: {
                                input: '$calendriers',
                                as: 'calendrier',
                                cond: {
                                    $and: [
                                        { $eq: [{ $ifNull: ['$$calendrier.deleted', false] }, false] },
                                        { $eq: ['$$calendrier.status', 1] },
                                    ],
                                },
                            },
                        },
                    },
                    countStatus2: {
                        $size: {
                            $filter: {
                                input: '$calendriers',
                                as: 'calendrier',
                                cond: {
                                    $and: [
                                        { $eq: [{ $ifNull: ['$$calendrier.deleted', false] }, false] },
                                        { $eq: ['$$calendrier.status', 2] },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        ]);

        notify({
            title: "Succès",
            message: `Délégué ${resultats.nom} ${resultats.prenom} a été ajouté avec succés.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(rep[0]);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de l'ajout du Délégué. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(404).json({ success: false, message: error.message });
    }

}


const updateUser = async (req, res) => {
    try {
        if (req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const resultats = await DelegueModel.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true });

        if (!resultats) {
            // Handle the case where no user is found for the given username
            throw new Error('username is duplicated');
        }

        notify({
            title: "Succès",
            message: `Délégué ${resultats.nom} ${resultats.prenom} a été modifié avec succés.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(resultats);
    } catch (error) {

        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modification du Délégué. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(404).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const resultats = await DelegueModel.findOneAndUpdate({ _id: req.params.id },{$set:{deleted : true}},{ new: true });

        if (!resultats) {
            // Handle the case where no user is found for the given username
            return res.status(404).json({ error: "User not found" });
        }

        notify({
            title: "Succès",
            message: `Délégué ${resultats.nom} ${resultats.prenom} a été supprimé avec succés.`,
            recipient: req.decoded.username,
            type: "success"
        });

        res.status(200).json(resultats);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la suppression du Délégué. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(404).json({ success: false, message: error.message });
    }
};



module.exports = {
    getMyInfos, addUser, deleteUser, updateUser, getAllDelegues
}
