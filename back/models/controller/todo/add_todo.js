
const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");

// 카테고리 이름으로 todo_catpk 가져오기 또는 생성
function getOrCreateTodoCatPk(user_pk, categoryName, dateStr, callback) {
  const selectQuery = "SELECT todo_catpk FROM todo WHERE user_pk = ? AND todo_cat = ? AND todo_date = ? LIMIT 1";
  db.query(selectQuery, [user_pk, categoryName, dateStr], (err, results) => {
    if (err) return callback(err);
    if (results.length > 0) return callback(null, results[0].todo_catpk);

    const insertQuery = "INSERT INTO todo (user_pk, todo_cat, todo_date) VALUES (?, ?, ?)";
    db.query(insertQuery, [user_pk, categoryName, dateStr], (err, result) => {
      if (err) return callback(err);
      return callback(null, result.insertId);
    });
  });
}

// POST /add-todo
router.post("/add-todo", (req, res) => {
  const { user_pk, todo_text, todo_cat, todo_date } = req.body;

  if (!user_pk || !todo_text || !todo_cat || !todo_date) {
    return res.status(400).json({ result: "fail", message: "값이 부족합니다" });
  }

  getOrCreateTodoCatPk(user_pk, todo_cat, todo_date, (err, catpk) => {
    if (err) return res.status(500).json({ result: "fail", message: "카테고리 처리 오류" });

    const insertTodo = "INSERT INTO todolist (todo_list, todo_catpk, todo_tf, todo_catpk1) VALUES (?, ?, 'N', ?)";
    db.query(insertTodo, [todo_text, catpk, catpk], (err, result) => {
      if (err) return res.status(500).json({ result: "fail", message: "할 일 저장 오류" });
      return res.json({ result: "success", todo_pk: result.insertId });
    });
  });
});

// DELETE /delete-category
router.delete("/delete-category", (req, res) => {
  const { user_pk, categoryName } = req.body;

  if (!user_pk || !categoryName) {
    return res.status(400).json({ result: "fail", message: "값이 부족합니다" });
  }

  // 먼저, 해당 유저의 같은 카테고리 이름을 가진 모든 todo_catpk를 가져옴
  const getCatPkQuery = "SELECT todo_catpk FROM todo WHERE user_pk = ? AND todo_cat = ?";
  db.query(getCatPkQuery, [user_pk, categoryName], (err, results) => {
    if (err) return res.status(500).json({ result: "fail", message: "카테고리 조회 오류" });
    if (results.length === 0) return res.status(404).json({ result: "not_found" });

    // 모든 catpk를 배열로 추출
    const catpks = results.map(row => row.todo_catpk);

    // IN 절을 사용할 수 있도록 동적으로 placeholders 생성
    const placeholders = catpks.map(() => "?").join(",");

    // todolist 먼저 삭제
    const deleteTodoListQuery = `DELETE FROM todolist WHERE todo_catpk IN (${placeholders})`;
    db.query(deleteTodoListQuery, catpks, (err) => {
      if (err) return res.status(500).json({ result: "fail", message: "todolist 삭제 오류" });

      // todo 테이블에서도 삭제
      const deleteTodoQuery = `DELETE FROM todo WHERE todo_catpk IN (${placeholders})`;
      db.query(deleteTodoQuery, catpks, (err) => {
        if (err) return res.status(500).json({ result: "fail", message: "todo 삭제 오류" });

        return res.json({ result: "success" });
      });
    });
  });
});

// DELETE /delete-todo
router.delete("/delete-todo", (req, res) => {
  const { todo_pk } = req.body;
  if (!todo_pk) return res.status(400).json({ result: "fail", message: "todo_pk 누락" });

  const deleteQuery = "DELETE FROM todolist WHERE todo_pk = ?";
  db.query(deleteQuery, [todo_pk], (err) => {
    if (err) return res.status(500).json({ result: "fail", message: "삭제 실패" });
    return res.json({ result: "success" });
  });
});


module.exports = router;