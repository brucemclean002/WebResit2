// Middleware to pass user data to res.locals for use in views
module.exports = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};
