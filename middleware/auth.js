const authMiddleware = (req, res, next) => {
    if (!req.kauth || !req.kauth.grant) {
        return res.redirect('/auth/login');
    }
    next();
};

module.exports = authMiddleware;