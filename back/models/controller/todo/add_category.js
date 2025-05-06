const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/add-category", (req, res) => {
    const { user_pk, todo_cat, todo_date } = req.body;
      
  
    if (!user_pk || !todo_cat || !todo_date) {
      return res.status(400).json({ result: "fail", message: "값 누락" });
    }
  
    const checkQuery = "SELECT * FROM todo WHERE user_pk = ? AND todo_cat = ? AND todo_date = ?";
    db.query(checkQuery, [user_pk, todo_cat, todo_date], (err, results) => {
      if (err) {
        return res.status(500).json({ result: "fail", message: "중복 확인 실패" });
      }
      if (results.length > 0) {
        return res.status(409).json({ result: "duplicate" });
      }
  
      const insertQuery = "INSERT INTO todo (user_pk, todo_cat, todo_date) VALUES (?, ?, ?)";
      db.query(insertQuery, [user_pk, todo_cat, todo_date], (err) => {
        if (err) {
          console.error("삽입 오류 발생:", err); // 어떤오류인지 콘솔에 뜨기
          return res.status(500).json({ result: "fail", message: "삽입 실패", error: err });
        }
        return res.json({ result: "success" });
      });
    });
  });  

  module.exports = router;
