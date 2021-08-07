const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const webtoonProvider = require("./webtoonProvider");
const webtoonDao = require("./webtoonDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// 웹툰 생성
exports.createWebtoon = async function (title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const insertwebtoonParmas = [title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree];

        await connection.beginTransaction();
        // 판매글 생성
        const webtoonIdxResult = await webtoonDao.insertwebtoon(connection, insertwebtoonParmas);

        const webtoonIdx = webtoonIdxResult[0].insertId;

        /*
        // 웹툰 이미지 생성
        if (webtoonImgUrl) {
            // 이미지 입력한 경우
            for (img of thumbnailUrl) {
                const insertwebtoonImgParams = [webtoonIdx, img];
                const webtoonImgResult = await webtoonDao.insertwebtoonImg(connection, insertwebtoonImgParams);
            }
        } else {
            // 기본이미지
            const categoryImgRow = await webtoonProvider.categoryImgCheck(categoryIdx);
            webtoonImgUrl = categoryImgRow;
            const insertwebtoonImgParams = [webtoonIdx, webtoonImgUrl];
            const webtoonImgResult = await webtoonDao.insertwebtoonImg(connection, insertwebtoonImgParams);
        }
         */

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, {"addedWebtoon": webtoonIdx});
    } catch(err) {
        logger.error(`App - createWebtoon Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 에피소드 생성
exports.createEpisode = async function (episodeIdx, webtoonIdx, title, thumbnailUrl, contentUrl, words, isBGM) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const insertepisodeParmas = [episodeIdx, webtoonIdx, title, thumbnailUrl, contentUrl, words, isBGM];

        await connection.beginTransaction();
        // 판매글 생성
        const episodeIdxResult = await webtoonDao.insertepisode(connection, insertepisodeParmas);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, {webtoonIdx, episodeIdx});
    } catch(err) {
        logger.error(`App - createEpisode Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 연재요일 등록
exports.createSerialday = async function (serialdayIdx, webtoonIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const insertserialdayParmas = [serialdayIdx, webtoonIdx];

        await connection.beginTransaction();
        // 판매글 생성
        const serialdayIdxResult = await webtoonDao.insertserialday(connection, insertserialdayParmas);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err) {
        logger.error(`App - createEpisode Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 배너 생성
exports.createBanner = async function (thumbnailUrl, webtoonIdx, linkUrl) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const insertbannerParmas = [thumbnailUrl, webtoonIdx, linkUrl];

        await connection.beginTransaction();
        // 판매글 생성
        const bannerIdxResult = await webtoonDao.insertbanner(connection, insertbannerParmas);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err) {
        logger.error(`App - createEpisode Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 웹툰 생성
exports.createBestchallengewebtoon = async function (title, userIdx, thumbnailUrl, summary, subsummary, categoryIdx, promotion, official, complete) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const insertwebtoonParmas = [title, userIdx, thumbnailUrl, summary, subsummary, categoryIdx, promotion, official, complete];

        await connection.beginTransaction();
        // 판매글 생성
        const webtoonIdxResult = await webtoonDao.insertbestchallengewebtoon(connection, insertwebtoonParmas);

        const webtoonIdx = webtoonIdxResult[0].insertId;

        /*
        // 웹툰 이미지 생성
        if (webtoonImgUrl) {
            // 이미지 입력한 경우
            for (img of thumbnailUrl) {
                const insertwebtoonImgParams = [webtoonIdx, img];
                const webtoonImgResult = await webtoonDao.insertwebtoonImg(connection, insertwebtoonImgParams);
            }
        } else {
            // 기본이미지
            const categoryImgRow = await webtoonProvider.categoryImgCheck(categoryIdx);
            webtoonImgUrl = categoryImgRow;
            const insertwebtoonImgParams = [webtoonIdx, webtoonImgUrl];
            const webtoonImgResult = await webtoonDao.insertwebtoonImg(connection, insertwebtoonImgParams);
        }
         */

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, {"addedBestChallengeWebtoon": webtoonIdx});
    } catch(err) {
        logger.error(`App - createBestchallengeWebtoon Service Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 웹툰 수정
exports.editwebtoon = async function(webtoonIdx, title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        // 원래 이미지 삭제
        //const deleteOriginImg = await webtoonDao.deleteImg(connection, webtoonIdx);
        // 이미지 수정
        //for (imgIdx in webtoonImgUrl) {
        //    const insertwebtoonImgParams = [webtoonIdx, webtoonImgUrl[imgIdx]];
        //    const editImg = await webtoonDao.insertwebtoonImg(connection, insertwebtoonImgParams);
        //}

        // 글 수정
        const editwebtoonResult = await webtoonDao.updatewebtoon(connection, webtoonIdx, title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree);
        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editwebtoon Service Error\n ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

/*

exports.addView = async function(webtoonIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const addViewResult = await webtoonDao.addView(connection, webtoonIdx);
    connection.release();

    return addViewResult;
}
 */
