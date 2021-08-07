const {response, errResponse} = require("../../../config/response");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");

const userDao = require("./userDao");
//const articleDao = require("../Article/articleDao");

// 로그인
exports.userIDCheck = async function (userID) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIDCheckResult = await userDao.selectUserID(connection, userID);
    connection.release();

    return userIDCheckResult;
};

// 로그인
exports.passwordCheck = async function (selectUserPasswordParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordCheckResult = await userDao.selectUserPassword(
        connection,
        selectUserPasswordParams
    );
    connection.release();

    return passwordCheckResult[0];
};

// 로그인
exports.accountCheck = async function (userID) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAccountResult = await userDao.selectUserAccount(connection, userID)
    connection.release();

    return userAccountResult;
};

// 로그인, 자동 로그인
exports.checkJWT = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkJWTResult = await userDao.selectJWT(connection, userIdx);
    connection.release();

    return checkJWTResult;
};

// 유저 정보 조회
exports.retrieveUserByIdx = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdxResult = await userDao.selectUserByIdx(connection, userIdx);
    connection.release();

    return userIdxResult;
};

// 유저 정보 수정
exports.phoneNumberCheck = async function (phoneNumber) {
    const connection = await pool.getConnection(async (conn) => conn);
    const phoneNumberCheckResult = await userDao.selectUserPhoneNumber(connection, phoneNumber);
    connection.release();

    return phoneNumberCheckResult;
};

// 유저 프로필 조회
exports.retrieveUserProfile = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userProfileResult = await userDao.selectUserProfile(connection, userIdx);
    connection.release();

    if (userProfileResult.length < 1) {
        return response(baseResponse.USER_USER_NOT_EXIST);
    }

    return response(baseResponse.SUCCESS, userProfileResult[0]);
};

// 유저 프로필 수정
exports.nickNameCheck = async function (userNick) {
    const connection = await pool.getConnection(async (conn) => conn);
    const nickNameResult = await userDao.selectUserNickName(connection, userNick)
    connection.release();

    return nickNameResult;
};

// interest 등록
exports.retrieveInterests = async function(webtoonIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const interestResult = await userDao.selectInterests(connection, webtoonIdx, userIdx);
    connection.release();

    return interestResult;
};

// notice 등록
exports.retrieveNotices = async function(webtoonIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const noticeResult = await userDao.selectNotices(connection, webtoonIdx, userIdx);
    connection.release();

    return noticeResult;
};

// 관심 웹툰 조회
exports.retrieveInterestsByUserIdx = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const InterestsList = await userDao.selectInterestsByUserIdx(connection, userIdx);
    /*
    for (webtoon of InterestsList) {
        const webtoonImgResult = await webtoonDao.selectWebtoonImg(connection, webtoon.webtoonIdx);
        const img = webtoonImgResult[0];
        webtoon.representativeImg = img;
    }
     */
    connection.release();

    return response(baseResponse.SUCCESS, InterestsList);
};

// 감상 기록 조회
exports.retrieveHistoryByUserIdx = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const HistoryList = await userDao.selectHistoryByUserIdx(connection, userIdx);
    /*
    for (webtoon of InterestsList) {
        const webtoonImgResult = await webtoonDao.selectWebtoonImg(connection, webtoon.webtoonIdx);
        const img = webtoonImgResult[0];
        webtoon.representativeImg = img;
    }
     */
    connection.release();

    return response(baseResponse.SUCCESS, HistoryList);
};

// 임시저장 조회
exports.retrieveWebtoonsStoragesByUserIdx = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const StorageList = await userDao.selectWebtoonsStoragesByUserIdx(connection, userIdx);
    /*
    for (webtoon of InterestsList) {
        const webtoonImgResult = await webtoonDao.selectWebtoonImg(connection, webtoon.webtoonIdx);
        const img = webtoonImgResult[0];
        webtoon.representativeImg = img;
    }
     */
    connection.release();

    return response(baseResponse.SUCCESS, StorageList);
};

// 임시저장 조회
exports.retrieveEpisodesStoragesByUserIdx = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const StorageList = await userDao.selectEpisodesStoragesByUserIdx(connection, userIdx);
    /*
    for (webtoon of InterestsList) {
        const webtoonImgResult = await webtoonDao.selectWebtoonImg(connection, webtoon.webtoonIdx);
        const img = webtoonImgResult[0];
        webtoon.representativeImg = img;
    }
     */
    connection.release();

    return response(baseResponse.SUCCESS, StorageList);
};

// heart 등록
exports.retrieveHearts = async function(userIdx, webtoonIdx, episodeIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const heartResult = await userDao.selectHearts(connection, userIdx, webtoonIdx, episodeIdx);
    connection.release();

    return heartResult;
};

// 임시저장 조회
exports.retrieveSearchLogByUserIdx = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const SearchList = await userDao.selectSearchLogByUserIdx(connection, userIdx);

    connection.release();

    return response(baseResponse.SUCCESS, SearchList);
};


// 수정, 검색 기록 존재하는지 확인
exports.keywordCheck = async function(userIdx, keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    const keywordResult = await userDao.selectkeywordByuserIdx(connection, userIdx, keyword);
    connection.release();

    return keywordResult;
};
