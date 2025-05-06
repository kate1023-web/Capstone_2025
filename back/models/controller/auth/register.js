const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");


router.post("/register", (req, res) => {
    const { user_id, user_pw, user_name } = req.body;

    if (!user_id || !user_pw || !user_name) {
        return res.status(400).json({
            result: "missing_params",
            message: "아이디, 비밀번호, 이름은 필수입니다.",
        });
    }    

    const checkSql = "SELECT * FROM User WHERE user_id = ?";
    db.query(checkSql, [user_id], (err, results) => {
        if (err) {
            console.error("중복 확인 중 오류:", err);
            return res.status(500).json({ result: "db_error" });
        }

        if (results.length > 0) {
            return res.status(409).json({
                result: "user_exists",
                message: "이미 존재하는 아이디입니다.",
            });
        }

        const insertSql = "INSERT INTO User (user_id, user_pw, user_name) VALUES (?, ?, ?)";
        db.query(
            insertSql,
            [user_id, user_pw, user_name || null],
            (err2, result) => {
                if (err2) {
                    console.error("회원가입 중 오류:", err2);
                    return res.status(500).json({ result: "insert_error" });
                }
                const defaultCategories = ["공부", "운동", "일정"];
                const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
                const user_pk = result.insertId; // 방금 생성된 유저의 PK
                
                defaultCategories.forEach(cat => {
                  const sql = "INSERT INTO todo (user_pk, todo_cat, todo_date) VALUES (?, ?, ?)";
                  db.query(sql, [user_pk, cat, today], (err) => {
                    if (err) console.error(`기본 카테고리 [${cat}] 삽입 실패:`, err.message);
                  });
                });
                                
                return res.json({
                    result: "register_success",
                    user_pk: result.insertId,
                    message: "회원가입이 완료되었습니다.",
                });
            }
        );
    });
});

module.exports = router;
