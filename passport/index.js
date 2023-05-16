const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () =>{

  //사용자 정보 객체를 세센에 아이디로 저장
  passport.serializeUser((user, done) => { // serializeUser는 로그인시 실행되며, req.session(세션) 객체에 어떤 데이터를 저장할 지 정하는 메서드, 매개변수로 user를 받고 나서, done함수에 두번째로 user.id를 넘기고 있다.
    done(null, user.id);  // done 함수의 첫 번째 인수는 에러 발생시 사용하는 것이고, 두번째 인수에는 저장하고 싶은 데이터를 넣는다.
                          //로그인시 사용자 데이터를 세션에 저장하는데, 세션에 사용자 정보를 모두 저장하면 세션의 용량이 커지고 데이터 일관성에 문제가 발생하므로 사용자의 아이디만 저장
  });

 // serializeUser가 로그인 시에만 실행된다면, deserializeUser는 매 요청 시 실행됨, 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
 passport.deserializeUser((id, done) => {   // 조금 전에 serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회
    User.findOne({ where: { id } })         // 조회한 정보를 req.user에 저장하프로 앞으로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있다.
      .then(user => done(null, user))
      .catch(err => done(err));
  });
    local();   //
    kakao();
};