const { response, errResponse } = require("../../../config/response");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");

const commentDao = require("./commentDao");

const webtoonProvider = require("../Webtoon/webtoonProvider");

// Provider: Read 비즈니스 로직 처리

// parentidx 존재 확인
exports.checkParentIdx = async function (parentIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const parentIdxResult = await commentDao.selectParentIdx(connection, parentIdx);
    connection.release();

    return parentIdxResult;
}

// commentIdx 존재 확인
exports.retrieveCommentByIdx = async function(commentIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const commentResult = await commentDao.selectCommentByIdx(connection, commentIdx);
    connection.release();

    if (commentResult.length < 1 || commentResult[0].status == 'D') {
        return errResponse(baseResponse.COMMENT_NOT_EXIST);
    }
    return commentResult;
};

// 좋아요 등록, 좋아요 가져오기
exports.retrieveLikes = async function(userIdx, webtoonIdx, episodeIdx, commentIdx, likeState) {
    const connection = await pool.getConnection(async (conn) => conn);
    const likeResult = await commentDao.selectLikes(connection, userIdx, webtoonIdx, episodeIdx, commentIdx, likeState);
    connection.release();

    return likeResult;
};

// 수정, 댓글 존재하는지 확인
exports.commentIdxCheck = async function(commentIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const commentIdxResult = await commentDao.selectcommentBycommentIdx(connection, commentIdx);
    connection.release();

    return commentIdxResult;
};

/*
// insertLike, 수정, 댓글 읽기, 존재하는지 확인, 위와 같음
exports.retrievecommentIdx = async function(commentIdx) {
    const connection = await pool.getConnection(async (conn) =>  conn);
    const commentResult = await commentDao.selectcommentBycommentIdx(connection, commentIdx);
    connection.release();

    return commentResult;
};
 */

// 특정 에피소드 댓글 조회
exports.retrieveComments = async function (webtoonIdx,episodeIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
    if (webtoonCheck.length < 1) {
        return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
    }
    const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
    if (episodeCheck.length < 1) {
        return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
    }

    // 댓글 조회
    const commentsResult = await commentDao.selectComments(connection, webtoonIdx, episodeIdx);

    connection.release();

    return response(baseResponse.SUCCESS, commentsResult);
};


// 특정 에피소드 베스트댓글 조회
exports.retrieveBestComments = async function (webtoonIdx,episodeIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const webtoonCheck = await webtoonProvider.webtoonIdxCheck(webtoonIdx);
    if (webtoonCheck.length < 1) {
        return errResponse(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
    }
    const episodeCheck = await webtoonProvider.episodeIdxCheck(episodeIdx);
    if (episodeCheck.length < 1) {
        return errResponse(baseResponse.EPISODE_EPISODE_NOT_EXIST);
    }

    // 댓글 조회
    const bestcommentsResult = await commentDao.selectBestComments(connection, webtoonIdx, episodeIdx);

    connection.release();

    return response(baseResponse.SUCCESS, bestcommentsResult);
};


/*
exports.retrieveCommentList = async function (parentIdx) {
    if (!parentIdx) {
        const connection = await pool.getConnection(async (conn) => conn);
        const commentListResult = await commentDao.selectComment(connection);
        connection.release();

        return commentListResult;

    } else {
        const connection = await pool.getConnection(async (conn) => conn);
        const commentListResult = await commentDao.selectComment(connection, parentIdx);
        connection.release();

        return commentListResult;
    }
};

exports.retrieveLikeByIdx = async function(userIdx, webtoonIdx, episodeIdx, commentIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const likeResult = await commentDao.selectLikeByIdx(connection, userIdx, webtoonIdx, episodeIdx, commentIdx);
    connection.release();

    if (likeResult.length < 1 || likeResult[0].status == 'D') {
        return errResponse(baseResponse.like_NOT_EXIST);
    }
    return likeResult;
};
 */