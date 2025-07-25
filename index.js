const express=require('express');
const cron = require('node-cron');
require('dotenv').config();
const cors=require('cors');
const sequelize=require(__dirname +"/database/connect");

const connectDB = async () => {
  try {
      await sequelize.sync({ force: false });
      console.log('Connection to the database has been established successfully.');
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
};


const app=express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
// const SOCKET_PORT = process.env.SOCKET_PORT;

// const { Server } = require("socket.io");

// const io = new Server({
//   cors: {
//     origin : "*",
//     methods:['GET','POST']
//   },
// });

// io.on("connection", (socket) => {
//   console.log('====================================');
//   console.log("connection");
//   console.log('====================================');
//   // socket.on("newNotification", ({ senderName, receiverName, type }) => {
//   //   const receiver = getUser(receiverName);
//   //   io.to(receiver.socketId).emit("getNotification", {
//   //     senderName,
//   //     type,
//   //   });
//   // });

//   socket.on("disconnect", () => {
//     console.log("disconnect");
//   });
// });

// io.listen(SOCKET_PORT);
// console.log(SOCKET_PORT);
// Content-type: application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(cors({
  origin : "*",
  methods:['GET','POST','PUT','DELETE']
}))
// auth route
const authRoute=require(__dirname +'/routes/auth');
app.use("/api/",authRoute);


const cronRoute=require(__dirname +'/routes/cron');
app.use("/api/",cronRoute);

// auth middleware
const {verifyToken} = require(__dirname +"/controller/authController");
app.use((req, res, next)=>{
    console.log(req.body, req.url);
    verifyToken(req, res, next);
});

// user route
const userRoute=require(__dirname +'/routes/web');
const { updateCalendrierStatus } = require(__dirname +'/controller/CalendrierController');
app.use("/api/",userRoute);

http.listen(PORT || 3000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at https://%s:%s', host, port)
});

io.on('connection', function(socket) {
  console.log('Client connected to the WebSocket');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // socket.on('chat message', function(msg) {
  //   console.log("Received a chat message");
  //   io.emit('chat message', msg);
  // });
})

const notificationController = require(__dirname + '/controller/NotificationController');
notificationController.setIo(io);

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
    // mongoose.connection.close();
    process.exit();
});



connectDB();

// ===========================
// const install = require(__dirname +"/routes/install");
// ==========================================