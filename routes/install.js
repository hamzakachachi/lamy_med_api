const delegueModel = require(__dirname +'/../model/Delegue');
const delegues = [{
    "_id": {
      "$oid": "635f154a0000000000000001"
    },
    "nom": "lamy",
    "prenom": "med",
    "username": "lamy_med",
    "password": "$2a$10$twKRk23pvigPqaX.OycRIe.jFFcsUSgn8CNviDs.B5iHBXRiB3oua",
    "createdAt": {
      "$date": "2023-12-24T02:25:30.000Z"
    },
    "updatedAt": {
      "$date": "2023-12-24T02:25:30.000Z"
    },
    "lastActivities": null,
    "status": "active"
  },
  {
    "_id": {
      "$oid": "635f154a0000000000000002"
    },
    "nom": "Johnson",
    "prenom": "Jane",
    "username": "jjohnson",
    "password": "$2a$10$twKRk23pvigPqaX.OycRIe.jFFcsUSgn8CNviDs.B5iHBXRiB3oua",
    "createdAt": {
      "$date": "2023-12-24T02:25:30.000Z"
    },
    "updatedAt": {
      "$date": "2023-12-24T02:25:30.000Z"
    },
    "lastActivities": null,
    "status": "inactive"
  },
  {
    "_id": {
      "$oid": "635f154a0000000000000003"
    },
    "nom": "Williams",
    "prenom": "Bob",
    "username": "bwilliams",
    "password": "$2a$10$twKRk23pvigPqaX.OycRIe.jFFcsUSgn8CNviDs.B5iHBXRiB3oua",
    "createdAt": {
      "$date": "2023-12-24T02:25:30.000Z"
    },
    "updatedAt": {
      "$date": "2023-12-24T02:25:30.000Z"
    },
    "lastActivities": null,
    "status": "active"
}];
delegueModel.insertMany(delegues)
  .then((result) => {
    console.log('Delegues inserted successfully:', result);
  })
  .catch((error) => {
    console.error('Error inserting Delegues:', error);
  });
  
// ===============================================
const productModel = require(__dirname +'/../model/Produit');
const produits = [{
    "_id": {
      "$oid": "635f154a000000000000000b"
    },
    "intitule": "Aspirin",
    "createdAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "nbStock": 100
  },
  {
    "_id": {
      "$oid": "635f154a000000000000000c"
    },
    "intitule": "Ibuprofen",
    "createdAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "nbStock": 100
  },
  {
    "_id": {
      "$oid": "635f154a000000000000000d"
    },
    "intitule": "Paracetamol",
    "createdAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "nbStock": 100
  },
  {
    "_id": {
      "$oid": "635f154a000000000000000e"
    },
    "intitule": "Antihistamine",
    "createdAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "nbStock": 100
  },
  {
    "_id": {
      "$oid": "635f154a000000000000000f"
    },
    "intitule": "Bandages",
    "createdAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "updatedAt": {
      "$date": "2023-12-24T03:00:00.000Z"
    },
    "nbStock": 150
  }]
productModel.insertMany(produits)
  .then((result) => {
    console.log('produits inserted successfully:', result);
  })
  .catch((error) => {
    console.error('Error inserting produits:', error);
  });

  