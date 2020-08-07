// eslint-disable-next-line strict
class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (err, res) => {
    console.log(err);
    if (err instanceof ErrorHandler) {
        const { statusCode, message } = err;
        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: err.message,
        });
    }
    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Something wrent wrong (Unhadnled rejection)',
    });

};

module.exports = { ErrorHandler, handleError };
