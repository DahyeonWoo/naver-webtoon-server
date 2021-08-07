// 웹툰 생성
async function insertwebtoon(connection, insertwebtoonParmas) {
    const insertwebtoonQuery = `
                INSERT INTO Webtoon(title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                `;
    const insertwebtoonRow = await connection.query(insertwebtoonQuery, insertwebtoonParmas);

    return insertwebtoonRow;
};

// 에피소드 생성
async function insertepisode(connection, insertepisodeParmas) {
    const insertepisodeQuery = `
                INSERT INTO Episode(episodeIdx, webtoonIdx, title, thumbnailUrl, contentUrl, words, isBGM)
                VALUES (?, ?, ?, ?, ?, ?, ?);
                `;
    const insertepisodeRow = await connection.query(insertepisodeQuery, insertepisodeParmas);

    return insertepisodeRow;
};

// 연재요일 등록
async function insertserialday(connection, insertserialdayParmas) {
    const insertserialdayQuery = `
                INSERT INTO SerialDay(serialdayIdx, webtoonIdx)
                VALUES (?, ?);
                `;
    const insertserialdayRow = await connection.query(insertserialdayQuery, insertserialdayParmas);

    return insertserialdayRow;
};

// 배너 생성
async function insertbanner(connection, insertbannerParmas) {
    const insertwebtoonQuery = `
                INSERT INTO Banner(thumbnailUrl, webtoonIdx, linkUrl)
                VALUES (?, ?, ?);
                `;
    const insertbannerRow = await connection.query(insertwebtoonQuery, insertbannerParmas);

    return insertbannerRow;
};


// 웹툰 전체 조회
async function selectwebtoons(connection) {
    const selectWebtoonListQuery = `
        SELECT
            Webtoon.webtoonIdx,
            Webtoon.thumbnailUrl,
            Webtoon.title,
            artist,
            ROUND(AVG(star),2) AS star,
            CASE WHEN TIMESTAMPDIFF(DAY,max(Episode.updatedAt),current_timestamp())<1
                    THEN 'Y'
                    else 'N'
                end AS up,
            CASE WHEN TIMESTAMPDIFF(MONTH,min(Episode.updatedAt),current_timestamp())<1
                     THEN 'Y'
                     else 'N'
                end AS new,
            viewType,
            adult,
            rest,
            isFree
        FROM Webtoon
                 LEFT JOIN Star ON Webtoon.webtoonIdx = Star.webtoonIdx
                 LEFT JOIN Episode ON Webtoon.webtoonIdx = Episode.webtoonIdx
                 LEFT JOIN SerialDay ON Webtoon.webtoonIdx = SerialDay.webtoonIdx
        WHERE Webtoon.status != 'D'`;

    /*
    selectwebtoonsQuery += `
        group by Webtoon.serialdayIdx
    `;

    if (order == 1) { // 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 2) { //여성 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 3) { //남성 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 4) { //조회순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 5) { //업데이트순
        selectwebtoonsQuery += `ORDER BY Webtoon.updatedAt DESC`
    }  else if (order == 6) { //별점순
        selectwebtoonsQuery += `ORDER BY Webtoon.StarCount DESC`
    }
     */

    const [selectwebtoonRows] = await connection.query(selectWebtoonListQuery);

    return selectwebtoonRows;
};

//웹툰 상세페이지 조회
async function selectwebtoonIdx(connection, userIdx, webtoonIdx) {
    const selectWebtoonIdxQuery = `
        SELECT
            Webtoon.profileUrl,
            Webtoon.color,
            Webtoon.title,
            Webtoon.artist,
            Webtoon.serialdayIdx,
            Webtoon.summary,
            Webtoon.categoryIdx,
            Webtoon.agelimit,
            CASE 
                WHEN Interest.userIdx = ${userIdx} and Interest.webtoonIdx = Webtoon.webtoonIdx and Interest.status != 'D'
                     THEN 'Y'
                     else 'N'
                end AS isInterested,
            CASE
                WHEN Interest.notice IS NOT NULL
                    THEN Interest.notice
                end AS notice,
            Episode.episodeIdx,
            Episode.thumbnailUrl,
            Episode.title,
            CASE 
                WHEN TIMESTAMPDIFF(DAY,Episode.updatedAt,current_timestamp())<1
                     THEN 'Y'
                     else 'N'
                end AS up,
            ROUND(AVG(Star.star),2),
            DATE_FORMAT(Episode.updatedAt, '%y.%m.%d') AS updatedDate,
            Episode.isBGM,
            CASE
                WHEN Storage.userIdx = ${userIdx} and Storage.webtoonIdx = Webtoon.webtoonIdx and Storage.episodeIdx = Episode.episodeIdx and Storage.status != 'D'
                    THEN 'Y'
                    else 'N'
                end AS isSaved,
            CASE
                WHEN History.userIdx = ${userIdx} and History.webtoonIdx = Webtoon.webtoonIdx and History.episodeIdx = Episode.episodeIdx and History.status != 'D'
                     THEN 'Y'
                     ELSE 'N'
                end AS isSaw
        FROM Webtoon
                 INNER JOIN Episode ON Webtoon.webtoonIdx = Episode.webtoonIdx
                 LEFT OUTER JOIN Star ON Episode.episodeIdx = Star.episodeIdx
                 LEFT OUTER JOIN History ON Episode.episodeIdx = History.episodeIdx
                 LEFT OUTER JOIN Storage ON Episode.episodeIdx = Storage.episodeIdx
                 LEFT OUTER JOIN Interest ON Webtoon.webtoonIdx = Interest.webtoonIdx
                 LEFT OUTER JOIN SerialDay ON Webtoon.webtoonIdx = SerialDay.webtoonIdx
        WHERE Webtoon.webtoonIdx = ${webtoonIdx};
    `;
    const [webtoonRow] = await connection.query(selectWebtoonIdxQuery, webtoonIdx);
    return webtoonRow;
}

//특정 에피소드 조회
async function selectepisodeIdx(connection, webtoonIdx, episodeIdx, userIdx) {
    const selectEpisodeQuery = `
        SELECT
            Episode.episodeIdx,
            Episode.title,
            CASE
                WHEN hearted is null
                    THEN 0
                    ELSE hearted
            end as heartCount,
            CASE
                WHEN Heart.userIdx = ${userIdx} and Heart.webtoonIdx = Webtoon.webtoonIdx and Heart.episodeIdx = Episode.episodeIdx and Heart.status != 'D'
                    THEN 'Y'
                    ELSE 'N'
            END AS isHearted,
            CASE
                WHEN commented is null
                    THEN 0
                    ELSE commented
            END AS commentCount,
            Episode.contentUrl AS contentUrl,
            staraverage,
            Webtoon.artist,
            Episode.words,
            CASE
                WHEN Interest.userIdx = ${userIdx} and Interest.webtoonIdx = Webtoon.webtoonIdx and Interest.status != 'D'
                    THEN 'Y'
                    ELSE 'N'
            END AS isInterested,
            CASE
                WHEN Star.userIdx = ${userIdx} and Star.webtoonIdx = Webtoon.webtoonIdx and Star.episodeIdx = Episode.episodeIdx and Interest.status != 'D'
                    THEN 'Y'
                    ELSE 'N'
            END AS isStarred
        FROM Episode
                 INNER JOIN Webtoon ON Episode.webtoonIdx = Webtoon.webtoonIdx
                 LEFT OUTER JOIN Star ON Episode.episodeIdx = Star.episodeIdx
                 LEFT OUTER JOIN Heart ON Episode.episodeIdx = Heart.episodeIdx
                 LEFT OUTER JOIN Comment ON Episode.episodeIdx = Comment.episodeIdx
                 LEFT OUTER JOIN Interest ON Webtoon.webtoonIdx = Interest.webtoonIdx
                 LEFT OUTER JOIN (select episodeIdx, COUNT(episodeIdx) as hearted from Heart where status != 'D' group by episodeIdx) h
                                 on h.episodeIdx = Episode.episodeIdx
                 LEFT OUTER JOIN (select episodeIdx, COUNT(episodeIdx) as commented from Comment where status != 'D' group by episodeIdx) c
                           on c.episodeIdx = Episode.episodeIdx
                 LEFT OUTER JOIN (select episodeIdx, ROUND(AVG(star),2) as staraverage from Star group by episodeIdx) s
                           on s.episodeIdx = Episode.episodeIdx
        WHERE Webtoon.webtoonIdx = ${webtoonIdx} and Episode.episodeIdx = ${episodeIdx};
    `;
    const [episodeRows] = await connection.query(selectEpisodeQuery);
    return episodeRows;
}

//배너 조회
async function selectbannerIdx(connection) {
    const selectBannerQuery = `
        SELECT bannerIdx, thumbnailUrl, webtoonIdx, linkUrl
        FROM Banner
        ORDER BY Banner.updatedAt DESC
        LIMIT 10 
    `;
    const [bannerRows] = await connection.query(selectBannerQuery);
    return bannerRows;
}

// 수정, 웹툰 존재하는지 확인
async function selectwebtoonBywebtoonIdx(connection, webtoonIdx) {
    const selectwebtoonBywebtoonIdxQuery = `
                SELECT webtoonIdx
                FROM Webtoon
                WHERE webtoonIdx = ? and status != 'D';
                `;
    const [webtoonIdxRow] = await connection.query(selectwebtoonBywebtoonIdxQuery, webtoonIdx);

    return webtoonIdxRow;
};

// 수정, 에피소드 존재하는지 확인
async function selectepisodeByepisodeIdx(connection, episodeIdx) {
    const selectepisodeByepisodeIdxQuery = `
                SELECT webtoonIdx, episodeIdx
                FROM Episode
                WHERE episodeIdx = ? and status != 'D';
                `;
    const [episodeIdxRow] = await connection.query(selectepisodeByepisodeIdxQuery, episodeIdx);

    return episodeIdxRow;
};


async function selectSearchWord(connection, searchQuery) {
    const selectSearchWordQuery = `
                SELECT searchword
                FROM SearchWord
                WHERE searchWord = '${searchQuery}';
                `;
    const [searchWordRow] = await connection.query(selectSearchWordQuery, searchQuery);

    return searchWordRow;
};

async function insertSearchWord(connection, searchQuery) {
    const insertSearchWordQuery = `
                INSERT INTO SearchWord(searchword)
                VALUES('${searchQuery}');
                `;
    const searchWordRow = await connection.query(insertSearchWordQuery, searchQuery);

    return searchWordRow;
};

async function updateSearchWord(connection, searchQuery) {
    const updateSearchWordQuery = `
                UPDATE SearchWord
                SET count = count + 1
                WHERE searchword = '${searchQuery}';
                `;
    const updateResult = await connection.query(updateSearchWordQuery, searchQuery);

    return updateResult;
};

// 추천완결 웹툰 조회
async function selectrecommendations(connection) {
    const selectWebtoonListQuery = `
        SELECT
            CASE
                WHEN recommendation is null
                    THEN 0
                ELSE recommendation
                end as recommendationCount,
            Webtoon.webtoonIdx,
            Webtoon.thumbnailUrl,
            Webtoon.title,
            artist,
            subsummary,
            CASE
                WHEN episode is null
                    THEN 0
                ELSE episode
                end as totalEpisode,
            adult,
            isFree
        FROM Webtoon
                 LEFT JOIN Episode ON Webtoon.webtoonIdx = Episode.webtoonIdx
                 LEFT JOIN (select webtoonIdx, COUNT(episodeIdx) as episode from Episode where status != 'D' group by webtoonIdx) e
                           on e.webtoonIdx = Webtoon.webtoonIdx
                 LEFT JOIN (select webtoonIdx, COUNT(webtoonIdx) as recommendation from Webtoon where status != 'D' and isFree = 'N' group by webtoonIdx) c
                           on c.webtoonIdx = Webtoon.webtoonIdx
        WHERE Webtoon.status != 'D' and isFree = 'N'`;

    /*
    selectwebtoonsQuery += `
        group by Webtoon.serialdayIdx
    `;

    if (order == 1) { // 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 2) { //여성 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 3) { //남성 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 4) { //조회순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 5) { //업데이트순
        selectwebtoonsQuery += `ORDER BY Webtoon.updatedAt DESC`
    }  else if (order == 6) { //별점순
        selectwebtoonsQuery += `ORDER BY Webtoon.StarCount DESC`
    }
     */

    const [selectwebtoonRows] = await connection.query(selectWebtoonListQuery);

    return selectwebtoonRows;
};


// 추천완결 관심웹툰 조회
async function selectinterestedrecommendations(connection, userIdx) {
    const selectWebtoonListQuery = `
        SELECT
            CASE
                WHEN User.userNick is not null
                    THEN User.userNick
                ELSE User.userID
                end as name,
            Webtoon.webtoonIdx,
            Webtoon.thumbnailUrl,
            Webtoon.title,
            adult
        FROM Webtoon
                 LEFT JOIN User ON User.userIdx = ${userIdx}
                 INNER JOIN Interest ON Interest.webtoonIdx = Webtoon.webtoonIdx
        WHERE Webtoon.status != 'D' and isFree = 'N'`;
    const [selectwebtoonRows] = await connection.query(selectWebtoonListQuery);

    return selectwebtoonRows;
};

// 베스트도전 웹툰 생성
async function insertbestchallengewebtoon(connection, insertwebtoonParmas) {
    const insertwebtoonQuery = `
                INSERT INTO BestChallenge(title, userIdx, thumbnailUrl, summary, subsummary, categoryIdx, promotion, official, complete)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                `;
    const insertwebtoonRow = await connection.query(insertwebtoonQuery, insertwebtoonParmas);

    return insertwebtoonRow;
};

// 베스트도전 웹툰 전체 조회
async function selectbestchallengewebtoons(connection) {
    const selectWebtoonListQuery = `
        SELECT
            BestChallenge.webtoonIdx,
            BestChallenge.thumbnailUrl,
            BestChallenge.title,
            User.userID,
            subsummary,
            staraverage,
            CASE WHEN TIMESTAMPDIFF(DAY,max(BestChallenge.updatedAt),current_timestamp())<1
                     THEN DATE_FORMAT(max(BestChallenge.updatedAt), '%h:%m')
                 ELSE DATE_FORMAT(max(BestChallenge.updatedAt), '%y.%m.%d')
                END AS updatedDate,
            CASE WHEN TIMESTAMPDIFF(DAY,max(BestChallenge.updatedAt),current_timestamp())<1
                     THEN 'Y'
                 ELSE 'N'
                end AS up
        FROM BestChallenge
                 LEFT JOIN User ON BestChallenge.userIdx = User.userIdx
                 LEFT JOIN Episode ON BestChallenge.webtoonIdx = Episode.webtoonIdx # 에피소드 테이블 새로 만들어야 한다.
                 LEFT JOIN Star ON BestChallenge.webtoonIdx = Star.webtoonIdx # 별점 테이블 새로 만들어야 한다.
                 LEFT OUTER JOIN (select webtoonIdx, ROUND(AVG(star),2) as staraverage from Star group by webtoonIdx) s
                                 on s.webtoonIdx = BestChallenge.webtoonIdx
        WHERE BestChallenge.status != 'D'`;

    /*
    selectwebtoonsQuery += `
        group by Webtoon.serialdayIdx
    `;

    if (order == 1) { // 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 2) { //여성 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 3) { //남성 인기순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 4) { //조회순
        selectwebtoonsQuery += `ORDER BY Webtoon.User`
    } else if (order == 5) { //업데이트순
        selectwebtoonsQuery += `ORDER BY Webtoon.updatedAt DESC`
    }  else if (order == 6) { //별점순
        selectwebtoonsQuery += `ORDER BY Webtoon.StarCount DESC`
    }
     */

    const [selectwebtoonRows] = await connection.query(selectWebtoonListQuery);

    return selectwebtoonRows;
};


async function updatewebtoon(connection, webtoonIdx, title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree) {
    const updateWebtoonQuery = `
                UPDATE Webtoon
                SET
                    title = '${title}',
                    artist = '${artist}',
                    thumbnailUrl = '${thumbnailUrl}',
                    profileUrl = '${profileUrl}',
                    summary = '${summary}', 
                    subsummary = '${subsummary}',
                    viewType = '${viewType}',
                    color = '${color}',
                    categoryIdx = ${categoryIdx},
                    agelimit = ${agelimit},
                    adult = '${adult}',
                    rest = '${rest}',
                    complete = '${complete}', 
                    isFree = '${isFree}'
                WHERE webtoonIdx = ${webtoonIdx}
                `;
    const [editwebtoonRow] = await connection.query(updateWebtoonQuery, title, artist, thumbnailUrl, profileUrl, summary, subsummary, viewType, color, categoryIdx, agelimit, adult, rest, complete, isFree);

    return editwebtoonRow;
};

async function updatewebtoonimg(connection, thumbnailUrl, profileUrl) {
    const updatewebtoonQuery = `
                UPDATE Webtoon
                Set thumbnailUrl = ${thumbnailUrl},
                    profileUrl = ${profileUrl}
                WHERE idx = ${webtoonIdx}
                `;
    const [editwebtoonRow] = await connection.query(updatewebtoonQuery, thumbnailUrl, profileUrl);

    return editwebtoonRow;
};

async function updatewebtoonsummary(connection, summary, subsummary) {
    const updatewebtoonQuery = `
                UPDATE Webtoon
                Set summary = ${summary},
                    subsummary = ${subsummary}
                WHERE idx = ${webtoonIdx}
                `;
    const [editwebtoonRow] = await connection.query(updatewebtoonQuery, summary, subsummary);

    return editwebtoonRow;
};

async function updatewebtoonweek(connection, rest, complete, isFree) {
    const updatewebtoonQuery = `
                UPDATE Webtoon
                Set rest = ${rest},
                    complete = ${complete},
                    isFree = ${isFree}
                WHERE idx = ${webtoonIdx}
                `;
    const [editwebtoonRow] = await connection.query(updatewebtoonQuery, rest, complete, isFree);

    return editwebtoonRow;
};

async function updatewebtoonStatus(connection, webtoonIdx, status) {
    const updatewebtoonStatusQuery = `
                UPDATE webtoon
                SET status = '${status}'
                WHERE idx = ${webtoonIdx}
                `;
    const [updatewebtoonRow] = await connection.query(updatewebtoonStatusQuery, webtoonIdx, status);

    return updatewebtoonRow;
};


async function updatewebtoonHide(connection, webtoonIdx, hideOrNot) {
    const updatewebtoonHideQuery = `
                UPDATE webtoon
                SET hide = '${hideOrNot}'
                WHERE idx = ${webtoonIdx};
                `;
    const [updatewebtoonHideRow] = await connection.query(updatewebtoonHideQuery, webtoonIdx, hideOrNot);

    return updatewebtoonHideRow;
};


/*
async function selectwebtoonImg(connection, webtoonIdx) {
    const selectwebtoonImgQuery = `
                SELECT webtoonImgUrl
                FROM webtoonImg
                WHERE webtoonIdx = ?;
                `;
    const [webtoonImgRows] = await connection.query(selectwebtoonImgQuery, webtoonIdx);

    return webtoonImgRows;
};


// 검색
async function searchwebtoons(connection, searchQueryList, searchType) {
    var searchwebtoonsQuery = `
                SELECT
                    COUNT(webtoonIdx),
                    Webtoon.webtoonidx,
                    Webtoon.thumbnailUrl,
                    Webtoon.title,
                    Webtoon.artist,
                    Webtoon.viewType,
                    Webtoon.isFree,
                    Webtoon.adult,
                    Webtoon.complete
                FROM Webtoon`;

    for (searchQuery in searchQueryList) {
        if (searchQueryList.length == 1) {
            searchwebtoonsQuery += `(Webtoon.title LIKE '%${searchQueryList[searchQuery]}%')`;
        } else if (searchQuery == searchQueryList.length - 1) {
            searchwebtoonsQuery += `(Webtoon.title LIKE '%${searchQueryList[searchQuery]}%')`;
        } else {
            searchwebtoonsQuery += `(Webtoon.title LIKE '%${searchQueryList[searchQuery]}%') or`;
        }
    }

    searchwebtoonsQuery += ` group by Webtoon.webtoonidx
    ORDER BY webtoon.updatedAt DESC `;

    const [searchwebtoonRows] = await connection.query(searchwebtoonsQuery,searchQueryList, searchType);

    return searchwebtoonRows;
};

async function deleteImg(connection, webtoonIdx) {
    const deleteImgQuery = `
                DELETE FROM webtoonImg
                WHERE webtoonIdx = ?;
                `;
    const [deleteImgRow] = await connection.query(deleteImgQuery, webtoonIdx);

    return deleteImgRow;
};

// 웹툰 이미지 생성
async function insertwebtoonImg(connection, insertwebtoonImgParams) {
    const insertwebtoonImgQuery = `
                INSERT INTO webtoonImg(webtoonIdx, webtoonImgUrl)
                VALUES (?, ?);
                `;
    const insertwebtoonImgRow = await connection.query(insertwebtoonImgQuery, insertwebtoonImgParams);

    return insertwebtoonImgRow;
};

async function addView(connection, webtoonIdx) {
    const addViewQuery = `
                UPDATE webtoon SET viewed = viewed + 1
                WHERE idx = ?
                `;
    const [addViewRow] = await connection.query(addViewQuery, webtoonIdx);

    return addViewRow;
};
 */

module.exports = {
    insertwebtoon,
    insertepisode,
    insertserialday,
    insertbanner,
    selectwebtoons,
    selectwebtoonIdx,
    selectepisodeIdx,
    selectbannerIdx,
    selectwebtoonBywebtoonIdx, // 존재 확인
    selectepisodeByepisodeIdx, // 존재 확인
    selectrecommendations,
    selectinterestedrecommendations,
    updatewebtoon,
    insertbestchallengewebtoon,
    selectbestchallengewebtoons

    //searchwebtoons,
    //selectSearchWord,
    //insertSearchWord,
    //updateSearchWord

};