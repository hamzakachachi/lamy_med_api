'use strict';
const  Notification  = require('../model/Notification'); // Assuming your Sequelize models are defined and exported correctly

let io;

const setIo = (socketIo) => {
  io = socketIo;
};

const getNotifications = async (req, res) => {
  try {
    if (req.params.username === req.decoded.username) {
      const recipient = req.params.username;
      const notifications = await Notification.findAll({
        where: { recipient },
        order: [['createdAt', 'DESC']],
      });
      res.status(200).json(notifications);
    } else {
      res.status(403).json({ success: false, message: 'Forbidden' });
    }
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ error: error.message });
  }
};

const notify = async (noti) => {
  try {
    const { title, message, recipient, type } = noti;
    const newNotification = await Notification.create({ title, message, recipient, type });

    // Emit the new notification over WebSocket
    if (io) {
      io.emit('newNotification-' + recipient, newNotification);
    } else {
      console.error('Socket.IO is not available');
    }

    return true;
  } catch (error) {
    console.error('Error notifying:', error);
    return error;
  }
};

module.exports = {
  notify,
  getNotifications,
  setIo,
};
