const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.response) {
        // Error from API calls
        return res.status(err.response.status || 500).json({
            error: err.response.data.message || 'Internal Server Error'
        });
    }

    res.status(500).json({
        error: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;