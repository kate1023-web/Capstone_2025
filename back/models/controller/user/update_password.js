// controller/user/update_password.js
const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/update-password", (req, res) => {
  const { user_id, current_pw, new_pw } = req.body;

  if (!user_id || !current_pw || !new_pw) {
    return res.status(400).json({ result: "fail", message: "모든 필드를 입력해주세요." });
  }

  const selectSql = "SELECT user_pw FROM User WHERE user_id = ?";
  db.query(selectSql, [user_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ result: "fail", message: "사용자 조회 실패" });
    }

    const dbPw = results[0].user_pw;
    if (dbPw !== current_pw) {
      return res.status(403).json({ result: "fail", message: "현재 비밀번호가 틀렸습니다." });
    }

    const updateSql = "UPDATE User SET user_pw = ? WHERE user_id = ?";
    db.query(updateSql, [new_pw, user_id], (err2) => {
      if (err2) {
        return res.status(500).json({ result: "fail", message: "비밀번호 변경 실패" });
      }
      return res.json({ result: "success" });
    });
  });
});

module.exports = router;
