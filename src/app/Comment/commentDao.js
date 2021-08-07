// 수정, parentidx 존재 확인
async function selectParentIdx(connection, parentIdx) {
    const selectParentCommentQuery = `
                SELECT userIdx, commnetIdx
                FROM Comment
                WHERE commentIdx = ? and status != 'D';
                `;
    const [parentCommentRow] = await connection.query(selectParentCommentQuery, parentIdx);

    return parentCommentRow;
};

// 웹툰 생성
async function insertComment(connection, insertCommentParams) {
    const insertCommentQuery = `
        INSERT INTO Comment(webtoonIdx, episodeIdx, userIdx, content, parentIdx)
        VALUES (?, ?, ?, ?, ?);
    `;
    const insertCommentRow = await connection.query(
        insertCommentQuery,
        insertCommentParams
    );

    return insertCommentRow;
}

// 댓글 수정, 상태 확인
async function selectCommentByIdx(connection, commentIdx) {
    const selectCommentByIdxQuery = `
                SELECT userIdx,
                    content,
                    status
                FROM Comment
                WHERE commentIdx = ?;
                `;
    const [commentRow] = await connection.query(selectCommentByIdxQuery, commentIdx);

    return commentRow;
};

// 댓글 수정
async function updateComment(connection, commentIdx) {
    const updateCommentQuery = `
                UPDATE Comment
                SET status = 'D'
                WHERE commentIdx = ${commentIdx};
                `;
    const updateCommentRow = await connection.query(updateCommentQuery, commentIdx);

    return updateCommentRow[0];
};

// 댓글 좋아요, 좋아요 가져오기
async function selectLikes(connection, userIdx, webtoonIdx, episodeIdx, commentIdx, likeState) {
    const selectLikesQuery = `
                SELECT status, likeState
                FROM CommentLike
                WHERE userIdx = ${userIdx} and webtoonIdx = ${webtoonIdx}
                  and episodeIdx = ${episodeIdx} and commentIdx = ${commentIdx};
                `;
    const [likesRow] = await connection.query(selectLikesQuery, userIdx, webtoonIdx, episodeIdx, commentIdx, likeState);

    return likesRow;
};

// 수정, 댓글 존재하는지 확인
async function selectcommentBycommentIdx(connection, commentIdx) {
    const selectcommentBycommentIdxQuery = `
                SELECT commentIdx, userIdx
                FROM Comment
                WHERE commentIdx = ? and status != 'D';
                `;
    const [commentIdxRow] = await connection.query(selectcommentBycommentIdxQuery, commentIdx);

    return commentIdxRow;
};

// like state update
async function updateLikes(connection, userIdx, webtoonIdx, episodeIdx, likeState, status) {
    const updateLikesQuery = `
                UPDATE CommentLike
                SET status = '${status}'
                WHERE userIdx = ${userIdx} and webtoonIdx = ${webtoonIdx} and episodeIdx = ${episodeIdx};
                `;
    const [updatelikeRow] = await connection.query(updateLikesQuery, articleIdx, userIdx, status);

    return updatelikeRow;
};

// 좋아요 생성
async function insertLike(connection, insertLikeParams) {
    const insertLikeQuery = `
        INSERT INTO CommentLike(userIdx, webtoonIdx, episodeIdx, likeState)
        VALUES (?, ?, ?, ?);
    `;
    const insertLikeRow = await connection.query(
        insertLikeQuery,
        insertLikeParams
    );

    return insertLikeRow;
}

// 댓글 신고 생성
async function insertReport(connection, insertReportParams) {
    const insertReportQuery = `
        INSERT INTO CommentReport(userIdx, webtoonIdx, episodeIdx, commentIdx, reason)
        VALUES (?, ?, ?, ?, ?);
    `;
    const insertReportRow = await connection.query(
        insertReportQuery,
        insertReportParams
    );

        return insertReportRow;
    }

// 특정 에피소드 댓글 조회
async function selectComments(connection, webtoonIdx, episodeIdx) {
    const selectCommentsQuery = `
            SELECT
                   CASE
                       WHEN commented is null
                           THEN 0
                       ELSE commented
                       END AS commentCount,
                   case
                       when User.userNick IS NOT NULL
                           then User.userNick
                       else User.userID
                       end as name,
                   DATE_FORMAT(Comment.createdAt, '%Y-%m-%d %h:%i') AS updatedDate,
                   case
                       when Comment.status = 'D'
                           then '삭제된 댓글입니다.'
                       else Comment.content
                       end as content,
                   CASE
                       WHEN liked is null
                           THEN 0
                       ELSE liked
                       END AS upCount,
                   CASE
                       WHEN unliked is null
                           THEN 0
                       ELSE unliked
                       END AS downCount,
                   CASE
                       WHEN CommentLike.userIdx = User.userIdx and CommentLike.webtoonIdx = Webtoon.webtoonIdx and CommentLike.episodeIdx = Episode.episodeIdx
                           and CommentLike.likeState = 'L' and CommentLike.status != 'D'
                           THEN 'Y'
                       ELSE 'N'
                       END AS isLikeed,
                   CASE
                       WHEN CommentLike.userIdx = User.userIdx and CommentLike.webtoonIdx = Webtoon.webtoonIdx and CommentLike.episodeIdx = Episode.episodeIdx
                           and CommentLike.likeState = 'U' and CommentLike.status != 'D'
                           THEN 'Y'
                       ELSE 'N'
                       END AS isUnlikeed,
                   CASE
                       when Comment.userIdx = User.userIdx
                           then '작성자'
                       else 'N'
                       END AS isUsers
            FROM Comment
                     LEFT OUTER JOIN User ON User.userIdx = Comment.userIdx
                     LEFT OUTER JOIN CommentLike ON Comment.commentIdx = CommentLike.commentIdx
                     LEFT OUTER JOIN Webtoon ON Comment.webtoonIdx = Webtoon.webtoonIdx
                     LEFT OUTER JOIN Episode ON Comment.episodeIdx = Episode.episodeIdx
                     LEFT OUTER JOIN (select episodeIdx, COUNT(episodeIdx) as commented from Comment where status != 'D' group by episodeIdx) c
                                     on c.episodeIdx = Episode.episodeIdx
                     LEFT OUTER JOIN (select episodeIdx, COUNT(episodeIdx) as liked from CommentLike where status != 'D' and likeState = 'L' group by episodeIdx) l
                                     on l.episodeIdx = Episode.episodeIdx
                     LEFT OUTER JOIN (select episodeIdx, COUNT(episodeIdx) as unliked from CommentLike where status != 'D' and likeState = 'U' group by episodeIdx) u
                                     on u.episodeIdx = Episode.episodeIdx
            WHERE Comment.webtoonIdx = ${webtoonIdx} and Comment.episodeIdx = ${episodeIdx}
            ORDER BY Comment.createdAt;
                `;
    const [commentsRow] = await connection.query(selectCommentsQuery, webtoonIdx, episodeIdx);

    return commentsRow;
};


// 특정 에피소드 베스트댓글 조회
async function selectBestComments(connection, webtoonIdx, episodeIdx) {
    const selectBestCommentsQuery = `
            SELECT
                   CASE
                       WHEN commented is null
                           THEN 0
                       ELSE commented
                       END AS commentCount,
                   case
                       when User.userNick IS NOT NULL
                           then User.userNick
                       else User.userID
                       end as name,
                   DATE_FORMAT(Comment.createdAt, '%Y-%m-%d %h:%i') AS updatedDate,
                   case
                       when Comment.status = 'D'
                           then '삭제된 댓글입니다.'
                       else Comment.content
                       end as content,
                   CASE
                       WHEN liked is null
                           THEN 0
                       ELSE liked
                       END AS upCount,
                   CASE
                       WHEN unliked is null
                           THEN 0
                       ELSE unliked
                       END AS downCount,
                   CASE
                       WHEN CommentLike.userIdx = User.userIdx and CommentLike.webtoonIdx = Webtoon.webtoonIdx and CommentLike.episodeIdx = Episode.episodeIdx
                           and CommentLike.likeState = 'L' and CommentLike.status != 'D'
                           THEN 'Y'
                       ELSE 'N'
                       END AS isLikeed,
                   CASE
                       WHEN CommentLike.userIdx = User.userIdx and CommentLike.webtoonIdx = Webtoon.webtoonIdx and CommentLike.episodeIdx = Episode.episodeIdx
                           and CommentLike.likeState = 'U' and CommentLike.status != 'D'
                           THEN 'Y'
                       ELSE 'N'
                       END AS isUnlikeed,
                   CASE
                       when Comment.userIdx = User.userIdx
                           then '작성자'
                       else 'N'
                       END AS isUsers
            FROM Comment
                     LEFT OUTER JOIN User ON User.userIdx = Comment.userIdx
                     LEFT OUTER JOIN CommentLike ON Comment.commentIdx = CommentLike.commentIdx
                     LEFT OUTER JOIN Webtoon ON Comment.webtoonIdx = Webtoon.webtoonIdx
                     LEFT OUTER JOIN Episode ON Comment.episodeIdx = Episode.episodeIdx
                     LEFT OUTER JOIN (select episodeIdx, COUNT(episodeIdx) as commented from Comment where status != 'D' group by episodeIdx) c
                                     on c.episodeIdx = Episode.episodeIdx
                     LEFT OUTER JOIN (select episodeIdx, COUNT(episodeIdx) as liked from CommentLike where status != 'D' and likeState = 'L' group by episodeIdx) l
                                     on l.episodeIdx = Episode.episodeIdx
                     LEFT OUTER JOIN (select episodeIdx, COUNT(episodeIdx) as unliked from CommentLike where status != 'D' and likeState = 'U' group by episodeIdx) u
                                     on u.episodeIdx = Episode.episodeIdx
            WHERE Comment.webtoonIdx = ${webtoonIdx} and Comment.episodeIdx = ${episodeIdx}
            ORDER BY liked
            LIMIT 1;
                `;
    const [commentsRow] = await connection.query(selectBestCommentsQuery, webtoonIdx, episodeIdx);

    return commentsRow;
};

/*
//좋아요 상태 찾기
async function selectLikeByIdx(connection, userIdx, webtoonIdx, episodeIdx, commentIdx) {
    const selectLikeByIdxQuery = `
                SELECT likeState
                FROM CommentLike
                WHERE userIdx=${userIdx} AND webtoonIdx=${webtoonIdx} 
                AND episodeIdx=${episodeIdx} AND commentIdx=${commentIdx};
                `;
    const [likeRow] = await connection.query(selectLikeByIdxQuery, userIdx, webtoonIdx, episodeIdx, commentIdx);

    return likeRow;
};

//좋아요 취소
async function updateLike(connection, userIdx, webtoonIdx, episodeIdx, commentIdx) {
    const updateLikeQuery = `
                UPDATE CommentLike
                SET status = 'N'
                WHERE userIdx = ${userIdx} AND webtoonIdx = ${webtoonIdx} 
                AND episodeIdx = ${episodeIdx} AND commentIdx = ${commentIdx}
                `;
    const updateLikeRow = await connection.query(updateLikeQuery, userIdx, webtoonIdx, episodeIdx, commentIdx);

    return updateLikeRow[0];
};

//좋아요 다시 누르기
async function updateunLike(connection, userIdx, webtoonIdx, episodeIdx, commentIdx) {
    const updateunLikeQuery = `
                UPDATE CommentLike
                SET status = 'Y'
                WHERE userIdx = ${userIdx} AND webtoonIdx = ${webtoonIdx} 
                AND episodeIdx = ${episodeIdx} AND commentIdx = ${commentIdx}
                `;
    const updateunLikeRow = await connection.query(updateunLikeQuery, userIdx, webtoonIdx, episodeIdx, commentIdx);

    return updateunLikeRow[0];
};


// 모든 댓글 조회 (R)
async function selectComment(connection) {
    const selectCommentListQuery = `
        SELECT
            # WHEN C.status IS NOT 'D'
            COUNT(C.commentIdx) AS commentCount,
            CASE WHEN U.userNick IS NOT NULL
                     THEN U.userNick
                 ELSE U.userID
                end AS name,
            DATE_FORMAT(C.createdAt, '%Y-%m-%d %h:%i') AS updatedDate,
            C.content,
            CASE WHEN CL.likeState = 'L'
                     THEN +1
                end AS upCount,
            CASE WHEN CL.likeState = 'U'
                     THEN +1
                end AS downCount,
            CASE WHEN C.userIdx IS NOT NULL
                     THEN 'Y'
                 ELSE 'N'
                end AS upDownStatus,
            CASE WHEN C.userIdx IS NOT NULL
                     THEN 'Y'
                 ELSE 'N'
                end AS isUsers
        FROM Comment AS C
                 JOIN User U
                      ON U.userIdx = C.userIdx
                 INNER JOIN CommentLike CL
                            ON C.commentIdx = CL.commentIdx
    `;
    const [commentRows] = await connection.query(selectCommentListQuery);
    return commentRows;
}
 */


module.exports = {
    selectParentIdx,
    insertComment,
    selectCommentByIdx,
    updateComment,
    selectLikes,
    selectcommentBycommentIdx,
    updateLikes,
    insertLike,
    insertReport,
    selectComments,
    selectBestComments
};
