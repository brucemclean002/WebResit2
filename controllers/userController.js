const User = require('../models/user');

// Render the admin dashboard with a list of users
exports.getAdminDashboard = (req, res) => {
    User.findAll((err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Error fetching users');
        }
        res.render('admin', { title: 'Admin Dashboard', users }, (err, html) => {
            if (err) {
                console.error('Error rendering the admin page:', err);
                return res.status(500).send('Error rendering the page');
            }
            res.render('layouts/main', {
                title: 'Admin Dashboard',
                user: req.session.user,
                body: html
            });
        });
    });
};

// Handle adding a new user
exports.addUser = (req, res) => {
    const { email, password, role } = req.body;

    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            console.error('Error checking email:', err);
            return renderAdminPageWithError(res, 'Error checking email.');
        }

        if (existingUser) {
            return renderAdminPageWithError(res, 'This email is already in use.');
        }

        User.create({ email, password, role }, (err) => {
            if (err) {
                console.error('Error adding user:', err);
                return renderAdminPageWithError(res, 'Error adding user.');
            }
            res.redirect('/admin');
        });
    });
};

// Helper function to render the admin page with an error message
function renderAdminPageWithError(res, errorMessage) {
    User.findAll((err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Error fetching users');
        }

        res.render('admin', { error: errorMessage, users: users }, (err, html) => {
            if (err) return res.status(500).send('Error rendering the page');
            res.render('layouts/main', {
                title: 'Admin Dashboard',
                body: html
            });
        });
    });
}




// Render the edit-user page
exports.editUser = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err || !user) return res.redirect('/admin');
        res.render('edit-user', { 
            title: 'Edit User', 
            user, 
            isUser: user.role === 'user',
            isVolunteer: user.role === 'volunteer',
            isManager: user.role === 'manager' 
        }, (err, html) => {
            if (err) return res.status(500).send('Error rendering the edit-user page');
            res.render('layouts/main', { title: 'Edit User', body: html });
        });
    });
};

// Handle updating an existing user
exports.updateUser = (req, res) => {
    const { email, password, role } = req.body;
    User.findByEmail(email, (err, existingUser) => {
        if (err || (existingUser && existingUser._id !== req.params.id)) {
            return res.render('edit-user', { 
                title: 'Edit User', 
                error: existingUser ? 'Email already in use' : 'Error checking email', 
                user: req.body, 
                isUser: req.body.role === 'user',
                isVolunteer: req.body.role === 'volunteer',
                isManager: req.body.role === 'manager'
            });
        }
        const updateData = { email, role };
        if (password) updateData.password = password;
        User.update(req.params.id, updateData, (err) => {
            if (err) {
                return res.render('edit-user', { 
                    title: 'Edit User', 
                    error: 'Failed to update user.', 
                    user: req.body, 
                    isUser: req.body.role === 'user',
                    isVolunteer: req.body.role === 'volunteer',
                    isManager: req.body.role === 'manager'
                });
            }
            res.redirect('/admin');
        });
    });
};

// Handle deleting a user
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    const currentUserId = req.session.user._id;
    if (userId === currentUserId) {
        return res.redirect('/admin?error=You cannot delete your own account.');
    }
    User.delete(userId, (err) => {
        if (err) return res.redirect('/admin?error=Error deleting user.');
        res.redirect('/admin');
    });
};
