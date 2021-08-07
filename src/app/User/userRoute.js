module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 회원가입 API
    app.post('/app/users', user.postUsers);

    // 2. 네이버 로그인 API
    app.post('/app/nave-login', user.login);

    // 3. 자동 로그인 API
    app.get('/app/auto-login', jwtMiddleware, user.check);

    // 4. 로그아웃 API
    app.get('/app/logout', jwtMiddleware, user.logOut);

    // 5. 탈퇴하기 API
    app.patch('/app/users/:userIdx/withdraw', jwtMiddleware, user.withDrawUser);

    // 6. 유저 정보 조회 API
    app.get('/app/users/:userIdx', jwtMiddleware, user.getUserByIdx);

    // 7. 유저 정보 수정 API
    app.patch('/app/users/:userIdx/accounts', jwtMiddleware, user.patchAccount);

    // 8. 프로필 조회 API
    app.get('/app/users/:userIdx/profile', jwtMiddleware, user.getUserProfile);

    // 9. 프로필 수정 API
    app.patch('/app/users/:userIdx/profile', jwtMiddleware, user.patchUserProfile);

    // 10. 관심 등록/취소 API
    app.post('/app/users/interests', jwtMiddleware, user.postInterests);

    // 11. 알림 등록/취소 API
    app.patch('/app/users/interests/notice', jwtMiddleware, user.patchNotices);

    // 12. 관심 목록 조회 API (글 종류에 따라)
    app.get('/app/users/:userIdx/interests', jwtMiddleware, user.getUserInterests);

    // 13. 웹툰 보기 API
    app.post('/app/users/looks', jwtMiddleware, user.postLooks);

    // 14. 최근 본 웹툰 조회 API
    app.get('/app/users/:userIdx/history', jwtMiddleware, user.getUserHistory);

    // 15. 임시저장 API
    app.post('/app/users/storages', jwtMiddleware, user.postStorages);

    // 16. 임시저장 조회 API
    app.get('/app/users/:userIdx/storages/webtoons', jwtMiddleware, user.getUserWebtoonsStorages);

    // 17. 임시저장 상세조회 API
    app.get('/app/users/:userIdx/storages/episodes', jwtMiddleware, user.getUserEpisodesStorages);

    // 18. 임시저장 만료 삭제 API
    app.patch('/app/users/:userIdx/storages/:webtoonIdx/:episodeIdx/delete', jwtMiddleware, user.patchUserEpisodesStorages);

    // 19. 하트 등록/취소 API
    app.post('/app/users/hearts', jwtMiddleware, user.postHearts);

    // 20. 별점 등록 API
    app.post('/app/users/stars', jwtMiddleware, user.postStars);

    // 21. 검색기록 저장 API
    app.post('/app/users/searchlog', jwtMiddleware, user.postSeachLogs);

    // 22. 검색기록 조회 API
    app.get('/app/users/:userIdx/searchlog', jwtMiddleware, user.getUserSearchLogs);

    // 23. 검색기록 삭제 API
    app.patch('/app/users/:userIdx/searchlog/delete', jwtMiddleware, user.patchUserSearchLogs);

    /*
    // 24. 보관하기 API
    app.post('/app/users/keep', jwtMiddleware, user.postKeep);

    // 25. 보관한 웹툰 조회 API (글 종류에 따라)
    app.get('/app/users/:userIdx/keep', jwtMiddleware, user.getUserKeep);
     */
};
