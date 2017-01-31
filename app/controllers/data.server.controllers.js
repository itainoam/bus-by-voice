var msgs = ['testMsg'];

exports.getMsgs = function (req, res) {
    res.send(msgs);
};

exports.addMsg = function (req, res,next) {
    console.log(req);
    next()
};

exports.addMsgGET = function (req, res,next) {
    console.log(req.data);
    msgs.push(req.data);
    res.send(req.params)
};
