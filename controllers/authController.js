const User = require('../models/user');

// Render the login page
exports.getLogin = (req, res) => {
    res.render('login', { title: 'Login' }, (err, html) => {
        if (err) return res.status(500).send('Error rendering the login page');
        res.render('layouts/main', { title: 'Login', body: html });
    });
};

// Handle login form submission
exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.error('Error finding user:', err);
            return renderLoginPageWithError(res, 'An error occurred, please try again.');
        }

        if (!user || user.password !== password) {
            return renderLoginPageWithError(res, 'Invalid email or password.');
        }

        // Successful login
        req.session.user = user;
        res.redirect('/');
    });
};

// Helper function to render the login page with an error message
function renderLoginPageWithError(res, errorMessage) {
    res.render('login', { error: errorMessage }, (err, html) => {
        if (err) {
            console.error('Error rendering the login page:', err);
            return res.status(500).send('Error rendering the page');
        }
        res.render('layouts/main', {
            title: 'Login',
            body: html
        });
    });
}


// Render the registration page
exports.getRegister = (req, res) => {
    res.render('register', { title: 'Register' }, (err, html) => {
        if (err) return res.status(500).send('Error rendering the register page');
        res.render('layouts/main', { title: 'Register', body: html });
    });
};

// Handle registration form submission
exports.postRegister = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            return res.render('register', { error: 'Error checking email.' }, (err, html) => {
                if (err) return res.status(500).send('Error rendering the page');
                res.render('layouts/main', {
                    title: 'Register',
                    body: html
                });
            });
        }

        if (existingUser) {
            return res.render('register', { error: 'This email is already in use.' }, (err, html) => {
                if (err) return res.status(500).send('Error rendering the page');
                res.render('layouts/main', {
                    title: 'Register',
                    body: html
                });
            });
        }

        User.create({ email, password, role: 'user' }, (err) => {
            if (err) {
                return res.render('register', { error: 'Error creating account.' }, (err, html) => {
                    if (err) return res.status(500).send('Error rendering the page');
                    res.render('layouts/main', {
                        title: 'Register',
                        body: html
                    });
                });
            }
            res.redirect('/auth/login');
        });
    });
};


// Handle user logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/');
        res.redirect('/auth/login');
    });
};
