'use strict';

const Calendrier = require(__dirname +'/../model/Calendrier');
const Delegue = require(__dirname +'/../model/Delegue');
const { notify } = require(__dirname +"/NotificationController");


const getAllCalendriers = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const user = await Delegue.findOne({
                where: { username: req.params.username },
                attributes: ['id']
            });
            const resultats = await Calendrier.findAll({
                where: {
                    delegueId: user.id,
                    deleted: false
                },
                include: [
                    { model: Medecin },
                    {
                        model: Produit,
                        through: { attributes: [] }, // Assuming many-to-many relationship through 'produitCalendriers'
                        attributes: ['intitule', 'nbStock']
                    }
                ]
            });
            res.status(200).json(resultats);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOneCalendrier = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const resultats = await Calendrier.findOne({
                where: {
                    id: req.params.id,
                    username: req.params.username
                }
            });
            if (!resultats) {
                return res.status(404).json({ success: false, message: 'Calendrier not found' });
            }
            res.status(200).json(resultats);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addCalendrier = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const calendrier = await Calendrier.create({ ...req.body });
            res.status(200).json(calendrier);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addMultiCalendriers = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const datesOnly = req.body.events.map(calendrier => {
                return new Date(calendrier.dateVisite.split('T')[0]).toISOString();
            });

            const existingCalendriers = await Calendrier.findAll({
                where: {
                    medecinId: req.body.events.map(calendrier => calendrier.medecinId),
                    dateVisite: {
                        [Sequelize.Op.between]: [datesOnly[0], new Date(new Date(datesOnly[0]).getTime() + 24 * 60 * 60 * 1000)]
                    },
                    deleted: false
                }
            });

            if (existingCalendriers.length > 0) {
                notify({
                    title: "Erreur",
                    message: "Une erreur s'est produite lors de l'ajout du rendez-vous. Le rendez-vous est déjà exist pour la date: " + datesOnly[0].split('T')[0],
                    recipient: req.decoded.username,
                    type: "error"
                });
                return res.status(400).json({ success: false, message: 'One or more calendriers with the same medecin and dateVisite already exist' });
            }

            const resultats = await Calendrier.bulkCreate([...req.body.events]);
            const newRes = await Calendrier.findAll({
                where: { id: resultats.map(r => r.id) },
                include: [{ model: Medecin }]
            });

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
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateCalendrier = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const calendrier = await Calendrier.findByPk(req.params.id);
            if (!calendrier) {
                return res.status(404).json({ success: false, message: 'Calendrier not found' });
            }
            await calendrier.update({ ...req.body });
            await calendrier.reload({ include: [{ model: Medecin }, { model: Produit, through: { attributes: [] }, attributes: ['intitule', 'nbStock'] }] });

            notify({
                title: "Succès",
                message: `Le rendez-vous a été modifié avec succés.`,
                recipient: req.decoded.username,
                type: "success"
            });
            res.status(200).json(calendrier);
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modification du rendez-vous.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCalendrierDate = async (req, res) => {
    try {
        if (req.decoded.username === req.params.username || req.decoded.role === "admin") {
            const oldCl = await Calendrier.findByPk(req.params.id);
            if (!oldCl) {
                return res.status(404).json({ success: false, message: 'Calendrier not found' });
            }
            const datesOnly = new Date(req.body.date.split('T')[0]).toISOString();
            const existingCalendrier = await Calendrier.findOne({
                where: {
                    medecinId: oldCl.medecinId,
                    dateVisite: {
                        [Sequelize.Op.between]: [datesOnly, new Date(new Date(datesOnly).getTime() + 24 * 60 * 60 * 1000)]
                    },
                    deleted: false
                }
            });

            if (existingCalendrier) {
                notify({
                    title: "Erreur",
                    message: "Une erreur s'est produite lors de la modification du rendez-vous. Le rendez-vous est déjà exist pour la date: " + req.body.date.split('T')[0],
                    recipient: req.decoded.username,
                    type: "error"
                });
                return res.status(400).json({ success: false, message: 'Calendrier with the same medecin and dateVisite already exists' });
            }

            const newCl = {
                medecinId: oldCl.medecinId,
                dateVisite: req.body.date,
                status: 0,
                produitCalendriers: [...oldCl.produitCalendriers],
                delegueId: oldCl.delegueId,
                note: oldCl.note,
            };

            const calendrier = await Calendrier.create(newCl);
            await calendrier.reload({ include: [{ model: Medecin }] });

            notify({
                title: "Succès",
                message: `La date du rendez-vous a été modifiée avec succès à ${datesOnly.split('T')[0]}.`,
                recipient: req.decoded.username,
                type: "success"
            });
            return res.status(200).json(calendrier);
        } else {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la modification du rendez-vous. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateCalendrierStatus = async (req = null, res = null) => {
    try {
        const moroccoTimeZone = 'Africa/Casablanca';
        const currentDateInMorocco = new Date().toLocaleString('en-US', { timeZone: moroccoTimeZone });

        const result = await Calendrier.update(
            { status: 2 },
            {
                where: {
                    dateVisite: { [Sequelize.Op.lt]: currentDateInMorocco },
                    status: 0
                }
            }
        );

        console.log(`Cron job executed. ${result[0]} calendrier entries updated.`);

        if (res) {
            return res.status(200).json({ success: true, message: `Cron job executed. ${result[0]} calendrier entries updated.` });
        } else {
            return result;
        }
    } catch (error) {
        console.error('Error during cron job:', error);
        if (res) {
            return res.status(500).json({ success: false, message: `Error during cron job: ${error.message}` });
        }
    }
};

const deleteCalendrier = async (req, res) => {
    try {
        const calendrier = await Calendrier.findByPk(req.params.id);
        if (!calendrier) {
            return res.status(404).json({ success: false, message: 'Calendrier not found' });
        }
        await calendrier.update({ deleted: true });

        notify({
            title: "Succès",
            message: `Produit ${calendrier.intitule} a été supprimé avec succés.`,
            recipient: req.decoded.username,
            type: "success"
        });
        res.status(200).json(calendrier);
    } catch (error) {
        notify({
            title: "Erreur",
            message: "Une erreur s'est produite lors de la suppression du Produit. Veuillez réessayer.",
            recipient: req.decoded.username,
            type: "error"
        });
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllCalendriers,
    getOneCalendrier,
    addCalendrier,
    updateCalendrier,
    deleteCalendrier,
    updateCalendrierStatus,
    addMultiCalendriers,
    updateCalendrierDate
};
