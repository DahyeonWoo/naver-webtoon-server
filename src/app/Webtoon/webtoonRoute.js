module.exports = function(app) {
    const webtoon = require('./webtoonController');
    const jwtMiddleware = require("../../../config/jwtMiddleware");

    // 웹툰 생성 API
    app.post('/app/webtoons', webtoon.postWebtoons);

    // 에피소드 생성 API
    app.post('/app/episodes', webtoon.postEpisodes);

    // 연재요일 등록 API
    app.post('/app/serialday', webtoon.postSerialday);

    // 배너 생성 API
    app.post('/app/banners', webtoon.postBanners);

    // 웹툰 전체 조회 API
    app.get('/app/webtoons', jwtMiddleware, webtoon.getWebtoons);

    // 웹툰 상세페이지 조회 API
    app.get('/app/webtoons/:webtoonIdx', jwtMiddleware, webtoon.getWebtoonByIdx);

    // 웹툰 에피소드 조회 API
    app.get('/app/webtoons/:webtoonIdx/episodes/:episodeIdx', jwtMiddleware, webtoon.getEpisodeByIdx);

    // 배너 조회 API
    app.get('/app/banners', webtoon.getBanners);

    // 특정 에피소드 댓글 조회 API
    app.get('/app/webtoons/:webtoonIdx/episodes/:episodeIdx/comments', jwtMiddleware, webtoon.getComments);

    // 특정 에피소드 베스트 댓글 조회 API
    app.get('/app/webtoons/:webtoonIdx/episodes/:episodeIdx/bestcomments', jwtMiddleware, webtoon.getBestComments);

    // 추천완결 조회 API
    app.get('/app/recommendations', jwtMiddleware, webtoon.getRecommendations);

    // 추천완결 관심웹툰 조회 API //업데이트 순 정렬 기능 구현 x
    app.get('/app/recommendations/interested', jwtMiddleware, webtoon.getInterestedRecommendations);

    // 베스트도전 생성 API
    app.post('/app/bestchallengewebtoons', webtoon.postBestchallengeWebtoons);

    // 베스트도전 전체 조회 API // 베스트도전 테이블을 새로 만든 이상, 별점+에피소드 테이블도 다시 만들어야 한다.
    app.get('/app/bestchallengewebtoons', jwtMiddleware, webtoon.getBestchallengeWebtoons);

    // 웹툰 전체 수정 API
    app.patch('/app/webtoons/:webtoonIdx', webtoon.patchWebtoon);

    // 검색 결과 조회 API
    //app.get('/app/search', jwtMiddleware, webtoon.getSearch);

    /*
    // 웹툰 연재 상태 수정 API
    app.patch('/app/webtoons/:webtoonIdx/serialization', webtoon.patchWebtoonSerial);

   // 웹툰 썸네일 수정 API
   app.patch('/app/webtoons/:webtoonIdx/img', webtoon.patchWebtoon);

   // 웹툰 줄거리 수정 API
   app.patch('/app/webtoons/:webtoonIdx/summary', webtoon.patchWebtoon);

   // 웹툰 상태 수정 API (웹툰 삭제)(거의 쓰지 않음)
   app.patch('/app/webtoons/:webtoonIdx/status', webtoon.patchwebtoonStatus);

    // 에피소드 전체 수정 API
   app.patch('/app/webtoons/:webtoonIdx/episodes/:episodeIdx', webtoon.patchwebtoonStatus);

    // 에피소드 상태 수정 API (에피소드 삭제)(거의 쓰지 않음)
   app.patch('/app/webtoons/:webtoonIdx/episodes/:episodeIdx/status', webtoon.patchwebtoonStatus);

   // 웹툰 연재요일 상태 수정 API
   app.patch('/app/webtoons/:webtoonIdx/serialday', webtoon.patchSerialday);
    */

}