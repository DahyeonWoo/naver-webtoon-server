const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const commentProvider = require("./commentProvider");
const commentDao = require("./commentDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

const webtoonProvider = require("../Webtoon/webtoonProvider");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 댓글 생성
exports.createComment = async function(webtoonIdx, episodeIdx, userIdx, content, parentIdx) {
    try {
        const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
        if (episodeCheck.length < 1) {
            return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        }
        if (parentIdx != 0) {
            const parentIdxCheck = await commentProvider.checkParentIdx(parentIdx);
            if (parentIdxCheck.length < 1) {
                return errResponse(baseResponse.COMMENT_PARENT_IDX_NOT_EXIST);
            }
        }

        const insertCommentParams = [webtoonIdx, episodeIdx, userIdx, content, parentIdx];
        const connection = await pool.getConnection(async (conn) => conn);

        const commentResult = await commentDao.insertComment(connection, insertCommentParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"addedComment": commentResult[0].insertId});
    } catch (err) {
        logger.error(`APP - createComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 댓글 수정
exports.editComment = async function(commentIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();
        const commentResult = await commentDao.selectCommentByIdx(connection, commentIdx);

        if (commentResult[0].status == "D") {
            return errResponse(baseResponse.COMMENT_NOT_EXIST);
        }

        const editCommentResult = await commentDao.updateComment(connection, commentIdx);
        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, "댓글이 삭제되었습니다.");
    } catch (err) {
        logger.error(`App - editComment Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 댓글 좋아요, 좋아요 상태 업데이트
exports.updateLikeStatus = async function(userIdx, weebtoonIdx, episodeIdx, commentIdx, likeState, status) {

    try {
        const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
        if (episodeCheck.length < 1) {
            return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        }
        const commentCheck = await commentProvider.commentIdxCheck(commentIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.COMMENT_COMMENTIDX_NOT_EXIST);
        }

        const connection = await pool.getConnection(async (conn) => conn);
        // 좋아요 활성
        if (status == "D") {
            status = "Y";
            const activateLikes = await commentDao.updateLikes(connection, userIdx, weebtoonIdx, episodeIdx, commentIdx, likeState, status);
            connection.release();
            return response(baseResponse.SUCCESS, "좋아요가 활성되었습니다.");
        } else {
            // 좋아요 취소
            status = "D";
            const deleteLikes = await commentDao.updateLikes(connection, userIdx, weebtoonIdx, episodeIdx, commentIdx, likeState, status);
            connection.release();
            return response(baseResponse.SUCCESS, "좋아요가 비활성되었습니다.");
        }
    } catch (err) {
        logger.error(`App - updateLikeStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 댓글 좋아요, 없다면 생성하기
exports.insertLike = async function(userIdx, webtoonIdx, episodeIdx, commentIdx, likeState) {
    //try {
        // webtoonIdx, episodeIdx, commentIdx 있는지 확인
        const webtoonByIdx = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        if (webtoonByIdx.length < 1) {
            return errResponse(baseResponse.ARTICLE_ARTICLE_NOT_EXIST);
        }
        /*
        const episodeByIdx = await webtoonProvider.epsiodeIdxCheck(episodeIdx);
        if (episodeByIdx.length < 1) {
            return errResponse(baseResponse.ARTICLE_ARTICLE_NOT_EXIST);
        }
         */
    /*
        const commentByIdx = await commentProvider.commentIdxCheck(commentIdx);
        if (commentByIdx.length < 1) {
            return errResponse(baseResponse.ARTICLE_ARTICLE_NOT_EXIST);
        }

     */

        const connection = await pool.getConnection(async (conn) => conn);
        const insertLikeParams = [userIdx, webtoonIdx, episodeIdx, commentIdx, likeState];
        const insertLikeResult = await commentDao.insertLike(connection, insertLikeParams);
        connection.release();

        return response(baseResponse.SUCCESS, "좋아요가 활성되었습니다.");
    //} catch (err) {
        //logger.error(`App - insertLike Service error\n: ${err.message}`);
        //return errResponse(baseResponse.DB_ERROR);
    //}
};

// 댓글 신고
exports.createReport = async function (userIdx, webtoonIdx, episodeIdx, commentIdx, reason) {
    try {

        const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        }
        const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
        if (episodeCheck.length < 1) {
            return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        }
        const commentCheck = await commentProvider.commentIdxCheck(commentIdx);
        if (webtoonCheck.length < 1) {
            return errResponse(baseResponse.COMMENT_COMMENT_NOT_EXIST);
        }

        const insertReportParams = [userIdx, webtoonIdx, episodeIdx, commentIdx, reason];

        const connection = await pool.getConnection(async (conn) => conn);

        const ReportIdxResult = await commentDao.insertReport(connection, insertReportParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"addedReport": ReportIdxResult[0].insertId});

    } catch (err) {
        logger.error(`App - createReport Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

/*
exports.createLike = async function (userIdx, webtoonIdx, episodeIdx, likeIdx, likeState) {
    try {
        const insertLikeParams = [userIdx, webtoonIdx, episodeIdx, likeIdx, likeState];

        const connection = await pool.getConnection(async (conn) => conn);

        const likeIdxResult = await likeDao.insertLike(connection, insertLikeParams);
        console.log(`추가된 댓글 좋아요/싫어요 : ${likeIdxResult[0]}`)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createLike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editLike = async function(likeIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();
        const likeResult = await commentDao.selectLikeByIdx(connection, likeIdx);

        if(likeResult[0].status == "D"){
            const editLikeResult = await commentDao.updateLike(connection, likeIdx); //likeResult[0].status = "Y"
        }
        if(likeResult[0].status == 'Y') {
            const editLikeResult = await commentDao.updateLike(connection, likeIdx); //likeResult[0].status = "D"
        }

        const editLikeResult = await commentDao.updateLike(connection, likeIdx); //여기서 처리
        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, "댓글이 변경되었습니다.");
    } catch (err) {
        logger.error(`App - editlike Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};
 */