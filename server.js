const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const { keycloak, memoryStore } = require('./config/keycloak_config');
const authRoutes = require('./routes/AuthRoutes');


const errorHandler = require('./middleware/error_handler');
const istitutiRoutes = require('./routes/IstitutiRoutes');


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Keycloak middleware
app.use(keycloak.middleware());

// Routes
app.use('/istituti',keycloak.protect(), istitutiRoutes);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
   res.render('index')
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});