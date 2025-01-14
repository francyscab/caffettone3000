const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const { keycloak, memoryStore } = require('./config/keycloak_config');
const errorHandler = require('./middleware/error_handler');
const apiRoutes = require('./routes/api_routes');
const authRoutes = require('./routes/auth_routes');
const ApiService = require('./services/api_service');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Keycloak middleware
app.use(keycloak.middleware());

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const cities = [
    {
        citta: "Milano",
        schoolCount: 15
    },
    {
        citta: "Roma",
        schoolCount: 20
    },
    {
        citta: "Napoli",
        schoolCount: 12
    },
    {
        citta: "Torino",
        schoolCount: 8
    },
    {
        citta: "Firenze",
        schoolCount: 6
    },
    {
        citta: "Bologna",
        schoolCount: 5
    }
];

app.get('/', keycloak.protect(), (req, res) => {
    console.log(req.kauth.grant.access_token.content)
    const userInfo = {
        name: req.kauth.grant.access_token.content.preferred_username || 'User',
        email: req.kauth.grant.access_token.content.email
    };

    res.render('index', {
        user: userInfo,
        cities: cities
    });
});

// Home route
/*app.get('/', keycloak.protect(), async (req, res, next) => {
    try {
        const userInfo = {
            name: req.kauth.grant.access_token.content.given_name || 'User',
            email: req.kauth.grant.access_token.content.email
        };

        const cities = await ApiService.getCities();
        res.render('index', { user: userInfo, cities: cities });
    } catch (error) {
        next(error);
    }
});*/

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});