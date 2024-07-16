const Delegue = require('../model/Delegue');
const Produit = require('../model/Produit');
const sequelize = require('../database/connect');

const delegues = [
  {
    id: "1",
    nom: "lamy",
    prenom: "med",
    username: "lamy_med",
    password: "$2a$10$twKRk23pvigPqaX.OycRIe.jFFcsUSgn8CNviDs.B5iHBXRiB3oua",
    createdAt: "2023-12-24T02:25:30.000Z",
    updatedAt: "2023-12-24T02:25:30.000Z",
    lastActivities: null,
    status: "active"
  },
  {
    id: "2",
    nom: "Johnson",
    prenom: "Jane",
    username: "jjohnson",
    password: "$2a$10$twKRk23pvigPqaX.OycRIe.jFFcsUSgn8CNviDs.B5iHBXRiB3oua",
    createdAt: "2023-12-24T02:25:30.000Z",
    updatedAt: "2023-12-24T02:25:30.000Z",
    lastActivities: null,
    status: "inactive"
  },
  {
    id: "3",
    nom: "Williams",
    prenom: "Bob",
    username: "bwilliams",
    password: "$2a$10$twKRk23pvigPqaX.OycRIe.jFFcsUSgn8CNviDs.B5iHBXRiB3oua",
    createdAt: "2023-12-24T02:25:30.000Z",
    updatedAt: "2023-12-24T02:25:30.000Z",
    lastActivities: null,
    status: "active"
  }
];

const produits = [
  {
    id: "1",
    intitule: "Aspirin",
    createdAt: "2023-12-24T03:00:00.000Z",
    updatedAt: "2023-12-24T03:00:00.000Z",
    nbStock: 100
  },
  {
    id: "2",
    intitule: "Ibuprofen",
    createdAt: "2023-12-24T03:00:00.000Z",
    updatedAt: "2023-12-24T03:00:00.000Z",
    nbStock: 100
  },
  {
    id: "3",
    intitule: "Paracetamol",
    createdAt: "2023-12-24T03:00:00.000Z",
    updatedAt: "2023-12-24T03:00:00.000Z",
    nbStock: 100
  },
  {
    id: "4",
    intitule: "Antihistamine",
    createdAt: "2023-12-24T03:00:00.000Z",
    updatedAt: "2023-12-24T03:00:00.000Z",
    nbStock: 100
  },
  {
    id: "5",
    intitule: "Bandages",
    createdAt: "2023-12-24T03:00:00.000Z",
    updatedAt: "2023-12-24T03:00:00.000Z",
    nbStock: 150
  }
];

sequelize.sync({ force: true }).then(async () => {
  try {
    await Delegue.bulkCreate(delegues);
    console.log('Delegues inserted successfully.');

    await Produit.bulkCreate(produits);
    console.log('Produits inserted successfully.');

    await sequelize.close();
  } catch (error) {
    console.error('Error inserting data:', error);
  }
});
