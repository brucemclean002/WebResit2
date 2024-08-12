const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./models/user');
const passUser = require('./middlewares/passUser');  // Middleware to pass the user session data

const app = express();

// Set up Mustache as the template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));  // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from the public directory
app.use(session({
    secret: 'secret-key',  // Session secret for signing cookies
    resave: false,  // Do not save session if unmodified
    saveUninitialized: true,  // Save uninitialized sessions
    cookie: { secure: false }  // Set to true if using HTTPS
}));

app.use(passUser);  // Use the passUser middleware to attach user data to res.locals

// Middleware to set user roles for templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isManager = req.session.user && req.session.user.role === 'manager';
    res.locals.isVolunteerOrManager = req.session.user && (req.session.user.role === 'volunteer' || req.session.user.role === 'manager');
    res.locals.isUser = req.session.user && req.session.user.role === 'user';
    next();
});

// Ensure a manager exists when the server starts
User.findByEmail('admin@example.com', (err, user) => {
    if (!user) {
        User.create({ email: 'admin@example.com', password: 'password', role: 'manager' }, (err) => {
            if (err) console.error('Error creating default manager:', err);
            else console.log('Default manager account created: admin@example.com / password');
        });
    }
});

// Importing routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const userRoutes = require('./routes/user');

// Using routes
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/', userRoutes);
app.use('/admin', userRoutes);

// Handle routes that do not require a specific controller

// Home page route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', user: req.session.user }, (err, html) => {
        if (err) {
            return res.status(500).send('Error rendering the page');
        }
        res.render('layouts/main', {
            title: 'Home',
            user: req.session.user,
            body: html // Inject the index content into the main layout
        });
    });
});

// About page route
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us', user: req.session.user }, (err, html) => {
        if (err) {
            return res.status(500).send('Error rendering the page');
        }
        res.render('layouts/main', {
            title: 'About Us',
            user: req.session.user,
            body: html // Inject the about content into the main layout
        });
    });
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
