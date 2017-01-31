var data = require('../controllers/data.server.controllers.js');

module.exports = function (app) {
    app.get('/msg',data.getMsgs)
};