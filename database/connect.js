'use strict';
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set('strictQuery', true);
const mongoDB = process.env.DATABASE_URL + "/lamy_med_api";

main().then(() => { console.log('Réussi') }).catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoDB, { useNewUrlParser: "true" });
}
