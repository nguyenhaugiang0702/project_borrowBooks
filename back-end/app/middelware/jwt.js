const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'my_secret_key', (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Nếu token đã hết hạn, trả về lỗi 401
                return res.sendStatus(401);
            } else {
                // Nếu có lỗi khác xảy ra, trả về lỗi 403
                return res.sendStatus(403);
            }
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
