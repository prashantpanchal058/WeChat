const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetch = require("../middleware/fetch");
const dotenv = require("dotenv")
dotenv.config();
const JWT_SECRETE = process.env.JWT_SECRET || "prashant";

const multer = require('multer');
const path = require('path');
const fs = require("fs");

const { body, validationResult } = require('express-validator');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// create a user using: POST "/api/auth/createuser"
router.post('/createuser', upload.single('pic'), [
    body('name', 'Enter the name min length is 6').isLength({ min: 6 }),
    body('email', 'Enter the valid Email').isEmail(),
    body('password', 'Enter the password min length is 6').isLength({ min: 6 })
], async (req, res) => {

    let success = false;
    // if there are error, return bad erquest and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }


    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            success = false;
            return res.status(400).json({ success, error: "Sorry a user with this email already exist." });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        const pic = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            pic:pic
        });

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRETE);

        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.massage);
        res.status(500).send("internal server error.");
    }
})

router.post('/login', [
    body('email', 'Enter the valid Email').isEmail(),
    body('password', 'password is required').exists(),
], async (req, res) => {

    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "try to use correct credentials." });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);// (string, hash)
        if (!passwordCompare) {
            return res.status(400).json({ error: "try to use correct credentials." });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        // applying json method
        const authtoken = jwt.sign(data, JWT_SECRETE);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.massage);
        res.status(500).send("internal server error.");
    }

})

router.get('/getuser', fetch, async (req, res) => {

    try {
        userId = req.user.id;
        //that means excluding password
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.massage);
        res.status(500).send("internal server error.");
    }

})

router.get('/getusers', fetch, async (req, res) => {
    try {
        userId = req.user.id;
        const users = await User.find({
            _id: { $ne: userId }
        }).select("-password");

        res.send(users);

    } catch (error) {
        console.error(error.massage);
        res.status(500).send("internal server error.");
    }
})

router.get('/getuser/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});



module.exports = router;