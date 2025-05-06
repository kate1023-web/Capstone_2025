const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/user", (req, res) => {
    const { user_pk } = req.body;

    if (!user_pk) {
        return res.status(400).json({
            result: "missing_user_pk",
            message: "user_pk 값이 필요합니다.",
        });
    }

    const sql = "SELECT * FROM User WHERE user_pk = ?";
    db.query(sql, [user_pk], (err, results) => {
        if (err) {
            console.error("DB 오류:", err);
            return res.status(500).json({
                result: "db_error",
                message: "서버 오류가 발생했습니다.",
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                result: "not_found",
                message: "해당 user_pk를 가진 사용자가 없습니다.",
            });
        }

        return res.json({
            result: "success",
            user: {
                user_id: results[0].user_id,
                user_name: results[0].user_name,
                user_pk: results[0].user_pk,
            },
        });
    });
});

module.exports = router;
