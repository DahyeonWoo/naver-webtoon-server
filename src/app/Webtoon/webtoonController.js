const webtoonProvider = require('./webtoonProvider');
const webtoonService = require('./webtoonService');
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const userProvider = require("../User/userProvider");
const commentProvider = require("../Comment/commentProvider");

var regPhoneNumber = /^\d{3}\d{3,4}\d{4}$/;

//const schedule = require('node-schedule');

/*
    API No.
    웹툰 생성 API
    [POST] /app/webtoons
*/
exports.postWebtoons = async function(req, res) {
    /**
     * Body: webtoonIdx, title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color,  categoryIdx, agelimit, adult, rest, complete, isFree
     */
    const {title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree} = req.body;

    if (!title) {
        return res.send(response(baseResponse.WEBTOON_TITLE_EMPTY));
    }  else if (!artist) {
        return res.send(response(baseResponse.WEBTOON_ARTIST_EMPTY));
    } else if (!thumbnailUrl) {
        return res.send(response(baseResponse.WEBTOON_THUMBNAILURL_EMPTY));
    } else if (!summary) {
        return res.send(response(baseResponse.WEBTOON_SUMMARY_EMPTY));
    } else if (!subsummary) {
        return res.send(response(baseResponse.WEBTOON_SUBSUMMARY_EMPTY));
    } else if (!color) {
        return res.send(response(baseResponse.WEBTOON_COLOR_EMPTY));
    } else if (!categoryIdx) {
        return res.send(response(baseResponse.WEBTOON_CATEGORYIDX_EMPTY));
    } else if (!agelimit) {
        return res.send(response(baseResponse.WEBTOON_AGELIMIT_EMPTY));
    } else if (categoryIdx < 1 || categoryIdx > 15) {
        return res.send(response(baseResponse.WEBTOON_CATEGORYIDX_WRONG));
    }

    if (title.length > 60) {
        return res.send(response(baseResponse.WEBTOON_TITLE_LENGTH));
    } else if (summary.length > 600) {
        return res.send(response(baseResponse.WEBTOON_SUMMARY_LENGTH));
    } else if (subsummary.length > 100) {
        return res.send(response(baseResponse.WEBTOON_SUBSUMMARY_LENGTH));
    }

    if (!profileUrl) {
        profileUrl = thumbnailUrl;
    }
    if (thumbnailUrl && typeof(thumbnailUrl) != "string") {
        return res.send(response(baseResponse.IMG_WRONG));
    }

    if (!viewType) {
        viewType = 'S';
    }
    if (!adult) {
        adult = 'N';
    }
    if (!rest) {
        rest = 'N';
    }
    if (!complete) {
        complete = 'N';
    }
    if (!isFree) {
        isFree = 'N';
    }

    const postWebtoonResponse = await webtoonService.createWebtoon(
        title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree
    );

    return res.send(postWebtoonResponse);
};

/*
    API No.
    에피소드 생성 API
    [POST] /app/episodes
*/
exports.postEpisodes = async function(req, res) {
    /**
     * Body: episodeIdx, webtoonIdx, title, thumbnailUrl, contentUrl, words, isBGM
     */
    const {episodeIdx, webtoonIdx, title, thumbnailUrl, contentUrl, words, isBGM} = req.body;

    if (!episodeIdx) {
        return res.send(response(baseResponse.EPISODE_EPISODEIDX_EMPTY));
    }  else if (!webtoonIdx) {
        return res.send(response(baseResponse.EPISODE_WEBTOONIDX_EMPTY));
    } else if (!title) {
        return res.send(response(baseResponse.EPISODE_TITLE_EMPTY));
    } else if (!thumbnailUrl) {
        return res.send(response(baseResponse.EPISODE_THUMBNAILURL_EMPTY));
    } else if (!contentUrl) {
        return res.send(response(baseResponse.EPISODE_CONTENTSURL_EMPTY));
    }

    if (title.length > 200) {
        return res.send(response(baseResponse.EPISODE_TITLE_LENGTH));
    }

    if (thumbnailUrl && typeof(thumbnailUrl) != "string" || contentUrl && typeof(contentUrl) != "string") {
        return res.send(response(baseResponse.IMG_WRONG));
    }
    if (!words) {
        words = '.';
    }
    if (!isBGM) {
        isBGM = 'N';
    }

    const postEpisodeResponse = await webtoonService.createEpisode(
        episodeIdx, webtoonIdx, title, thumbnailUrl, contentUrl, words, isBGM
    );

    return res.send(postEpisodeResponse);
};

/*
    API No.
    연재요일 등록 API
    [POST] /app/serialday
*/
exports.postSerialday = async function(req, res) {
    /**
     * Body: bannerIdx, thumbnailUrl, webtoonIdx, linkUrl
     */
    const { serialdayIdx, webtoonIdx } = req.body;

    if (!serialdayIdx) {
        return res.send(response(baseResponse.WEBTOON_SIRIALDAYIDX_EMPTY));
    } else if ( !webtoonIdx ) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    }

    const postSerialdayResponse = await webtoonService.createSerialday(
        serialdayIdx, webtoonIdx
    );

    return res.send(postSerialdayResponse);
};


/*
    API No. 12
    배너 생성 API
    [POST] /app/banners
*/
exports.postBanners = async function(req, res) {
    /**
     * Body: bannerIdx, thumbnailUrl, webtoonIdx, linkUrl
     */
    const { thumbnailUrl, webtoonIdx, linkUrl } = req.body;

    if (!thumbnailUrl) {
        return res.send(response(baseResponse.BANNER_THUMBNAILURL_EMPTY));
    } else if ( !webtoonIdx && !linkUrl ) {
        return res.send(response(baseResponse.BANNER_URL_EMPTY));
    }

    if (thumbnailUrl && typeof(thumbnailUrl) != "string") {
        return res.send(response(baseResponse.IMG_WRONG));
    }

    const postBannerResponse = await webtoonService.createBanner(
        thumbnailUrl, webtoonIdx, linkUrl
    );

    return res.send(postBannerResponse);
};

/*
    API No.
    API Name : 웹툰 전체 조회
    [GET] /app/webtoons?page=&categoryIdx=
*/
exports.getWebtoons = async function(req, res) {
    // Query String =
    // div(new, mon, tue, wed, thur, fri, sat, sun, finish),
    // order(User, MaleUser, FemaleUser, ViewCount, Update, StarScore)

    /*
    var div = req.query.serialdayIdx;
    var order = 1; // 기본 정렬 (User, 인기순)
     */

    const userIdxFromJWT = req.verifiedToken.userIdx;
    // 현재 로그인 된 유저
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    //웹툰 조회
    const webtoonListResult = await webtoonProvider.retrieveWebtoonList();
    return res.send(response(baseResponse.SUCCESS, webtoonListResult));
};

/*
    API No.
    API Name : 웹툰 상세페이지 조회 API
    [GET] /app/webtoons/{webtoonIdx}
*/
exports.getWebtoonByIdx = async function (req, res) {
    // Path Variable : webtoonIdx
    const webtoonIdx = req.params.webtoonIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    if (!webtoonIdx) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    }

    const webtoonByIdx = await webtoonProvider.retrieveWebtoon(webtoonIdx, userIdxFromJWT);
    return res.send(webtoonByIdx);

};

/*
    API No.
    API Name : 웹툰 에피소드 조회 API
    [GET] /app/webtoons/{webtoonIdx}/episodes/{episodeIdx}
*/
exports.getEpisodeByIdx = async function (req, res) {
    // Path Variable : webtoonIdx, episodeIdx
    const webtoonIdx = req.params.webtoonIdx;
    const episodeIdx = req.params.episodeIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    if (!webtoonIdx) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.EPISODE_EPISODEIDX_EMPTY));
    }

    const episodeByIdx = await webtoonProvider.retrieveEpisode(webtoonIdx, episodeIdx, userIdxFromJWT);
    return res.send(episodeByIdx);

};

/*
    API No.
    API Name : 배너 조회 APi
    [GET] /app/banners
*/
exports.getBanners = async function (req, res) {
    const BannersWebtoon = await webtoonProvider.retrieveBanner();
    return res.send(BannersWebtoon);
};

/*
    API No.
    API Name : 특정 에피소드 댓글 조회 API
    [GET] /app/webtoons/{webtoonIdx}/episodes/{episodeIdx}/comments
*/
exports.getComments = async function (req, res) {
    // Path Variable : webtoonIdx
    const webtoonIdx = req.params.webtoonIdx;
    const episodeIdx = req.params.episodeIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    if (!webtoonIdx) {
        return res.send(response(baseResponse.COMMENT_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.COMMENT_EPISODEIDX_EMPTY));
    }

    const commentsBywebtoon = await commentProvider.retrieveComments(webtoonIdx,episodeIdx);
    return res.send(commentsBywebtoon);
};

/*
    API No.
    API Name : 특정 에피소드 베스트댓글 조회 API
    [GET] /app/webtoons/{webtoonIdx}/episodes/{episodeIdx}/bestcomments
*/
exports.getBestComments = async function (req, res) {
    // Path Variable : webtoonIdx
    const webtoonIdx = req.params.webtoonIdx;
    const episodeIdx = req.params.episodeIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    if (!webtoonIdx) {
        return res.send(response(baseResponse.COMMENT_webtoonIDX_EMPTY));
    }

    const commentsBywebtoon = await commentProvider.retrieveBestComments(webtoonIdx,episodeIdx);
    return res.send(commentsBywebtoon);
};


/*
    API No.
    API Name : 검색 API
    [GET] /app/search?searchQuery=&searchType=
*/
exports.getSearch = async function(req, res) {
    // Query String = searchquery, page
    const searchQuery = req.query.searchQuery;
    const searchType = req.query.searchType;

    const userIdxFromJWT = req.verifiedToken.userIdx;

    /*
    if (!searchType) {
        searchType = 1;
    }
     */

    if (!searchQuery) {
        res.send(response(baseResponse.SEARCH_SEARCHQUERY_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    var searchQueryList = searchQuery.split(' ');

    for (searchWord of searchQueryList) {
        if (searchWord == '') {
            searchQueryList.splice(searchQueryList.indexOf(searchWord.length == 0));
        }
    }

    const searchResponse = await webtoonProvider.searchwebtoons( searchQueryList, searchType );

    return res.send(searchResponse);
};

/*
    API No.
    API Name : 추천완결 조회
    [GET] /app/recommendations?
*/
exports.getRecommendations = async function(req, res) {
    // Query String =
    // div(new, mon, tue, wed, thur, fri, sat, sun, finish),
    // order(User, MaleUser, FemaleUser, ViewCount, Update, StarScore)

    /*
    var div = req.query.serialdayIdx;
    var order = 1; // 기본 정렬 (User, 인기순)
     */

    const userIdxFromJWT = req.verifiedToken.userIdx;
    // 현재 로그인 된 유저
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    //웹툰 조회
    const webtoonListResult = await webtoonProvider.retrieveRecommendationList(userIdxFromJWT);
    return res.send(response(baseResponse.SUCCESS, webtoonListResult));
};

/*
    API No.
    API Name : 추천완결 관심웹툰 조회
    [GET] /app/recommendations/interested
*/
exports.getInterestedRecommendations = async function(req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    // 현재 로그인 된 유저
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    //웹툰 조회
    const webtoonListResult = await webtoonProvider.retrieveInterestedRecommendationList(userIdxFromJWT);
    return res.send(response(baseResponse.SUCCESS, webtoonListResult));
};


/*
    API No.
    베스트도전 웹툰 생성 API
    [POST] /app/webtoons
*/
exports.postBestchallengeWebtoons = async function(req, res) {
    /**
     * Body: webtoonIdx, title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color,  categoryIdx, agelimit, adult, rest, complete, isFree
     */
    const {title, userIdx, thumbnailUrl, summary, subsummary, categoryIdx, promotion, official, complete} = req.body;

    if (!title) {
        return res.send(response(baseResponse.WEBTOON_TITLE_EMPTY));
    }  else if (!userIdx) {
        return res.send(response(baseResponse.WEBTOON_ARTIST_EMPTY));
    } else if (!thumbnailUrl) {
        return res.send(response(baseResponse.WEBTOON_THUMBNAILURL_EMPTY));
    } else if (!summary) {
        return res.send(response(baseResponse.WEBTOON_SUMMARY_EMPTY));
    } else if (!subsummary) {
        return res.send(response(baseResponse.WEBTOON_SUBSUMMARY_EMPTY));
    } else if (!categoryIdx) {
        return res.send(response(baseResponse.WEBTOON_CATEGORYIDX_EMPTY));
    } else if (categoryIdx < 1 || categoryIdx > 15) {
        return res.send(response(baseResponse.WEBTOON_CATEGORYIDX_WRONG));
    }

    if (title.length > 60) {
        return res.send(response(baseResponse.WEBTOON_TITLE_LENGTH));
    } else if (summary.length > 600) {
        return res.send(response(baseResponse.WEBTOON_SUMMARY_LENGTH));
    } else if (subsummary.length > 100) {
        return res.send(response(baseResponse.WEBTOON_SUBSUMMARY_LENGTH));
    }


    if (thumbnailUrl && typeof(thumbnailUrl) != "string") {
        return res.send(response(baseResponse.IMG_WRONG));
    }

    if (!promotion) {
        promotion = 'N';
    }
    if (!official) {
        official = 'N';
    }
    if (!complete) {
        complete = 'N';
    }

    const postWebtoonResponse = await webtoonService.createBestchallengewebtoon(
        title, userIdx, thumbnailUrl, summary, subsummary, categoryIdx, promotion, official, complete
    );

    return res.send(postWebtoonResponse);
};


/*
    API No.
    API Name : 베스트도전 전체 조회
    [GET] /app/webtoons?page=&categoryIdx=
*/
exports.getBestchallengeWebtoons = async function(req, res) {
    // Query String =
    // div(new, mon, tue, wed, thur, fri, sat, sun, finish),
    // order(User, MaleUser, FemaleUser, ViewCount, Update, StarScore)

    /*
    var div = req.query.serialdayIdx;
    var order = 1; // 기본 정렬 (User, 인기순)
     */

    const userIdxFromJWT = req.verifiedToken.userIdx;
    // 현재 로그인 된 유저
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    //웹툰 조회
    const webtoonListResult = await webtoonProvider.retrieveBestchallengeWebtoonList();
    return res.send(response(baseResponse.SUCCESS, webtoonListResult));
};


/*
    API No.
    API Name : 웹툰 수정 API
    [PATCH] /app/webtoons/{webtoonIdx}
*/
exports.patchWebtoon = async function(req, res) {
    // Path Variable : webtoonIdx
    const webtoonIdx = req.params.webtoonIdx;

    /**
     * Body: webtoonIdx, title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color,  categoryIdx, agelimit, adult, rest, complete, isFree
     */
    const {title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree} = req.body;

    // 존재하는 글인지 확인
    const checkwebtoonIdx = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
    if (checkwebtoonIdx.length < 1) {
        return res.send(response(baseResponse.webtoon_webtoonIDX_WRONG));
    }

    if (!title) {
        return res.send(response(baseResponse.WEBTOON_TITLE_EMPTY));
    }  else if (!artist) {
        return res.send(response(baseResponse.WEBTOON_ARTIST_EMPTY));
    } else if (!thumbnailUrl) {
        return res.send(response(baseResponse.WEBTOON_THUMBNAILURL_EMPTY));
    } else if (!summary) {
        return res.send(response(baseResponse.WEBTOON_SUMMARY_EMPTY));
    } else if (!subsummary) {
        return res.send(response(baseResponse.WEBTOON_SUBSUMMARY_EMPTY));
    } else if (!color) {
        return res.send(response(baseResponse.WEBTOON_COLOR_EMPTY));
    } else if (!categoryIdx) {
        return res.send(response(baseResponse.WEBTOON_CATEGORYIDX_EMPTY));
    } else if (!agelimit) {
        return res.send(response(baseResponse.WEBTOON_AGELIMIT_EMPTY));
    } else if (categoryIdx < 1 || categoryIdx > 15) {
        return res.send(response(baseResponse.WEBTOON_CATEGORYIDX_WRONG));
    }

    if (title.length > 60) {
        return res.send(response(baseResponse.WEBTOON_TITLE_LENGTH));
    } else if (summary.length > 600) {
        return res.send(response(baseResponse.WEBTOON_SUMMARY_LENGTH));
    } else if (subsummary.length > 100) {
        return res.send(response(baseResponse.WEBTOON_SUBSUMMARY_LENGTH));
    }

    if (thumbnailUrl && typeof(thumbnailUrl) != "string") {
        return res.send(response(baseResponse.IMG_WRONG));
    }

    const editWebtoon = await webtoonService.editwebtoon(
        webtoonIdx, title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree
    );
    return res.send(editWebtoon);

};

/*
    if (!order) {
        return res.send(response(baseResponse.MODIFY_CATEGORY_IDX_EMPTY));
    };


    if(typeof(order) == "string") {
        if (order > 15 || order < 1) {
            return res.send(response(baseResponse.webtoon_CATEGORYIDX_WRONG));
        }
    } else {
        for (categoryIdx of categoryList) {
            if (categoryIdx > 15 || categoryIdx < 1) {
                return res.send(response(baseResponse.webtoon_CATEGORYIDX_WRONG));
            }
        }
    }
 */

