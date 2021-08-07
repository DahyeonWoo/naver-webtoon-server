module.exports = function(app){
    const comment = require('./commentController');
    const jwtMiddleware = require("../../../config/jwtMiddleware");

    // 댓글 생성 API
    app.post('/app/comments', jwtMiddleware, comment.postComments);

    // 댓글 삭제 API
    app.patch('/app/comments/:commentIdx', jwtMiddleware, comment.patchComment);

    // 댓글 좋아요 등록/취소 API
    app.post('/app/comments/like', jwtMiddleware, comment.postLikes);

    // 댓글 신고 API
    app.post('/app/comments/report', jwtMiddleware, comment.postReport);

    /*
     // 댓글 조회 API
     app.get('/app/comments', jwtMiddleware, comment.getComments);
     */
};