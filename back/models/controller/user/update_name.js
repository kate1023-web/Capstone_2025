// controller/user/update_name.js
const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/update-name", (req, res) => {
  const { user_id, new_name } = req.body;

  if (!user_id || !new_name) {
    return res.status(400).json({ result: "fail", message: "필수 정보가 없습니다." });
  }

  const sql = "UPDATE User SET user_name = ? WHERE user_id = ?";
  db.query(sql, [new_name, user_id], (err, result) => {
    if (err) {
      console.error("이름 변경 오류:", err);
      return res.status(500).json({ result: "fail", message: "서버 오류" });
    }
    return res.json({ result: "success" });
  });
});

module.exports = router;
