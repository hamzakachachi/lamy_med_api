'use strict';

const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const Session = require(__dirname +'/../model/Session'); 
const Delegue = require(__dirname +'/../model/Delegue');
const { notify } = require(__dirname +"/NotificationController");

const auth = async function(req, res) {
    try {
        const user = await Delegue.findOne({ where: { username: req.body.username } });
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else {
            const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
            if (!passwordsMatch) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else if (!req.body.deviceId) {
                res.json({ success: false, message: 'Authentication failed. Device ID not found.' });
            } else {
                const payload = {
                    id: user.id,
                    role: user.role,
                    username: user.username
                };
                const secretKey = uniqid();
                const sessionData = {
                    username: req.body.username,
                    deviceId: req.body.deviceId,
                    role: user.role,
                    secret: secretKey
                };

                let session = await Session.findOne({
                    where: {
                        username: req.body.username,
                        deviceId: req.body.deviceId
                    }
                });

                if (session) {
                    await session.update(sessionData);
                } else {
                    session = await Session.create(sessionData);
                }

                const token = jwt.sign(payload, secretKey, {
                    expiresIn: "24h"
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const verifyToken = async function(req, res, next) {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    const deviceId = req.headers['x-access-device-id'] || req.body.deviceId || req.query.deviceId;
    const username = req.headers['x-access-username'] || req.body.username || req.query.username;

    if (!token || !deviceId || !username) {
        return res.status(403).send({
            success: false,
            message: 'Token, Device ID, or Username not provided.'
        });
    }

    try {
        const session = await Session.findOne({ where: { deviceId: deviceId, username: username } });
        if (session) {
            const secretKey = session.secret;
            jwt.verify(token, secretKey, function(err, decoded) {
                if (err) {
                    return res.status(500).json({ success: false, message: err.message });
                }
                req.decoded = decoded;
                next();
            });
        } else {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const logout = async function(req, res) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const deviceId = req.body.deviceId || req.query.deviceId || req.headers['x-access-device-id'];
    const username = req.body.username || req.query.username || req.headers['x-access-username'];

    if (token && deviceId && username) {
        try {
            const result = await Session.destroy({ where: { deviceId: deviceId, username: username } });
            if (result) {
                return res.status(200).send({
                    success: true,
                    message: 'Logged out successfully.'
                });
            } else {
                return res.status(500).json({ success: false, message: 'Failed to log out.' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    } else {
        return res.status(403).send({
            success: false,
            message: 'Token, Device ID, or Username not provided.'
        });
    }
};

module.exports = {
    auth,
    logout,
    verifyToken
};

