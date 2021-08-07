const jwtMiddleware = require("../../../config/jwtMiddleware");
const commentProvider = require("../../app/Comment/commentProvider");
const commentService = require("../../app/Comment/commentService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const userProvider = require("../User/userProvider");
//const {emit} = require("nodemon");


/*
    API No.
    API Name : 댓글 생성 API
    [POST] /app/comments
*/
exports.postComments = async function (req, res) {
    /*
        Body : webtoonIdx, episodeIdx, userIdx, parentCommentIdx, content
    */
    var { webtoonIdx, episodeIdx, userIdx, content, parentIdx } = req.body;

    if (!webtoonIdx) {
        return res.send(response(baseResponse.COMMENT_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.COMMENT_EPISODEIDX_EMPTY));
    } else if (!userIdx) {
        return res.send(response(baseResponse.COMMENT_USERIDX_EMPTY));
    } else if (!content) {
        return res.send(response(baseResponse.COMMENT_CONTENT_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }


    if (content.length > 200) {
        return res.send(response(baseResponse.COMMENT_CONTENT_LENGTH));
    }

    if (!parentIdx) {
        parentIdx = 0;
    }

    const postUpResponse = await commentService.createComment(webtoonIdx, episodeIdx, userIdx, content, parentIdx);

    return res.send(postUpResponse);
};


/*
    API No.
    API Name : 댓글 삭제 API
    [PATCH] /app/comments/{commentIdx}
*/
exports.patchComment = async function(req, res) {
    // Path Variable : commentIdx
    const commentIdx = req.params.commentIdx;

    if (!commentIdx) {
        return res.send(response(baseResponse.COMMENT_COMMENTIDX_EMPTY));
    }

    // 존재하는 comment인지 확인
    const commentByIdx = await commentProvider.retrieveCommentByIdx(commentIdx);
    if (commentByIdx.isSuccess == false) {
        return res.send(commentByIdx);
    }

    const userIdx = commentByIdx[0].userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const editComment = await commentService.editComment(commentIdx);
    return res.send(editComment);
};


/*
    API No.
    API Name : 댓글 좋아요 등록/취소 API
    [POST] /app/comments/like
*/

exports.postLikes = async function(req, res) {
    /*
        Body : articleIdx, userIdx
    */
    const { userIdx, webtoonIdx, episodeIdx, commentIdx, likeState } = req.body;

    if (!userIdx) {
        return res.send(response(baseResponse.COMMENT_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.COMMENT_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.COMMENT_EPISODEIDX_EMPTY));
    } else if (!commentIdx) {
        return res.send(response(baseResponse.COMMENT_COMMENTIDX_EMPTY));
    } else if (!likeState) {
        return res.send(response(baseResponse.COMMENT_LIKESTATE_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const likeByUserIdx = await commentProvider.retrieveLikes(userIdx, webtoonIdx, episodeIdx, commentIdx, likeState);
    // 좋아요 상태 가져옴

    console.log(likeByUserIdx)

    if (likeByUserIdx.length > 0) {
        // 좋아요가 이미 존재
        if (likeByUserIdx[0].status == "D") {
            // 삭제된 좋아요 다시 누르기
            const activateLikes = await commentService.updateLikeStatus(userIdx, webtoonIdx, episodeIdx, commentIdx, likeState, likeByUserIdx[0].status);
            return res.send(activateLikes);
        } else {
            // 좋아요 취소
            const deleteLikes = await commentService.updateLikeStatus(userIdx, webtoonIdx, episodeIdx, commentIdx, likeState, likeByUserIdx[0].status);
            return res.send(deleteLikes);
        }
    } else {
        // 새로 좋아요 생성
        const insertLikeResponse = await commentService.insertLike(userIdx, webtoonIdx, episodeIdx, commentIdx, likeState);
        return res.send(insertLikeResponse);
    }
}


/*
 * API No. 18
 * API Name : 댓글 신고 API
 * [POST] /app/comments/report
 */
exports.postReport = async function (req, res) {
    /**
     * Body: userIdx, webtoonIdx, episodeIdx, commentIdx, reason
     */
    const {userIdx, webtoonIdx, episodeIdx, commentIdx, reason} = req.body;

    if (!userIdx) {
        return res.send(response(baseResponse.COMMENT_USERIDX_EMPTY));
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.COMMENT_WEBTOONIDX_EMPTY));
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.COMMENT_EPISODEIDX_EMPTY));
    } else if (!commentIdx) {
        return res.send(response(baseResponse.COMMENT_COMMENTIDX_EMPTY));
    } else if (!reason) {
        return res.send(response(baseResponse.COMMENT_REASON_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const postReportResponse = await commentService.createReport(
        userIdx, webtoonIdx, episodeIdx, commentIdx, reason
    );

    return res.send(postReportResponse);
};



/*
 * API No.
 * API Name : 댓글 조회 API
 * [GET] /app/comments
 */
/*
exports.getComments = async function (req, res) {
    // 유저 검색 조회
    const commentListByParent = await commentProvider.retrieveCommentList();
    return res.send(response(baseResponse.SUCCESS, commentListByParent));
};
*/


/*
 * API No. 
 * API Name : 댓글 좋아요 등록/취소 API
 * [PATCH] /app/comments/like
 */
/*
exports.patchLike = async function (req, res) {
    const {userIdx, webtoonIdx, episodeIdx, commentIdx, likeState} = req.body;

    if (!userIdx) {
        return res.send(response(baseResponse.IS_EMPTY)); //로그인 하신 후 이용해주시길 바랍니다.
    } else if (!webtoonIdx) {
        return res.send(response(baseResponse.IS_EMPTY)); //존재하지 않는 웹툰입니다.
    } else if (!episodeIdx) {
        return res.send(response(baseResponse.IS_EMPTY)); //존재하지 않는 웹툰입니다.
    } else if (!commentIdx) {
        return res.send(response(baseResponse.IS_EMPTY)); //존재하지 않는 댓글입니다.
    } else if (!likeState) {
        return res.send(response(baseResponse.IS_EMPTY)); //빈 값을 넣었습니다.
    }

    // get LikeState
    // 존재하는 like인지 확인 //존재한다면 좋아요 누르기, 존재하지 않는다면 좋아요 취소
    const likeStateResult = await commentProvider.retrieveLikeByIdx(userIdx, webtoonIdx, episodeIdx, commentIdx);

    if (!likeStateResult[0]) {
        const postLikeResponse = await commentService.createLike(
            userIdx, webtoonIdx, episodeIdx, commentIdx, likeState
        );
        return res.send(postLikeResponse);
        //좋아요/싫어요 생성
    }
    if (likeState == 'U' && likeStateResult[0] == 'U') {
        const editLike = await commentService.editLike(commentIdx);
        return res.send(editLike);
        //좋아요 취소
    }
    if (likeState == 'U' && likeStateResult[0] == 'L') {
        return res.send(response(baseResponse.IS_EMPTY)); //이미 '좋아요'를 누르셨습니다.
    }
    if (likeState == 'U' && likeStateResult[0] == 'U') {
        const editLike = await commentService.editComment(commentIdx);
        return res.send(editLike);
        //싫어요 취소
    }
    if (likeState == 'L' && likeStateResult[0] == 'U') {
        return res.send(response(baseResponse.IS_EMPTY)); //이미 '싫어요'를 누르셨습니다.
    }
};
*/