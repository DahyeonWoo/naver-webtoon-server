const { response, errResponse } = require("../../../config/response");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");

const webtoonDao = require("./webtoonDao");
const webtoonService = require("./webtoonService");

// 웹툰 전체 조회
exports.retrieveWebtoonList = async function() {
    const connection = await pool.getConnection(async (conn) => conn);

    // 웹툰 조회
    const webtoonListResult = await webtoonDao.selectwebtoons(connection);
    /*
    for (webtoon of webtoonListResult) {
        const webtoonImgResult = await webtoonDao.selectwebtoonImg(connection, Webtoon.webtoonIdx);
        const img = webtoonImgResult[0];
        webtoon.representativeImg = img;
    }
    */
    connection.release();

    return webtoonListResult;
};

// 웹툰 상세페이지 조회
exports.retrieveWebtoon = async function(webtoonIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //const addView = await webtoonService.addView(webtoonIdx);
        const webtoonResult = await webtoonDao.selectwebtoonIdx(connection, webtoonIdx, userIdx);
        const webtoon = webtoonResult[0];

        /*
        // 이미지 따로 추가
        const imgArray = [];
        const webtoonImgResult = await webtoonDao.selectwebtoonImg(connection, webtoonIdx);
        for (img of webtoonImgResult) {
            imgArray.push(img);
        }
        webtoon.imgUrls = imgArray;
         */

        await connection.commit();
        connection.release();

        if (webtoonResult == undefined || webtoonResult == null) {
            return response(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        } else if (webtoon.status == "D") {
            return response(baseResponse.WEBTOON_WEBTOON_NOT_EXIST);
        } else if (webtoon.status == "H") {
            return response(baseResponse.WEBTOON_WEBTOON_CANNOT_SEE);
        }

        return response(baseResponse.SUCCESS, webtoon);
    } catch (err) {
        logger.error(`App - retrieveWebtoon Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 웹툰 에피소드 조회
exports.retrieveEpisode = async function(webtoonIdx, episodeIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //const addView = await webtoonService.addView(webtoonIdx);
        const episodeResult = await webtoonDao.selectepisodeIdx(connection, webtoonIdx, episodeIdx, userIdx);
        const episode = episodeResult[0];

        /*
        // 이미지 따로 추가
        const imgArray = [];
        const webtoonImgResult = await webtoonDao.selectwebtoonImg(connection, webtoonIdx);
        for (img of webtoonImgResult) {
            imgArray.push(img);
        }
        webtoon.imgUrls = imgArray;
         */

        await connection.commit();
        connection.release();

        if (episodeResult == undefined || episodeResult == null) {
            return response(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        } else if (episode.status == "D") {
            return response(baseResponse.EPISODE_EPISODE_NOT_EXIST);
        } else if (episode.status == "H") {
            return response(baseResponse.EPISODE_EPISODE_CANNOT_SEE);
        }

        return response(baseResponse.SUCCESS, episode);
    } catch (err) {
        logger.error(`App - retrieveEpisode Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 배너 조회
exports.retrieveBanner = async function() {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        //const addView = await webtoonService.addView(webtoonIdx);
        const bannerResult = await webtoonDao.selectbannerIdx(connection);
        const banner = bannerResult[0];

        await connection.commit();
        connection.release();

        if (bannerResult == undefined || bannerResult == null) {
            return response(baseResponse.BANNER_BANNER_NOT_EXIST);
        } else if (banner.status == "D") {
            return response(baseResponse.BANNER_BANNER_NOT_EXIST);
        } else if (banner.status == "H") {
            return response(baseResponse.BANNER_BANNER_CANNOT_SEE);
        }

        return response(baseResponse.SUCCESS, banner);
    } catch (err) {
        logger.error(`App - retrieveBanner Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 수정, 웹툰 존재하는지 확인
exports.webtoonIdxCheck = async function(webtoonIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const webtoonIdxResult = await webtoonDao.selectwebtoonBywebtoonIdx(connection, webtoonIdx);
    connection.release();

    return webtoonIdxResult;
};

// 수정, 에피소드 존재하는지 확인
exports.episodeIdxCheck = async function(episodeIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const episodeIdxResult = await webtoonDao.selectepisodeByepisodeIdx(connection, episodeIdx);
    connection.release();

    return episodeIdxResult;
};

// insertLike, 수정, webtoonIdx 존재하는지 확인, 위와 같음
exports.retrievewebtoonIdx = async function(webtoonIdx) {
    const connection = await pool.getConnection(async (conn) =>  conn);
    const webtoonResult = await webtoonDao.selectwebtoonBywebtoonIdx(connection, webtoonIdx);
    connection.release();

    return webtoonResult;
};

// insertLike, 수정, episodeIdx 존재하는지 확인, 위와 같음
exports.retrieveepisodeIdx = async function(episodeIdx) {
    const connection = await pool.getConnection(async (conn) =>  conn);
    const episodeResult = await webtoonDao.selectepisodeByepisodeIdx(connection, episodeIdx);
    connection.release();

    return episodeResult;
};

// 추천완결 조회
exports.retrieveRecommendationList = async function() {
    const connection = await pool.getConnection(async (conn) => conn);

    // 웹툰 조회
    const webtoonListResult = await webtoonDao.selectrecommendations(connection);
    /*
    for (webtoon of webtoonListResult) {
        const webtoonImgResult = await webtoonDao.selectwebtoonImg(connection, Webtoon.webtoonIdx);
        const img = webtoonImgResult[0];
        webtoon.representativeImg = img;
    }
    */
    connection.release();

    return webtoonListResult;
};

// 추천완결 관심웹툰 조회
exports.retrieveInterestedRecommendationList = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    // 웹툰 조회
    const webtoonListResult = await webtoonDao.selectinterestedrecommendations(connection, userIdx);
    /*
    for (webtoon of webtoonListResult) {
        const webtoonImgResult = await webtoonDao.selectwebtoonImg(connection, Webtoon.webtoonIdx);
        const img = webtoonImgResult[0];
        webtoon.representativeImg = img;
    }
    */
    connection.release();

    return webtoonListResult;
};


// 베스트도전 전체 조회
exports.retrieveBestchallengeWebtoonList = async function() {
    const connection = await pool.getConnection(async (conn) => conn);

    // 웹툰 조회
    const webtoonListResult = await webtoonDao.selectbestchallengewebtoons(connection);
    /*
    for (webtoon of webtoonListResult) {
        const webtoonImgResult = await webtoonDao.selectwebtoonImg(connection, Webtoon.webtoonIdx);
        const img = webtoonImgResult[0];
        webtoon.representativeImg = img;
    }
    */
    connection.release();

    return webtoonListResult;
};


/*

// 검색
exports.searchwebtoons = async function(searchQueryList, searchType) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();
        const searchResult = await webtoonDao.searchwebtoons(connection, searchQueryList, searchType);

        // for (webtoon of searchResult) {
        //     const webtoonImgResult = await webtoonDao.selectwebtoonImg(connection, webtoon.idx);
        //     const img = webtoonImgResult[0];
        //     webtoon.representativeImg = img;
        // }

        // 검색어 저장
        for (searchQuery of searchQueryList) {
            const checkSearchWord = await webtoonDao.selectSearchWord(connection, searchQuery);
            // 저장되지 않은 검색어
            if (checkSearchWord.length < 1) {
                const insertSearchWord = await webtoonDao.insertSearchWord(connection, searchQuery);
            } else {
                const updateSearchWord = await webtoonDao.updateSearchWord(connection, searchQuery);
            }
        }

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS, searchResult);
    } catch (err) {
        logger.error(`App - searchwebtoons Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};
 */