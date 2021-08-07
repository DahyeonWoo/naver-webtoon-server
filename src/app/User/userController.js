const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
//const request = require('request');

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const crypto = require('crypto');

//const { smtpTransport } = require('../../../config/email');

const queryString = require('querystring');
const { count } = require("console");

var regPhoneNumber = /^\d{3}\d{3,4}\d{4}$/;

//const nodeCache = require('node-cache');
const { type } = require("os");
//const cache = new nodeCache();

const webtoonProvider = require("../Webtoon/webtoonProvider");

/*
    API No. 1
    API Name : 회원가입 API
    [POST] /app/users
*/
exports.postUsers = async function(req, res) {
    /**
     * Body: userIdx, userID, userPW, userName, userNick, birthday, gender, email, mobileNo
     */
    const {userID, userPW, userName, birthday, gender, email, mobileNo} = req.body;

    // 빈 값 체크

    if (!userID) {
        return res.send(response(baseResponse.SIGNUP_IS_EMPTY));
    } else if (!userPW) {
        return res.send(response(baseResponse.SIGNUP_IS_EMPTY));
    } else if (!userName) {
        return res.send(response(baseResponse.SIGNUP_IS_EMPTY));
    } else if (!birthday) {
        return res.send(response(baseResponse.SIGNUP_BIRTHDAY_EMPTY));
    } else if (!gender) {
        return res.send(response(baseResponse.SIGNUP_IS_EMPTY));
    } else if (!mobileNo) {
        return res.send(response(baseResponse.SIGNUP_IS_EMPTY));
    }

    if (userID.length < 5) {
        return res.send(response(baseResponse.SIGNUP_ID_ERROR_TYPE));
    } else if (userID.length > 20) {
        return res.send(response(baseResponse.SIGNUP_ID_ERROR_TYPE));
    }

    if (userPW.length < 8) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));
    } else if (userPW.length > 16) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));
    }

    if (mobileNo.length < 10) {
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));
    }
    if (!regPhoneNumber.test(mobileNo)) {
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));
    }

    const signUpResponse = await userService.createUser(
        userID, userPW, userName, birthday, gender, email, mobileNo
    );

    return res.send(signUpResponse);
};

/*
    API No. 2
    API Name : 네이버 로그인 API
    [POST] /app/nave-login
    body : phoneNumber
*/
exports.login = async function(req, res) {
    const { userID, userPW } = req.body;

    if (!userID) {
        return res.send(response(baseResponse.SIGNIN_ID_EMPTY));
    } else if (!userPW) {
        return res.send(response(baseResponse.SIGNIN_PW_EMPTY));
    }

    const signInResponse = await userService.postSignIn(userID, userPW);

    return res.send(signInResponse);
};

/*
    API No. 3
    API Name : 자동 로그인 API
    [GET] /app/auto-login
*/
exports.check = async function (req, res) {
    // jwt - userIdx

    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);

    if (!userIdxFromJWT) {
        return res.send(errResponse(baseResponse.SIGNIN_JWT_TOKEN_NOT_EXIST));
    } else if (token == checkJWT[0].jwt) {
        return res.send(response(baseResponse.SUCCESS, {"userIdx": userIdxFromJWT}));
    } else {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }
};


/*
    API No. 4
    API Name : 로그아웃 API
    [GET] /app/logout
*/
exports.logOut = async function(req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1) {
        return res.send(response(baseResponse.NOT_LOGIN));
    } else if (token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const logOutResponse = await userService.deleteJWT(userIdxFromJWT);

    return res.send(logOutResponse);
}

/*
    API No. 5
    API Name : 탈퇴하기 API
    [PATCH] /app/users/{userIdx}/withdraw
*/
exports.withDrawUser = async function(req, res) {
    // Path Varialble : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const withDrawUserResponse = await userService.withDrawUser(userIdx);

    return res.send(withDrawUserResponse);
};


/*
    API No. 6
    API Name : 유저 정보 조회 API
    [GET] /app/users/{userIdx}
*/
exports.getUserByIdx = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }
    const userIdxResult = await userProvider.retrieveUserByIdx(userIdx);

    return res.send(response(baseResponse.SUCCESS, userIdxResult[0]));
};

/*
    API No. 7
    API Name : 특정 유저 계정/정보 수정
    [PATCH] /app/users/:userIdx/accounts
*/
exports.patchAccount = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    /*
        Body : mobileNo, email
    */
    const { mobileNo, email } = req.body;

    if (!mobileNo && !email) {
        return res.send(response(baseResponse.MODIFY_WRONG));
    }
    if (mobileNo && !regPhoneNumber.test(mobileNo)) {
        return res.send(response(baseResponse.AUTH_PHONENUMBER_ERROR_TYPE));
    } else if (email && !regexEmail.test(email)) {
        return res.send(response(baseResponse.AUTH_EMAIL_ERROR_TYPE));
    } else if (mobileNo && email) {
        return res.send(baseResponse.CANT_MODIFY_BOTH);
    }

    if (email  && email.length > 30) {
        return res.send(response(baseResponse.AUTH_EMAIL_LENGTH));
    }

    const patchAccountResponse = await userService.updateUserAccount(userIdx, mobileNo, email);

    return res.send(patchAccountResponse);
};


/*
    API No. 8
    API Name : 유저 프로필 조회 API
    [GET] /app/users/{userIdx}/profile
*/
exports.getUserProfile = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }
    const userProfileResult = await userProvider.retrieveUserProfile(userIdx);

    return res.send(userProfileResult);
};

/*
    API No. 9
    API Name : 프로필 수정 API
    [PATCH] /app/users/{userIdx}/profile
*/
exports.patchUserProfile = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    /*
        Body : profileUrl, userNick
    */
    const { profileUrl, userNick } = req.body;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    if (!profileUrl && !userNick) {
        return res.send(response(baseResponse.MODIFY_WRONG));
    }

    const editProfileResult = await userService.editProfile(userIdx, profileUrl, userNick);
    return res.send(editProfileResult);
};

/*
    API No.
    API Name : 관심 등록 API
    [POST] /app/users/interests
*/
exports.postInterests = async function(req, res) {
    /*
        Body : userIdx, webtoonIdx
    */
    const { userIdx, webtoonIdx } = req.body;


    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const InterestByUserIdx = await userProvider.retrieveInterests(webtoonIdx, userIdx);

    if (InterestByUserIdx.length > 0) {
        // 좋아요가 이미 존재
        if (InterestByUserIdx[0].status == "D") {
            // 삭제된 좋아요 다시 누르기
            const activateInterests = await userService.updateInterestStatus(webtoonIdx, userIdx, InterestByUserIdx[0].status);
            return res.send(activateInterests);
        } else {
            // 좋아요 취소
            const deleteInterests = await userService.updateInterestStatus(webtoonIdx, userIdx, InterestByUserIdx[0].status);
            return res.send(deleteInterests);
        }
    } else {
        // 새로 좋아요 생성
        const insertLikeResponse = await userService.insertInterest(webtoonIdx, userIdx);
        return res.send(insertLikeResponse);
    }
}


/*
    API No.
    API Name : 알림 등록 API
    [POST] /app/users/interest/notice
*/
exports.patchNotices = async function(req, res) {
    /*
        Body : articleIdx, userIdx
    */
    const { userIdx, webtoonIdx } = req.body;


    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const InterestByUserIdx = await userProvider.retrieveInterests(webtoonIdx, userIdx);
    const NoticeByUserIdx = await userProvider.retrieveNotices(webtoonIdx, userIdx);

    if (InterestByUserIdx.length > 0) {
        // 관심 등록이 되어 있다면
        if (NoticeByUserIdx[0].notice == "N") {
            // 알림 눌려져 있지 않다면 누르기
            const activateNotices = await userService.updateNoticeStatus(webtoonIdx, userIdx, NoticeByUserIdx[0].notice);
            return res.send(activateNotices);
        } else {
            // 알림 취소
            const deleteNotices = await userService.updateNoticeStatus(webtoonIdx, userIdx, NoticeByUserIdx[0].notice);
            return res.send(deleteNotices);
        }
    } else {
        // 관심이 선행되어야 알림 설정이 가능함
         return res.send(response(baseResponse.NOTICE_BEFORE_INTEREST));
    }
}

/*
    API No.
    API Name : 관심 목록 조회 API
    [GET] /app/users/{userIdx}/interests
*/
exports.getUserInterests = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const InterestsListResult = await userProvider.retrieveInterestsByUserIdx(userIdx);

    return res.send(InterestsListResult);
};


/*
    API No.
    API Name : 웹툰 보기 API
    [POST] /app/users/interest
*/
exports.postLooks = async function(req, res) {
    /*
        Body : userIdx, webtoonIdx, episodeIdx
    */
    const { userIdx, webtoonIdx, episodeIdx } = req.body;


    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.EPISODE_EPISODEIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const postLooksResponse = await userService.createLooks(userIdx, webtoonIdx, episodeIdx);

    return res.send(postLooksResponse);
}

/*
    API No.
    API Name : 최근 본 웹툰 조회 API
    [GET] /app/users/{userIdx}/history
*/
exports.getUserHistory = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const HistoryListResult = await userProvider.retrieveHistoryByUserIdx(userIdx);

    return res.send(HistoryListResult);
};


/*
    API No.
    API Name : 임시저장 API
    [POST] /app/users/storages
*/
exports.postStorages = async function(req, res) {
    /*
        Body : userIdx, webtoonIdx, episodeIdx
    */
    const { userIdx, webtoonIdx, episodeIdx } = req.body;


    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.EPISODE_EPISODEIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const postStoragesResponse = await userService.createStorages(userIdx, webtoonIdx, episodeIdx);

    return res.send(postStoragesResponse);
}

/*
    API No.
    API Name : 임시저장 조회 API
    [GET] /app/users/{userIdx}/storages/webtoons
*/
exports.getUserWebtoonsStorages = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const StorageListResult = await userProvider.retrieveWebtoonsStoragesByUserIdx(userIdx);

    return res.send(StorageListResult);
};

/*
    API No.
    API Name : 임시저장 상세조회 API
    [GET] /app/users/{userIdx}/storages/episodes
*/
exports.getUserEpisodesStorages = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const StorageListResult = await userProvider.retrieveEpisodesStoragesByUserIdx(userIdx);

    return res.send(StorageListResult);
};


/*
    API No.
    API Name : 임시저장 만료삭제 API
    [PATCH] /app/users/:userIdx/storages/:webtoonIdx/:episodeIdx
*/
exports.patchUserEpisodesStorages = async function(req, res) {
    // Path Variable : commentIdx
    const userIdx = req.params.userIdx;
    const webtoonIdx = req.params.webtoonIdx;
    const episodeIdx = req.params.episodeIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.COMMENT_COMMENTIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.EPISODE_EPISODEIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    // 존재하는 webtoon인지 확인
    const webtoonByIdx = await webtoonProvider.retrievewebtoonIdx(webtoonIdx);
    if (webtoonByIdx.isSuccess == false) {
        return res.send(webtoonByIdx);
    }
    const episodeByIdx = await webtoonProvider.retrieveepisodeIdx(episodeIdx);
    if (episodeByIdx.isSuccess == false) {
        return res.send(episodeByIdx);
    }

    const editStorage = await userService.editStorage(userIdx, webtoonIdx, episodeIdx);
    return res.send(editStorage);
};


/*
    API No.
    API Name : 하트 등록 API
    [POST] /app/users/hearts
*/
exports.postHearts = async function(req, res) {
    /*
        Body : userIdx, webtoonIdx
    */
    const { userIdx, webtoonIdx, episodeIdx } = req.body;


    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.EPISODE_EPISODEIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const HeartByUserIdx = await userProvider.retrieveHearts(userIdx, webtoonIdx, episodeIdx);

    if (HeartByUserIdx.length > 0) {
        // 좋아요가 이미 존재
        if (HeartByUserIdx[0].status == "D") {
            // 삭제된 좋아요 다시 누르기
            const activateHearts = await userService.updateHeartStatus(userIdx, webtoonIdx, episodeIdx, HeartByUserIdx[0].status);
            return res.send(activateHearts);
        } else {
            // 좋아요 취소
            const deleteHearts = await userService.updateHeartStatus(userIdx, webtoonIdx, episodeIdx, HeartByUserIdx[0].status);
            return res.send(deleteHearts);
        }
    } else {
        // 새로 좋아요 생성
        const insertHeartResponse = await userService.insertHeart(userIdx, webtoonIdx, episodeIdx);
        return res.send(insertHeartResponse);
    }
}


/*
    API No.
    API Name : 별점 등록 API
    [POST] /app/users/stars
*/
exports.postStars = async function(req, res) {
    /*
        Body : userIdx, webtoonIdx, episodeIdx, star
    */
    const { userIdx, webtoonIdx, episodeIdx, star } = req.body;


    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.WEBTOON_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.EPISODE_EPISODEIDX_EMPTY));
    } else if (!star) {
        return res.send(response(baseResponse.EPISODE_EPISODEIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const postStarsResponse = await userService.createStars(userIdx, webtoonIdx, episodeIdx, star);

    return res.send(postStarsResponse);
}


/*
    API No.
    API Name : 검색기록 저장 API
    [POST] /app/users/searchlog
*/
exports.postSeachLogs = async function(req, res) {
    /*
        Body : userIdx, keyword
    */
    const { userIdx, keyword } = req.body;


    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } else if (!keyword) {
        return res.send(response(baseResponse.KEYWORD_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const postSearchResponse = await userService.createSearchLog(userIdx, keyword);

    return res.send(postSearchResponse);
}

/*
    API No.
    API Name : 검색기록 조회 API
    [GET] /app/users/{userIdx}/searchlog
*/
exports.getUserSearchLogs = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const SearchListResult = await userProvider.retrieveSearchLogByUserIdx(userIdx);

    return res.send(SearchListResult);
};

/*
    API No.
    API Name : 검색기록 삭제 API
    [PATCH] /app/users/:userIdx/searchlog/delete
*/
exports.patchUserSearchLogs = async function(req, res) {
    // Path Variable : commentIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }

    /*
        Body : keyword
    */
    const { keyword } = req.body;

    if (!keyword) {
        return res.send(response(baseResponse.KEYWORD_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const editSearchLog = await userService.editSearchLog(userIdx,keyword);
    return res.send(editSearchLog);
};
