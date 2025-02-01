const express = require('express');
const session = require('express-session');
const expressWs = require('express-ws');
const path = require('path');
const morgan = require('morgan');
const { keycloak, memoryStore } = require('./config/keycloak_config');
const authRoutes = require('./routes/AuthRoutes');


const errorHandler = require('./middleware/error_handler');
const istitutiRoutes = require('./routes/IstitutiRoutes');
const macchinetteRoutes = require('./routes/MacchinetteRoutes');
const manutenzioniRoutes = require('./routes/ManutenzioniRoutes');
const websocketRouter= require('./routes/websocket');

const app = express();
const wsInstance = expressWs(app);

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

const authenticatedUserInfo= (req, res, next) => {
    if(!req.kauth?.grant?.access_token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    try{
        const token = req.kauth?.grant?.access_token;
        const clientId = keycloak.clientId || 'my-amministrativo';
        req.user={
            id: token.content.sub,
            email: token.content.email,
            roles: token.content.resource_access?.[clientId]?.roles,
            username: token.content.preferred_username,
            firstName: token.content.given_name,
            lastName: token.content.family_name
        }
        next();

    }catch(error){
        console.error('Error fetching user info:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
    
}

// Routes
app.use('/istituti',keycloak.protect(), authenticatedUserInfo, istitutiRoutes);
app.use('/auth', authRoutes);
app.use('/macchinette', keycloak.protect(), authenticatedUserInfo, macchinetteRoutes);
app.use('/manutenzioni', manutenzioniRoutes);
app.get('/', (req, res) => {
   res.render('index')
});
app.use('/ws', websocketRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});