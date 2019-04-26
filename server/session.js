//@ts-check

var globalSession = {
    empty: true,
};

module.exports = function(req, res, next) {
    req.session = globalSession;
    next();
};