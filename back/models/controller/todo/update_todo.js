// models/controller/todo/update_todo_status.js
const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

router.patch("/update-todo", (req, res) => {
  const { todo_pk, todo_tf } = req.body;

  if (!todo_pk || !todo_tf) {
    return res.status(400).json({ result: "error", message: "값 누락" });
  }

  const sql = "UPDATE todolist SET todo_tf = ? WHERE todo_pk = ?";
  db.query(sql, [todo_tf, todo_pk], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ result: "error", message: "DB 오류" });
    }
    res.json({ result: "success" });
  });
});

module.exports = router;