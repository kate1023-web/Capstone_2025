const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/get-categories", (req, res) => {
  const { user_pk } = req.body;

  if (!user_pk) {
    return res.status(400).json({ result: "fail", message: "user_pk 누락" });
  }

  const sql = "SELECT DISTINCT todo_cat FROM todo WHERE user_pk = ?";
  db.query(sql, [user_pk], (err, results) => {
    if (err) {
      console.error("카테고리 조회 오류:", err);
      return res.status(500).json({ result: "fail", message: "DB 오류" });
    }

    const categories = results.map(row => row.todo_cat);
    return res.json({ result: "success", categories });
  });
});

module.exports = router;
