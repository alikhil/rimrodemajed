//@ts-check

var globalSession = {
    empty: true,
    ids: {},
};

module.exports = function(req, res, next) {
    req.session = globalSession;
    next();
};