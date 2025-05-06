const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/add-template", async (req, res) => {
    const { user_pk, todo_cat, todo_date, todos } = req.body;
    if (!user_pk || !todo_cat || !todo_date || !todos || !Array.isArray(todos)) {
      return res.status(400).json({ result: "error", message: "잘못된 요청" });
    }
  
    try {
      // 1. 카테고리 추가
      const [catResult] = await db.promise().query(
        "INSERT INTO todo (todo_cat, todo_date, user_pk) VALUES (?, ?, ?)",
        [todo_cat, todo_date, user_pk]
      );
  
      const catPk = catResult.insertId;
  
      // 2. 각 투두 항목 추가
      const todoInserts = todos.map(t => [t.todo_text, catPk, "0", catPk]);
      await db.promise().query(
        "INSERT INTO todolist (todo_list, todo_catpk, todo_tf, todo_catpk1) VALUES ?",
        [todoInserts]
      );
  
      res.json({ result: "success" });
    } catch (err) {
      console.error("DB 오류:", err);
      res.status(500).json({ result: "error", message: "서버 오류" });
    }
  });
  
  module.exports = router;