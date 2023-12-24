const express=require('express');
const cron = require('node-cron');
require('dotenv').config();
const db=require("./database/connect");
const app=express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
// Content-type: application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// auth route
const authRoute=require('./routes/auth');
app.use("/api/",authRoute);

// auth middleware
const {verifyToken} = require("./controller/authController");
app.use((req, res, next)=>{
    verifyToken(req, res, next);
});

// user route
const userRoute=require('./routes/web');
const { updateCalendrierStatus } = require('./controller/CalendrierController');
app.use("/api/",userRoute);

app.listen(PORT,()=>{
    console.log("Le serveur est démaré sur le port "+PORT);
});



// Define the cron job schedule to run every midnight in Morocco time
const cronJob = cron.schedule('0 0 * * *', async () => {
    try {
      const result = await updateCalendrierStatus();
      console.log(`Cron job executed. ${result.modifiedCount} calendrier entries updated.`);
    } catch (error) {
      console.error('Error during cron job:', error);
    }
  },{
    scheduled: true,
    timezone: 'Africa/Casablanca', // Set the timezone to Morocco
  });
  
// Start the cron job
cronJob.start();
  
// Handle cleanup (optional)
process.on('SIGINT', () => {
    console.log('Cron job stopped gracefully.');
    cronJob.stop();
    mongoose.connection.close();
    process.exit();
});