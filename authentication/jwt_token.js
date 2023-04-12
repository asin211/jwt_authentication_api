// JWT Web Token
const jwt = require('jsonwebtoken')

// Middleware to Authenticate User with JWT token
function authenticate_token(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]   // Bearer TOKEN.. (token format for splitting on space)
    if (token == null) {
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = { authenticate_token: authenticate_token }