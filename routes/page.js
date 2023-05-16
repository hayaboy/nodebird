const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user; // 넌적스에서 user 객체를 통해 사용자 정보에 접근할 수 있게 됨
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});


//자신의 프로필은 로그인을 해야 볼 수 있으므로 isLoggedIn 미들웨어 사용, req.isAuthenticated()가 true여야 next가 호출되어 res.render가 있는 미들웨어로 넘어감
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});


// 회원 가입 페이지는 로그인을 하지 않은 사람에게만 보임
router.get('/join', isNotLoggedIn,  (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('main', {
    title: 'NodeBird',
    twits,
  });
});

module.exports = router;
