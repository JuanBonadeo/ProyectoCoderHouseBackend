import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/', passport.authenticate('jwt', {session: false}),(req, res) => {
    res.render('profile', {
        user: req.user
    });
})

router.get('/resetPassword',(req,res)=>{
    res.render('resetPassword');
})

export default router;
