const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();
const JWT_SECRETE = process.env.JWT_SECRET || "prashant";


const fetch = (req, res, next) => {

    //GER the user form jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Pleasse authenticate using valid token. " });
    }
    try {
        const data = jwt.verify(token, JWT_SECRETE);
        req.user = data.user;

        next();

    } catch (error) {
        res.status(401).send({ error: "Pleasse authenticate using valid token. " });
    }
}

module.exports = fetch;