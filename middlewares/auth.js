// Middleware to ensure the user is logged in
exports.ensureAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/auth/login');
};

// Middleware to ensure the user is a manager
exports.ensureManager = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'manager') return next();
    res.redirect('/');
};

// Middleware to ensure the user is either a volunteer or a manager
exports.ensureVolunteerOrManager = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'volunteer' || req.session.user.role === 'manager')) return next();
    res.redirect('/');
};
