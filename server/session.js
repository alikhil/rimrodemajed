//@ts-check

var globalSession = {
    empty: true,
    flows: {},
};

module.exports = function(req, res, next) {
    req.session = globalSession;
    next();
};