const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.post("/get-todo", (req, res) => {
  const { user_pk, todo_date } = req.body;

  if (!user_pk || !todo_date) {
    return res.status(400).json({
      result: "fail",
      message: "user_pk 또는 todo_date 누락",
    });
  }

  const sql = `
    SELECT todolist.todo_pk, todo.todo_cat, todolist.todo_list AS todo_text, todolist.todo_tf
    FROM todolist
    JOIN todo ON todolist.todo_catpk = todo.todo_catpk
    WHERE todo.user_pk = ? AND todo.todo_date = ?
  `;

  db.query(sql, [user_pk, todo_date], (err, results) => {
    if (err) {
      console.error("투두 조회 오류:", err);
      return res.status(500).json({
        result: "fail",
        message: "DB 오류",
      });
    }

    return res.json({
      result: "success",
      todos: results,
    });
  });
});



module.exports = router;