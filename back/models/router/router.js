const express = require("express");
const router = express.Router();

// 로그인 라우터
const login = require("../controller/auth/login.js");
router.use("/", login);

// 회원가입 라우터
const register = require("../controller/auth/register.js");
router.use("/", register);

// 유저 정보 조회 라우터
const get_user = require("../controller/user/get_user.js");
router.use("/", get_user);

// 유저 정보 수정 라우터
router.use("/", require("../controller/user/update_name.js"));
router.use("/", require("../controller/user/update_password.js"));

// todo 추가, 삭제 관련 라우터
const add_todo = require("../controller/todo/add_todo.js");
router.use("/", add_todo);

// 카테고리 추가 라우터
const add_category = require("../controller/todo/add_category.js");
router.use("/", add_category);

// 카테고리 정보 조회 라우터
const getCategories = require("../controller/todo/get_categories.js");
router.use("/", getCategories);

// todo 상태 변환 라우터
const update_todo = require("../controller/todo/update_todo.js");
router.use("/", update_todo);

// 투두리스트 정보 조회 라우터
const getTodo = require("../controller/todo/get_todo.js");
router.use("/", getTodo);

// memo 저장 라우터
const saveMemo = require("../controller/memo/save_memo.js");
router.use("/", saveMemo);

// memo 불러오기 라우터
const loadMemo = require("../controller/memo/load_memo.js");
router.use("/", loadMemo);

// todo리스트 pdf 추출 라우터
const pdf_todo = require("../controller/todo/pdf_todo.js");
router.use("/", pdf_todo);

// 템플릿 저장 라우터
const add_template = require("../controller/template/add_template.js");
router.use("/", add_template);

module.exports = router;