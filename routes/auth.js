const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');


const router = express.Router();

// 회원 가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });  //기존에 같은 이메일로 가입한 사용자가 있는지 조회한 뒤, 있다면 회원 가입 페이지로 되돌려보냄
    if (exUser) {
      return res.redirect('/join?error=exist');  // 주소 뒤에 에러를 쿼리스트링으로 표시
    }
    const hash = await bcrypt.hash(password, 12);    //같은 이메일로 가입한 사용자가 없다면 비빌번호를 암호화하고, 사용자 정보를 생성, 회원 가입시 비밀번호는 암호화해서 저장,
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


//로그인 라우터, 로그인 요청이 들어오면 passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행, 미들웨어인데 라우터 미들웨어 안에 들어 있음, 미들웨어에 사용자 정의 기능을 추가하고 싶을 때 이렇게 할 수 있음, 이럴 때는 내부 미들웨어에 (req, res, next)를 인수로 제공해서 호출
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;