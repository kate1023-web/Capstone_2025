const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/login", (req, res) => {
    const { user_id, user_pw } = req.body;

    if (!user_id || !user_pw) {
        return res.status(400).json({
            result: "missing_params",
            message: "아이디와 비밀번호를 모두 입력해주세요.",
        });
    }

    const sql =
        "SELECT * FROM User WHERE user_id = ? AND user_pw = ?";
    db.query(sql, [user_id, user_pw], (err, results) => {
        if (err) {
            console.error("DB 오류:", err);
            return res.status(500).json({
                result: "db_error",
                message: "서버 내부 오류가 발생했습니다.",
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                result: "login_failed",
                message: "아이디 또는 비밀번호가 일치하지 않습니다.",
            });
        }

        // 로그인 성공
        const dbUser = results[0];
        return res.json({
            result: "login_success",
            user_id: dbUser.user_id,
            user_name: dbUser.user_name,
            user_pk: dbUser.user_pk
        });        
    });
});

module.exports = router;