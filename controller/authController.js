'use strict';

const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const Session = require(__dirname +'/../model/Session'); 
const delegueModel = require(__dirname +'/../model/Delegue');
const { notify } = require(__dirname +"/NotificationController");


const auth = async function(req, res) {
    // find the user
    try {
        console.log(req.body);
        const user = await delegueModel.findOne({username: req.body.username});
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
            if (!passwordsMatch) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                if (!req.body.deviceId) {
                    res.json({ success: false, message: 'Authentication failed. Device ID not found.' });
                } else {
                    // if user is found and password is right
                    // create a token with only our given payload
                    // we don't want to pass in the entire user since that has the password
                    const payload = {
                        id: user._id,
                        role: user.role,
                        username: user.username
                    };
                    var secretKey = uniqid();
                    // save session to db
                    var sess = {
                        username: req.body.username,
                        deviceId: req.body.deviceId,
                        role: user.role,
                        secret: secretKey
                    };

                    var s = await Session.findOne({
                        username: req.body.username,
                        deviceId: req.body.deviceId
                    });

                    if (s) {
                        await s.updateOne(sess); 
                    } else {
                        s = new Session({...sess});
                        await s.save();
                    }

                    var token = jwt.sign(payload, secretKey, {
                        expiresIn: "24h" // expires in 24 hours
                    });
                    
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        }

    } catch (error) {
        return res.status(200).json({ success: false, message: error.message });
    }
      
};

const verifyToken = async function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'] || req.body.token || req.query.token;
    var deviceId = req.headers['x-access-device-id'] || req.body.deviceId || req.query.deviceId;
    var username = req.headers['x-access-username'] || req.body.username || req.query.username;
    
    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
    if (!deviceId) {
        return res.status(403).send({
            success: false,
            message: 'No Device Id provided.'
        });
    }
    if (!username) {
        return res.status(403).send({
            success: false,
            message: 'No Username provided.'
        });
    }
    // get secret key on db
    try {
        var sess = await Session.findOne({ "deviceId": deviceId, "username": username });
        if (sess) {
            var secretKey = sess.secret;
            // verifies secret and checks exp
            jwt.verify(token, secretKey, function(err, decoded) {
                if (err) {
                    return res.status(200).json({ success: false, message: err.message });
                }
                if (next) {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                } else {
                    return res.status(200).send(decoded);
                }
            });
        } else {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
    } catch (error) {
        return res.status(200).json({ success: false, message: error.message });
    }
    
};


// route to show a random message (GET http://localhost:8080/api/)
const logout = async function(req, res) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var deviceId = req.body.deviceId || req.query.deviceId || req.headers['x-access-device-id'];
    var username = req.body.username || req.query.username || req.headers['x-access-username'];
    // decode token
    if (token && deviceId && username) {
        // remove session key on db
        try {
            const rep = await Session.findOneAndDelete({ "deviceId": deviceId, "username": username });
            if (rep) {
                return res.status(200).send({
                    success: true,
                    message: ''
                });
            }
            
        } catch (error) {
            return res.status(200).json({ success: false, message: error.message });
        }
        
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};

module.exports={
    auth, logout, verifyToken
}
