module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" },

    //Request error
    SIGNUP_IS_EMPTY : { "isSuccess": false, "code": 2001, "message":"필수 정보입니다." },
    SIGNUP_BIRTHDAY_EMPTY : { "isSuccess": false, "code": 2002, "message":"태어난 날짜를 정확하게 입력하세요."},

    SIGNUP_ID_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message": "5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다." },
    SIGNUP_PASSWORD_ERROR_TYPE : { "isSuccess": false, "code": 2004, "message":"8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요." },
    SIGNUP_PHONENUMBER_ERROR_TYPE : { "isSuccess": false, "code": 2005, "message":"형식에 맞지 않는 번호입니다."},

    SIGNIN_ID_EMPTY : { "isSuccess": false, "code": 2006, "message":"아이디를 입력해주세요" },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2007, "message": "비밀번호를 입력 해주세요." },
    SIGNIN_WRONG : { "isSuccess": false, "code": 2008, "message": "가입하지 않은 아이디이거나, 잘못된 비밀번호입니다." },

    NOT_LOGIN : { "isSuccess": false, "code": 2009, "message":"로그인 되어 있지 않습니다." },

    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2010, "message": "userIdx를 입력해주세요." },
    USER_IDX_NOT_MATCH : { "isSuccess": false, "code": 2011, "message": "userIdx가 일치하지 않습니다." },

    USER_USER_NOT_EXIST : { "isSuccess": false, "code": 2012, "message": "해당 회원이 존재하지 않습니다." },

    MODIFY_WRONG : { "isSuccess": false, "code": 2013, "message": "수정 사항을 입력해주세요." },
    CANT_MODIFY_BOTH : { "isSuccess": false, "code": 2014, "message": "동시 수정은 불가능합니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2015, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2016, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2017, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2018, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2019, "message": "회원 상태값을 입력해주세요" },

    WEBTOON_WEBTOONIDX_EMPTY : { "isSuccess": false, "code": 2020, "message": "webtoonIdx를 입력해주세요." },
    WEBTOON_TITLE_EMPTY : { "isSuccess": false, "code": 2021, "message": "웹툰 제목을 입력해주세요." },
    WEBTOON_ARTIST_EMPTY : { "isSuccess": false, "code": 2022, "message": "작가 이름을 입력해주세요." },
    WEBTOON_THUMBNAILURL_EMPTY : { "isSuccess": false, "code": 2023, "message": "썸네일 이미지를 입력해주세요." },
    WEBTOON_SUMMARY_EMPTY : { "isSuccess": false, "code": 2024, "message": "줄거리를 입력해주세요." },
    WEBTOON_SUBSUMMARY_EMPTY : { "isSuccess": false, "code": 2025, "message": "줄거리 요약을 입력해주세요." },
    WEBTOON_COLOR_EMPTY : { "isSuccess": false, "code": 2026, "message": "배경색을 입력해주세요." },
    WEBTOON_SIRIALDAYIDX_EMPTY : { "isSuccess": false, "code": 2027, "message": "serialdayIdx를 입력해주세요." },
    WEBTOON_CATEGORYIDX_EMPTY : { "isSuccess": false, "code": 2028, "message": "카테고리를 입력해주세요." },
    WEBTOON_AGELIMIT_EMPTY : { "isSuccess": false, "code": 2029, "message": "연령 제한을 입력해주세요." },
    WEBTOON_CATEGORYIDX_WRONG : { "isSuccess": false, "code": 2030, "message": "카테고리가 알맞지 않습니다." },
    WEBTOON_TITLE_LENGTH : { "isSuccess": false, "code": 2031, "message": "웹툰 제목은 30자 이내로 입력해주세요." },
    WEBTOON_SUMMARY_LENGTH : { "isSuccess": false, "code": 2032, "message": "줄거리는 300자 이내로 입력해주세요." },
    WEBTOON_SUBSUMMARY_LENGTH : { "isSuccess": false, "code": 2033, "message": "줄거리 요약은 50자 이내로 입력해주세요." },

    IMG_WRONG : { "isSuccess": false, "code": 2034, "message": "이미지 형식이 알맞지 않습니다." },

    EPISODE_EPISODEIDX_EMPTY : { "isSuccess": false, "code": 2035, "message": "episodeIdx를 입력해주세요." },
    EPISODE_WEBTOONIDX_EMPTY : { "isSuccess": false, "code": 2036, "message": "webtoonIdx를 입력해주세요." },
    EPISODE_TITLE_EMPTY : { "isSuccess": false, "code": 2037, "message": "에피소드 제목을 입력해주세요." },
    EPISODE_THUMBNAILURL_EMPTY : { "isSuccess": false, "code": 2038, "message": "에피소드 썸네일 이미지를 입력해주세요." },
    EPISODE_CONTENTSURL_EMPTY : { "isSuccess": false, "code": 2039, "message": "에피소드 내용을 입력해주세요." },
    EPISODE_TITLE_LENGTH : { "isSuccess": false, "code": 2040, "message": "에피소드 제목은 100자 이내로 입력해주세요." },

    BANNER_THUMBNAILURL_EMPTY : { "isSuccess": false, "code": 2041, "message": "썸네일 이미지를 입력해주세요." },
    BANNER_URL_EMPTY : { "isSuccess": false, "code": 2042, "message": "webtoonIdx 혹은 linkurl을 입력해주세요." },

    WEBTOON_WEBTOON_NOT_EXIST : { "isSuccess": false, "code": 2043, "message": "웹툰이 존재하지 않습니다." },
    WEBTOON_WEBTOON_CANNOT_SEE : { "isSuccess": false, "code": 2044, "message": "웹툰을 찾을 수 없습니다." },

    EPISODE_EPISODE_NOT_EXIST : { "isSuccess": false, "code": 2045, "message": "에피소드가 존재하지 않습니다." },
    EPISODE_EPISODE_CANNOT_SEE : { "isSuccess": false, "code": 2046, "message": "에피소드를 찾을 수 없습니다." },

    BANNER_BANNER_NOT_EXIST : { "isSuccess": false, "code": 2047, "message": "배너가 존재하지 않습니다." },
    BANNER_BANNER_CANNOT_SEE : { "isSuccess": false, "code": 2048, "message": "배너를 찾을 수 없습니다." },

    COMMENT_COMMENTIDX_EMPTY : { "isSuccess": false, "code": 2049, "message": "commentIdx를 입력해주세요." },
    COMMENT_WEBTOONIDX_EMPTY : { "isSuccess": false, "code": 2050, "message": "webtoonIdx를 입력해주세요." },
    COMMENT_EPISODEIDX_EMPTY : { "isSuccess": false, "code": 2051, "message": "episodeIdx를 입력해주세요." },
    COMMENT_USERIDX_EMPTY : { "isSuccess": false, "code": 2052, "message": "userIdx를 입력해주세요." },
    COMMENT_CONTENT_EMPTY : { "isSuccess": false, "code": 2053, "message": "댓글을 입력해주세요." },
    COMMENT_CONTENT_LENGTH : { "isSuccess": false, "code": 2054, "message": "댓글의 길이는 100자 이내로 입력해주세요." },
    COMMENT_PARENT_IDX_NOT_EXIST : { "isSuccess": false, "code": 2055, "message": "parentIdx가 존재하지 않습니다." },

    COMMENT_NOT_EXIST : { "isSuccess": false, "code": 2056, "message": "댓글이 존재하지 않습니다." },
    COMMENT_CANNOT_SEE : { "isSuccess": false, "code": 2057, "message": "댓글을 찾을 수 없습니다." },

    COMMENT_LIKESTATE_EMPTY : { "isSuccess": false, "code": 2058, "message": "좋아요/싫어요 상태를 입력해주세요." },
    COMMENT_REPORTREASON_EMPTY : { "isSuccess": false, "code": 2059, "message": "신고 이유를 입력해주세요." },

    //COMMENT_STATUS_ERROR_TYPE : { "isSuccess": false, "code": 2041, "message": "status는 D로만 변경가능합니다." },
    //COMMENT_NO_CHANGES : { "isSuccess": false, "code": 2042, "message": "content나 status중 하나는 입력되어야 합니다." },
    //COMMENT_STATUS_EMPTY : { "isSuccess": false, "code": 2045, "message": "status를 입력해주세요." },

    NOTICE_BEFORE_INTEREST : { "isSuccess": false, "code": 2060, "message": "관심 웹툰 등록 이후에 알림 설정이 가능합니다." },

    STORAGE_NOT_EXIST : { "isSuccess": false, "code": 2061, "message": "임시저장하지 않은 웹툰입니다." },
    KEYWORD_EMPTY : { "isSuccess": false, "code": 2062, "message": "검색어를 입력해주세요." },
    KEYWORD_NOT_EXIST : { "isSuccess": false, "code": 2063, "message": "검색어 기록이 존재하지 않습니다." },

    // Response error
    SIGNUP_REDUNDANT_ID : { "isSuccess": false, "code": 3001, "message":"중복된 아이디입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },
    SIGNUP_REDUNDANT_PHONENUMBER : { "isSuccess": false, "code": 3010, "message":"중복된 전화번호입니다." },

    SIGNIN_ID_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    AUTH_PHONENUMBER_ERROR_TYPE : { "isSuccess": false, "code": 3007, "message": "휴대전화 번호 형식에 맞게 입력해 주세요." },
    AUTH_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 3008, "message": "이메일 형식이 올바르지 않습니다." },
    AUTH_EMAIL_LENGTH : { "isSuccess": false, "code": 3009, "message": "이메일은 30자 이내로 입력해 주세요." },

    ALREADY_LOGIN : { "isSuccess": false, "code": 3010, "message": "이미 로그인되어 있습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
