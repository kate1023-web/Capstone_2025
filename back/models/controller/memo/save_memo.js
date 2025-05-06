const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/save-memo", (req, res) => {
    const { user_pk, memo_date, memo_text } = req.body;

    // user_pk 값 확인
    const user_pk_num = Number(user_pk);
    if (isNaN(user_pk_num) || !memo_date || !memo_text) {
        return res.status(400).json({
            result: "fail", 
            message: "값이 부족합니다. user_pk, memo_date, memo_text가 모두 필요합니다."
        });
    }

    // memo_text가 비어있는지 확인
    if (memo_text.trim() === "") {
        return res.status(400).json({
            result: "fail",
            message: "메모 내용이 비어 있습니다."
        });
    }

    const checkSql = "SELECT * FROM memo WHERE user_pk = ? AND memo_date = ?";
    db.query(checkSql, [user_pk, memo_date], (err, results) => {
        if (err) {
            console.error("DB 오류:", err);  // 에러 출력
            return res.status(500).json({
                result: "fail", 
                message: "DB 오류"
            });
        }

        if (results.length > 0) {
            // 이미 존재하면 UPDATE
            const updateSql = "UPDATE memo SET memo_text = ? WHERE user_pk = ? AND memo_date = ?";
            db.query(updateSql, [memo_text, user_pk, memo_date], (err) => {
                if (err) {
                    console.error("UPDATE 쿼리 오류:", err);  // 에러 출력
                    return res.status(500).json({
                        result: "fail", 
                        message: "메모 업데이트 실패"
                    });
                }
                return res.json({ result: "success" });
            });
        } else {
            // 없으면 INSERT
            const insertSql = "INSERT INTO memo (user_pk, memo_date, memo_text) VALUES (?, ?, ?)";
            db.query(insertSql, [user_pk, memo_date, memo_text], (err) => {
                if (err) {
                    console.error("INSERT 쿼리 오류:", err);  // 에러 출력
                    return res.status(500).json({
                        result: "fail", 
                        message: "메모 저장 실패"
                    });
                }
                return res.json({ result: "success" });
            });
        }
    });
});

module.exports = router;
