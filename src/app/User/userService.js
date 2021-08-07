const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

const webtoonProvider = require("../Webtoon/webtoonProvider");
const webtoonDao = require("../Webtoon/webtoonDao");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 회원가입
exports.createUser = async function (userID, userPW, userName, birthday, gender, email, mobileNo) {
    try {
        // 아이디 중복 확인
        //const userIDRows = await userProvider.userIDCheck(userID);
        //if (userIDRows.length > 0)
        //    return errResponse(baseResponse.SIGNUP_REDUNDANT_ID);

        //비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(userPW)
            .digest("hex");

        const insertUserParams = [userID, hashedPassword, userName, birthday, gender, email, mobileNo];

        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertUser(connection, insertUserParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"addedUser": userIdResult[0].insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//로그인
exports.postSignIn = async function(userID,userPW) {
    // try {
        // ID 존재 여부 확인
        const userIDRows = await userProvider.userIDCheck(userID);
        if (userIDRows.length < 1) {
            return errResponse(baseResponse.SIGNIN_WRONG);
        }

        const selectuserID = userIDRows[0].userID;

        //비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(userPW)
            .digest("hex");

        const selectUserPasswordParams = [selectuserID, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams)


        //console.log(selectuserID)
        //console.log(hashedPassword)
        //console.log(hashedPassword.substring(0,45))
        //console.log(passwordRows[0].userPW)

        if(passwordRows[0].userPW != hashedPassword.substring(0,45)){
            return errResponse(baseResponse.SIGNIN_WRONG);
        }

        //계정 상태 확인
        const userAccountRows = await userProvider.accountCheck(selectuserID);

        if (userAccountRows[0].status === "I") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userAccountRows[0].status === "D") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userAccountRows[0].userIdx) // DB의 userIdx

        // 로그인 여부
        const checkJWT = await userProvider.checkJWT(userIDRows[0].userIdx);
        if (checkJWT.length > 0) {
            return errResponse(baseResponse.ALREADY_LOGIN);
        }

        //토큰 생성 서비스
        let token = await jwt.sign(
            {
                userIdx: userAccountRows[0].userIdx,
            }, //토큰의 내용 (payload)
            secret_config.jwtsecret, //비밀키
            {
                expiresIn: "365d", //유효기간
                subject: "User",
            }
        );

        const connection = await pool.getConnection(async (conn) => conn);
        const tokenResult = await userDao.insertToken(connection, userAccountRows[0].userIdx, token);
        connection.release();

        return response(baseResponse.SUCCESS, {'userIdx': userAccountRows[0].userIdx, 'jwt': token});
    // } catch(err) {
    //     logger.error(`App - postSignIn Service error\n: ${err.message}`);
    //     return errResponse(baseResponse.DB_ERROR);
    // }
};

// 로그아웃
exports.deleteJWT = async function(userIdx) {
    try {
        const connection = await pool.getConnection(async(conn) => conn);
        const deleteJWTResult = await userDao.deleteJWT(connection, userIdx);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - deleteJWT Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 탈퇴
exports.withDrawUser = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        const withDrawUserResult = await userDao.withDrawUser(connection, userIdx);
        const deleteJWTResult = await userDao.deleteJWT(connection, userIdx);
        connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, {"userIdx": userIdx});
    } catch (err) {
        logger.error(`App - withDrawUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 유저 정보 수정
exports.updateUserAccount = async function(userIdx, mobileNo, email) {
    try {
        // 전화번호 중복 확인
        if (mobileNo) {
            const phoneNumberRows = await userProvider.phoneNumberCheck(mobileNo);
            if (phoneNumberRows.length > 0) {
                return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER);
            }
        }

        const connection = await pool.getConnection(async (conn) => conn);
        if (mobileNo) {
            const updateParams = [mobileNo, userIdx];
            const updateUserAccountResult = await userDao.updateUserPhoneNumber(connection, updateParams);
        } else {
            const updateParams = [email, userIdx];
            const updateUserAccountResult = await userDao.updateUserEmail(connection, updateParams);
        }
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - updateUserAccount Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 유저 프로필 수정
exports.editProfile = async function(userIdx, profileUrl, userNick) {
    try {
        // 닉네임 중복 확인
        const nickNameRows = await userProvider.nickNameCheck(userNick);
        if (nickNameRows.length > 0) {
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
        }

        const connection = await pool.getConnection(async (conn) => conn);
        const editProfileResult = await userDao.updateProfile(connection, userIdx, profileUrl, userNick);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 관심 등록
exports.updateInterestStatus = async function(webtoonIdx, userIdx, status) {

    try {
        // webtoonIdx 있는지 확인
        const webtoonByIdx = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        //const webtoonByIdx = await webtoonProvider.retrievewebtoonIdx(webtoonIdx);

        if (webtoonByIdx.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const connection = await pool.getConnection(async (conn) => conn);
        // 좋아요 활성
        if (status == "D") {
            status = "Y";
            const activateInterests = await userDao.updateInterests(connection, webtoonIdx, userIdx, status);
            connection.release();
            return response(baseResponse.SUCCESS, "관심 등록하였습니다.");
        } else {
            // 좋아요 취소
            status = "D";
            const deleteInterests = await userDao.updateInterests(connection, webtoonIdx, userIdx, status);
            connection.release();
            return response(baseResponse.SUCCESS, "관심 등록이 해제되었습니다.");
        }
    } catch (err) {
        logger.error(`App - updateLikeStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.insertInterest = async function(webtoonIdx, userIdx) {
    try {
        // webtoonIdx 있는지 확인
        const webtoonByIdx = await webtoonProvider.retrievewebtoonIdx(webtoonIdx);
        if (webtoonByIdx.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }

        const connection = await pool.getConnection(async (conn) => conn);
        const insertInterestParams = [webtoonIdx, userIdx];
        const insertInterestResult = await userDao.insertInterest(connection, insertInterestParams);
        connection.release();

        return response(baseResponse.SUCCESS, "관심 등록하였습니다.");
    } catch (err) {
        logger.error(`App - insertInterest Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 알림 등록
exports.updateNoticeStatus = async function(webtoonIdx, userIdx, notice) {

    try {
        // webtoonIdx 있는지 확인
        const webtoonByIdx = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        //const webtoonByIdx = await webtoonProvider.retrievewebtoonIdx(webtoonIdx);

        if (webtoonByIdx.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const connection = await pool.getConnection(async (conn) => conn);
        // 알림 활성
        if (notice == "N") {
            notice = "Y";
            const activateNotices = await userDao.updateNotices(connection, webtoonIdx, userIdx, notice);
            connection.release();
            return response(baseResponse.SUCCESS, "알림을 등록하였습니다.");
        } else {
            // 알림 취소
            notice = "N";
            const deleteInterests = await userDao.updateNotices(connection, webtoonIdx, userIdx, notice);
            connection.release();
            return response(baseResponse.SUCCESS, "알림이 해제되었습니다.");
        }
    } catch (err) {
        logger.error(`App - updateLikeStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 본 기록 생성
exports.createLooks = async function(userIdx, webtoonIdx, episodeIdx) {
    try {
        const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
        if (episodeCheck.length < 1) {
            return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        }

        const insertLookParams = [userIdx, webtoonIdx, episodeIdx];
        const connection = await pool.getConnection(async (conn) => conn);

        const lookResult = await userDao.insertLook(connection, insertLookParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"addedLook": lookResult[0].insertId});
    } catch (err) {
        logger.error(`APP - createComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 임시저장
exports.createStorages = async function(userIdx, webtoonIdx, episodeIdx) {
    try {
        const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
        if (episodeCheck.length < 1) {
            return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        }

        const insertStorageParams = [userIdx, webtoonIdx, episodeIdx];
        const connection = await pool.getConnection(async (conn) => conn);

        const storageResult = await userDao.insertStorage(connection, insertStorageParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"addedStorage": storageResult[0].insertId});
    } catch (err) {
        logger.error(`APP - createComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 임시저장 삭제
exports.editStorage = async function(userIdx, webtoonIdx, episodeIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
        if (episodeCheck.length < 1) {
            return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        }

        const editStorageResult = await userDao.updateStorage(connection, userIdx, webtoonIdx, episodeIdx);
        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, "임시저장 만료 삭제되었습니다.");
    } catch (err) {
        logger.error(`App - editStorage Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 하트 등록
exports.updateHeartStatus = async function(userIdx, webtoonIdx, episodeIdx, status) {

    try {
        // webtoonIdx 있는지 확인
        //const webtoonByIdx = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        const webtoonByIdx = await webtoonProvider.retrievewebtoonIdx(webtoonIdx);
        if (webtoonByIdx.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }

        // episodeIdx 있는지 확인
        const episodeByIdx = await webtoonProvider.episodeIdxCheck(episodeIdx);
        //const webtoonByIdx = await webtoonProvider.retrievewebtoonIdx(webtoonIdx);
        if (episodeByIdx.length < 1) {
            return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        }

        const connection = await pool.getConnection(async (conn) => conn);
        // 좋아요 활성
        if (status == "D") {
            status = "Y";
            const activateHearts = await userDao.updateHearts(connection, webtoonIdx, userIdx, status);
            connection.release();
            return response(baseResponse.SUCCESS, "하트 등록하였습니다.");
        } else {
            // 좋아요 취소
            status = "D";
            const deleteHearts = await userDao.updateHearts(connection, webtoonIdx, userIdx, status);
            connection.release();
            return response(baseResponse.SUCCESS, "하트 등록이 해제되었습니다.");
        }
    } catch (err) {
        logger.error(`App - updateHeartStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.insertHeart = async function(userIdx, webtoonIdx, episodeIdx) {
    try {
        // webtoonIdx 있는지 확인
        const webtoonByIdx = await webtoonProvider.retrievewebtoonIdx(webtoonIdx);
        if (webtoonByIdx.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        console.log(webtoonByIdx);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertHeartParams = [userIdx, webtoonIdx, episodeIdx];
        const insertHeartResult = await userDao.insertHeart(connection, insertHeartParams);
        connection.release();

        return response(baseResponse.SUCCESS, "하트 등록하였습니다.");
    } catch (err) {
        logger.error(`App - insertHeart Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 별점
exports.createStars = async function(userIdx, webtoonIdx, episodeIdx, star) {
    try {
        const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
        if (episodeCheck.length < 1) {
            return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        }

        const insertStarParams = [userIdx, webtoonIdx, episodeIdx, star];
        const connection = await pool.getConnection(async (conn) => conn);

        const starResult = await userDao.insertStar(connection, insertStarParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"addedStar": starResult[0].insertId});
    } catch (err) {
        logger.error(`APP - createStar Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 검색기록 저장
exports.createSearchLog = async function(userIdx, keyword) {
    // try {
        const insertSearchParams = [userIdx, keyword];
        const connection = await pool.getConnection(async (conn) => conn);

        const searchResult = await userDao.insertSearchLog(connection, insertSearchParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"addedSearchLog": searchResult[0].insertId});
    // } catch (err) {
    //     logger.error(`APP - createSearchLog Service error\n: ${err.message}`);
    //     return errResponse(baseResponse.DB_ERROR);
    // }
};


// 검색기록 삭제
exports.editSearchLog = async function(userIdx,keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        // 키워드 존재하는지 확인
        const keywordCheck = await userProvider.keywordCheck(userIdx,keyword);
        if (keywordCheck.length < 1) {
            return errResponse(baseResponse.KEYWORD_NOT_EXIST);
        }

        const editSearchLogResult = await userDao.updateSearchLog(connection,userIdx,keyword);
        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, "검색 기록이 삭제되었습니다.");
    } catch (err) {
        logger.error(`App - editSearchLog Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};
