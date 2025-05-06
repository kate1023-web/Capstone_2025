const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/load-memo", (req, res) => {
    const { user_pk, memo_date } = req.body;
  
    const user_pk_num = Number(user_pk);
    if (!user_pk_num || !memo_date) {
      return res.status(400).json({ result: "fail", message: "값이 부족합니다." });
    }    
  
    const sql = "SELECT memo_text FROM memo WHERE user_pk = ? AND memo_date = ?";
    db.query(sql, [user_pk, memo_date], (err, results) => {
      if (err) return res.status(500).json({ result: "fail" });
  
      if (results.length > 0) {
        return res.json({ result: "success", memo_text: results[0].memo_text });
      } else {
        return res.json({ result: "success", memo_text: "" });
      }
    });
  });

  module.exports = router;