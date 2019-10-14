const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.post('/join', async (req, res, next) => {
    const { email, nick , password } = req.body;
    try {
        const exUser = await User.find({ where: { email }});
        if(exUser){
            req.flash('joinError', '이미 가입된 아이디입니다.');
            return res.redirect('/join');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/login', (req, res, next) => {

});

module.exports = router;