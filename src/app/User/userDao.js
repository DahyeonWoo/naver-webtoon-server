// 회원가입, 유저 생성
async function insertUser(connection, insertUserParams) {
    const insertUserQuery = `
        INSERT INTO User(userID, userPW, userName, birthday, gender, email, mobileNo)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const insertUserRow = await connection.query(
        insertUserQuery,
        insertUserParams
    );

    return insertUserRow;
}

// 로그인, 아이디로 회원 조회
async function selectUserID(connection, userID) {
    const selectUserIDQuery = `
                SELECT userID, userIdx
                FROM User
                WHERE userID = ?;
                `;
    const [userIDRows] = await connection.query(selectUserIDQuery, userID);
    return userIDRows;
};

// 로그인, 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
                SELECT userPW, userIdx
                FROM User
                WHERE userID = ?;
                `;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams
    );
    return selectUserPasswordRow;
};

// 로그인, 유저 계정 상태 체크
async function selectUserAccount(connection, userID) {
    const selectUserAccountQuery = `
                SELECT status, userIdx
                FROM User
                WHERE userID = ?;
                `;
    const selectUserAccountRow = await connection.query(selectUserAccountQuery, userID);

    return selectUserAccountRow[0];
};

// 로그인, jwt 가져오기
async function selectJWT(connection, userIdx) {
    const selectJWTQuery = `
                SELECT jwt, userIdx
                FROM Token
                WHERE userIdx = ?;
                `;
    const [selectJWTRow] = await connection.query(selectJWTQuery, userIdx);

    return selectJWTRow;
};

// 로그인 (토큰 넣기)
async function insertToken(connection, userIdx, token) {
    const insertTokenQuery = `
                INSERT INTO Token(userIdx, jwt)
                VALUES(${userIdx}, '${token}');
                `;
    const insertTokenRow = await connection.query(insertTokenQuery, userIdx, token);

    return insertTokenRow;
};

// 로그아웃 (jwt 삭제)
async function deleteJWT(connection, userIdx) {
    const deleteJWTQuery = `
                DELETE FROM Token
                WHERE userIdx = ?;
                `;
    const deleteJWTRow = await connection.query(deleteJWTQuery, userIdx);

    return deleteJWTRow;
};

// 탈퇴
async function withDrawUser(connection, userIdx) {
    const withDrawUserQuery = `
                UPDATE User
                SET status = 'D'
                WHERE userIdx = ?;
                `;
    const withDrawUserRow = await connection.query(withDrawUserQuery, userIdx);

    return withDrawUserRow;
};

// 유저 정보 조회
async function selectUserByIdx(connection, userIdx) {
    const selectUserByIdxQuery = `
                SELECT userName,
                    mobileNo,
                    userID,
                    email
                FROM User
                WHERE userIdx = ?;
                `;
    const [userIdxRow] = await connection.query(selectUserByIdxQuery, userIdx);

    return userIdxRow;
};

// 유저 정보 수정, 전화번호로 회원 조회, 중복 확인
async function selectUserPhoneNumber(connection, mobileNo) {
    const selectUserPhoneNumberQuery = `
                SELECT mobileNo, userIdx
                FROM User
                WHERE mobileNo = ?;
                `;
    const [phoneNumberRows] = await connection.query(selectUserPhoneNumberQuery, mobileNo);
    return phoneNumberRows;
};

// 유저 정보 수정
async function updateUserPhoneNumber(connection, updateParams) {
    const updateUserAccountQuery = `
                UPDATE User
                SET mobileNo = ?
                WHERE userIdx = ?;
                `;

    const updateAccountRow = await connection.query(updateUserAccountQuery, updateParams);

    return updateAccountRow;
};

// 유저 정보 수정
async function updateUserEmail(connection, updateParams) {
    const updateUserAccountQuery = `
                UPDATE User
                SET email = ?
                WHERE userIdx = ?;
                `;

    const updateAccountRow = await connection.query(updateUserAccountQuery, updateParams);

    return updateAccountRow;
};

// 유저 프로필 조회
async function selectUserProfile(connection, userIdx) {
    const selectUserProfileQuery = `
                SELECT profileUrl,
                    userNick
                FROM User
                WHERE userIdx = ?;
                `;
    const [userProfileRow] = await connection.query(selectUserProfileQuery, userIdx);

    return userProfileRow;
};

// 유저 프로필 수정, 닉네임으로 회원조회
async function selectUserNickName(connection, userNick) {
    const selectUserNickNameQuery = `
                SELECT userNick
                FROM User
                WHERE userNick = ?;
                `;
    const [nickNameRows] = await connection.query(selectUserNickNameQuery, userNick);
    return nickNameRows;
};

// 유저 프로필 수정
async function updateProfile(connection, userIdx, profileUrl, userNick) {
    const updateProfile = `
                UPDATE User
                SET profileUrl = '${profileUrl}',
                    userNick = '${userNick}'
                WHERE userIdx = ${userIdx};
                `;
    const updateProfileRow = await connection.query(updateProfile, userIdx, profileUrl, userNick);

    return updateProfileRow;
};

// 관심 등록
async function selectInterests(connection, webtoonIdx, userIdx) {
    const selectInterestsQuery = `
                SELECT status
                FROM Interest
                WHERE webtoonIdx = ${webtoonIdx} and userIdx = ${userIdx};
                `;
    const [interestsRow] = await connection.query(selectInterestsQuery, webtoonIdx, userIdx);

    return interestsRow;
};

async function updateInterests(connection, webtoonIdx, userIdx, status) {
    const updateInterestsQuery = `
                UPDATE Interest
                SET status = '${status}'
                WHERE webtoonIdx = ${webtoonIdx} and userIdx = ${userIdx};
                `;
    const [updateInterestRow] = await connection.query(updateInterestsQuery, webtoonIdx, userIdx, status);

    return updateInterestRow;
};

async function insertInterest(connection, insertInterestParams) {
    const insertInterestQuery = `
                INSERT INTO Interest(webtoonIdx, userIdx)
                VALUES (?, ?);
                `;
    const insertInterestRow = await connection.query(insertInterestQuery, insertInterestParams);

    return insertInterestRow;
};

// 알림 등록
async function selectNotices(connection, webtoonIdx, userIdx) {
    const selectInterestsQuery = `
                SELECT notice, status
                FROM Interest
                WHERE webtoonIdx = ${webtoonIdx} and userIdx = ${userIdx};
                `;
    const [interestsRow] = await connection.query(selectInterestsQuery, webtoonIdx, userIdx);

    return interestsRow;
};

async function updateNotices(connection, webtoonIdx, userIdx, notice) {
    const updateInterestsQuery = `
                UPDATE Interest
                SET notice = '${notice}'
                WHERE webtoonIdx = ${webtoonIdx} and userIdx = ${userIdx};
                `;
    const [updateInterestRow] = await connection.query(updateInterestsQuery, webtoonIdx, userIdx, notice);

    return updateInterestRow;
};

// 관심 웹툰 조회
async function selectInterestsByUserIdx(connection, userIdx) {
    const selectInterestsByUserIdxQuery = `
                SELECT
                CASE
                    WHEN Interested is null
                        THEN 0
                        ELSE Interested
                    end as interestCount,
                Webtoon.webtoonIdx, 
                Webtoon.title,
                Webtoon.thumbnailUrl,
               CASE
                   WHEN TIMESTAMPDIFF(DAY,max(Episode.updatedAt),current_timestamp())<1
                       THEN 'Y'
                       else 'N'
                   end AS UP,
                DATE_FORMAT(max(Episode.updatedAt), '%y.%m.%d') AS updatedDate,
                Interest.notice as isNotice
                FROM Webtoon
                    left join Interest on Webtoon.webtoonIdx = Interest.webtoonIdx
                    left join Episode on Webtoon.webtoonIdx = Episode.episodeIdx
                    left join (select webtoonIdx, COUNT(webtoonIdx) as Interested from Interest where status != 'D' and userIdx = ${userIdx} group by webtoonIdx) I
                                    on I.webtoonIdx = Webtoon.webtoonIdx
                WHERE Webtoon.status != 'D' and Interest.status != 'D'
                group by Webtoon.webtoonIdx
                ORDER BY Interest.updatedAt DESC;
                `;
    const [InterestByUserIdxRow] = await connection.query(selectInterestsByUserIdxQuery, userIdx);

    return InterestByUserIdxRow;
};

// 기록 생성
async function insertLook(connection, insertLookParmas) {
    const insertlookQuery = `
                INSERT INTO History(userIdx, webtoonIdx, episodeIdx)
                VALUES (?, ?, ?);
                `;
    const insertlookRow = await connection.query(insertlookQuery, insertLookParmas);

    return insertlookRow;
};

// 최근 본 웹툰 조회
async function selectHistoryByUserIdx(connection, userIdx) {
    const selectHistoryByUserIdxQuery = `
            SELECT
                CASE
                    when history is null
                        then 0
                    else history
                    end as historyCount,
                Webtoon.webtoonIdx,
                Webtoon.title,
                Webtoon.thumbnailUrl,
                case
                    when timestampdiff(day, History.updatedAt, current_timestamp) >= 1
                        then concat(timestampdiff(day, History.updatedAt, current_timestamp), '일 전')
                        else '오늘'
                    end as lastDate,
                case
                    when episode is null
                        then 0
                    else episode
                    end as viewPoint,
                case
                    when TIMESTAMPDIFF(DAY,Webtoon.createdAt,current_timestamp())<14
                        then 'Y'
                        else 'N'
                    end as new,
                case
                    when TIMESTAMPDIFF(DAY,max(Episode.updatedAt),current_timestamp())<1
                        then 'Y'
                        else 'N'
                    end as up,
                Webtoon.viewType,
                Webtoon.complete as isFinished,
                Webtoon.isFree as isFree
            FROM Webtoon
                     left join History on Webtoon.webtoonIdx = History.webtoonIdx
                     left join Episode on Webtoon.webtoonIdx = Episode.webtoonIdx
                     left join (select webtoonIdx, max(episodeIdx) as episode from Episode where status != 'D' and updatedAt group by webtoonIdx) as e
                               on e.webtoonIdx = Webtoon.webtoonIdx
                     left join (select webtoonIdx, COUNT(webtoonIdx) as history from History where status != 'D' and userIdx = ${userIdx} group by webtoonIdx) as h
                               on h.webtoonIdx = Webtoon.webtoonIdx
            WHERE Webtoon.status != 'D' and Episode.status != 'D' and History.status != 'D'
            group by Webtoon.webtoonIdx
            ORDER BY History.updatedAt DESC;
                `;
    const [HistoryByUserIdxRow] = await connection.query(selectHistoryByUserIdxQuery, userIdx);

    return HistoryByUserIdxRow;
};

// 임시저장 생성
async function insertStorage(connection, insertStorageParmas) {
    const insertstorageQuery = `
                INSERT INTO Storage(userIdx, webtoonIdx, episodeIdx)
                VALUES (?, ?, ?);
                `;
    const insertstorageRow = await connection.query(insertstorageQuery, insertStorageParmas);

    return insertstorageRow;
};


// 임시저장 조회
async function selectWebtoonsStoragesByUserIdx(connection, userIdx) {
    const selectStorageByUserIdxQuery = `
            SELECT
                CASE
                    when storage is null
                        then 0
                    else storage
                    end as storageCount,
                Webtoon.webtoonIdx,
                Webtoon.title,
                Webtoon.thumbnailUrl,
                Webtoon.artist
            FROM Webtoon
                     left join Storage on Webtoon.webtoonIdx = Storage.webtoonIdx
                     left join (select webtoonIdx, COUNT(webtoonIdx) as storage from Storage 
                                where status != 'D' and userIdx = ${userIdx} group by webtoonIdx) as s
                               on s.webtoonIdx = Webtoon.webtoonIdx
            WHERE Webtoon.status != 'D' and Storage.status != 'D'
            group by Webtoon.webtoonIdx
            ORDER BY Storage.updatedAt DESC;
                `;
    const [StorageByUserIdxRow] = await connection.query(selectStorageByUserIdxQuery, userIdx);

    return StorageByUserIdxRow;
};


// 임시저장 상세조회
async function selectEpisodesStoragesByUserIdx(connection, userIdx) {
    const selectStorageByUserIdxQuery = `
            SELECT
                CASE
                    when storage is null
                        then 0
                    else storage
                    end as storageCount,
                Episode.episodeIdx,
                Webtoon.title,
                Episode.title,
                Webtoon.thumbnailUrl,
                case
                    when timestampdiff(hour, Storage.updatedAt, current_timestamp) < 48
                        then concat('만료 ', 47 - timestampdiff(hour, Storage.updatedAt, current_timestamp), '시간' , 60 - timestampdiff(minute, Storage.updatedAt, current_timestamp), '분 남음')
                        else '저장기간만료'
                    end as expirationTime
            FROM Webtoon
                     left join Episode on Webtoon.webtoonIdx = Episode.webtoonIdx
                     left join Storage on Webtoon.webtoonIdx = Storage.webtoonIdx
                     left join (select webtoonIdx, COUNT(webtoonIdx) as storage from Storage where status != 'D' and userIdx = ${userIdx} group by webtoonIdx) as s
                               on s.webtoonIdx = Webtoon.webtoonIdx
            WHERE Webtoon.status != 'D' and Episode.status != 'D' and Storage.status != 'D'
            group by Webtoon.webtoonIdx
            ORDER BY Storage.updatedAt DESC;
                `;
    const [StorageByUserIdxRow] = await connection.query(selectStorageByUserIdxQuery, userIdx);

    return StorageByUserIdxRow;
};

// 임시저장 만료 삭제
async function updateStorage(connection, userIdx, webtoonIdx, episodeIdx) {
    const updateStorageQuery = `
                UPDATE Storage
                SET status = 'D'
                WHERE userIdx = ${userIdx} and webtoonIdx = ${webtoonIdx} and episodeIdx = ${episodeIdx};
                `;
    const updateStorageRow = await connection.query(updateStorageQuery, userIdx, webtoonIdx, episodeIdx);

    return updateStorageRow[0];
};

// 하트 등록
async function selectHearts(connection, userIdx, webtoonIdx, episodeIdx) {
    const selectHeartsQuery = `
                SELECT status
                FROM Heart
                WHERE userIdx = ${userIdx} and webtoonIdx = ${webtoonIdx} and episodeIdx = ${episodeIdx};
                `;
    const [heartsRow] = await connection.query(selectHeartsQuery, userIdx, webtoonIdx, episodeIdx);

    return heartsRow;
};

async function updateHearts(connection, userIdx, webtoonIdx, episodeIdx, status) {
    const updateHeartsQuery = `
                UPDATE Heart
                SET status = '${status}'
                WHERE userIdx = ${userIdx} and webtoonIdx = ${webtoonIdx} and episodeIdx = ${episodeIdx};
                `;
    const [updateHeartRow] = await connection.query(updateHeartsQuery, webtoonIdx, userIdx, status);

    return updateHeartRow;
};

async function insertHeart(connection, insertHeartParams) {
    const insertHeartQuery = `
                INSERT INTO Heart(userIdx, webtoonIdx, episodeIdx)
                VALUES (?, ?, ?);
                `;
    const insertHeartRow = await connection.query(insertHeartQuery, insertHeartParams);

    return insertHeartRow;
};

// 별점 생성
async function insertStar(connection, insertStarParmas) {
    const insertstarQuery = `
                INSERT INTO Star(userIdx, webtoonIdx, episodeIdx, star)
                VALUES (?, ?, ?, ?);
                `;
    const insertstarRow = await connection.query(insertstarQuery, insertStarParmas);

    return insertstarRow;
};


// 검색기록 생성
async function insertSearchLog(connection, insertSearchParmas) {
    const insertsearchQuery = `
                INSERT INTO SearchLog(userIdx, keyword)
                VALUES (?, ?);
                `;
    const insertsearchRow = await connection.query(insertsearchQuery, insertSearchParmas);

    return insertsearchRow;
};


// 검색기록 조회
async function selectSearchLogByUserIdx(connection, userIdx) {
    const selectStorageByUserIdxQuery = `
            SELECT
                keyword
            FROM SearchLog
            WHERE SearchLog.status != 'D' and SearchLog.userIdx = ${userIdx}
            ORDER BY SearchLog.updatedAt DESC;
                `;
    const [StorageByUserIdxRow] = await connection.query(selectStorageByUserIdxQuery, userIdx);

    return StorageByUserIdxRow;
};

// 검색기록 삭제
async function updateSearchLog(connection, userIdx, keyword) {
    const updateSearchLogQuery = `
                UPDATE SearchLog
                SET status = 'D'
                WHERE userIdx = ${userIdx} and keyword = '${keyword}';
                `;
    const updateSearchLogRow = await connection.query(updateSearchLogQuery, userIdx);

    return updateSearchLogRow[0];
};

// 수정, 검색기록
async function selectkeywordByuserIdx(connection, userIdx, keyword) {
    const selectepisodeByepisodeIdxQuery = `
                SELECT userIdx, keyword
                FROM SearchLog
                WHERE userIdx = ${userIdx} and keyword = '${keyword}' and status != 'D';
                `;
    const [keywordRow] = await connection.query(selectepisodeByepisodeIdxQuery, userIdx, keyword);

    return keywordRow;
};


/*
const selectHistoryCount = `
         SELECT
            case
                when history is null
                    then 0
                    else history
                end as historyCount
        from Webtoon
        left join History on Webtoon.webtoonIdx = History.webtoonIdx
        left join Episode on Webtoon.webtoonIdx = Episode.webtoonIdx
        left join (select webtoonIdx, COUNT(webtoonIdx) as history from History where status != 'D' group by webtoonIdx) as h
        on h.webtoonIdx = Webtoon.webtoonIdx
        WHERE Webtoon.status != 'D' and History.status != 'D'
    `;
 */


module.exports = {
    insertUser,
    selectUserID,
    selectUserPassword,
    selectUserAccount,
    selectJWT,
    insertToken,
    deleteJWT,
    withDrawUser,
    selectUserByIdx,
    selectUserPhoneNumber,
    updateUserPhoneNumber,
    updateUserEmail,
    selectUserProfile,
    selectUserNickName,
    updateProfile,
    selectInterests,
    updateInterests,
    insertInterest,
    selectNotices,
    updateNotices,
    selectInterestsByUserIdx,
    insertLook,
    selectHistoryByUserIdx,
    insertStorage,
    selectWebtoonsStoragesByUserIdx,
    selectEpisodesStoragesByUserIdx,
    updateStorage,
    selectHearts,
    updateHearts,
    insertHeart,
    insertStar,
    insertSearchLog,
    selectSearchLogByUserIdx,
    updateSearchLog,
    selectkeywordByuserIdx
};