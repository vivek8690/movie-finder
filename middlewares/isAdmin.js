const { ErrorHandler } = require('../helpers/custom-error');

exports.isAdmin = async(req, res, next) => {
    try {
        const userRole = req.get('role');
        if (userRole === 'admin') {
            return next();
        }
        throw new ErrorHandler(401, 'Unauthorized user');
    } catch (err) {
        next(err);
    }
};
