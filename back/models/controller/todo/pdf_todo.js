const express = require("express");
const router = express.Router();
const db = require("../../database/db.js");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

router.post("/pdf-todos", (req, res) => {
  const { user_pk, todo_date, user_name } = req.body;

  if (!user_pk || !todo_date || !user_name) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    return res.end("Invalid input");
  }

  const sql = `
    SELECT todo_cat, todo_list, todo_tf
    FROM todo t
    JOIN todolist l ON t.todo_catpk = l.todo_catpk
    WHERE t.user_pk = ? AND t.todo_date = ?
  `;

  db.query(sql, [user_pk, todo_date], (err, results) => {
    if (err) {
      console.error("❌ DB 쿼리 실패:", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      return res.end("Database error");
    }

    // ✅ PDF 헤더 설정
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="todo_${todo_date}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res);

    // ✅ 폰트 설정
    const fontPath = path.join(__dirname, '../../../fonts/NanumGothic.ttf');
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath);
    } else {
      console.warn("⚠️ 폰트 파일이 존재하지 않음. 기본 폰트로 진행됨.");
    }

    // ✅ 날짜 포맷 + 요일 포함
    const year = todo_date.slice(0, 4);
    const month = todo_date.slice(4, 6);
    const day = todo_date.slice(6, 8);
    const dateObj = new Date(`${year}-${month}-${day}`);
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = dayOfWeek[dateObj.getDay()];
    const titleText = `${user_name}의 ${year}년 ${month}월 ${day}일 (${weekday}) todoList`;

    // ✅ 제목 박스와 텍스트
    const titleX = 50;
    const titleY = 50;
    const paddingX = 20;
    const paddingY = 10;

    doc.fontSize(20);
    const textWidth = doc.widthOfString(titleText);
    const textHeight = doc.currentLineHeight();

    // 제목 배경 박스
    doc.rect(titleX, titleY, textWidth + paddingX, textHeight + paddingY).fill('#b6edff');

    // 제목 텍스트
    doc.fillColor('#121212')
       .text(titleText, titleX + paddingX / 2, titleY + paddingY / 2);
    doc.moveDown().moveDown();

    // ✅ 투두리스트
    doc.fontSize(14); // 본문 크기 증가
    if (results.length === 0) {
      doc.fillColor('#333333').text("할 일이 없습니다.");
    } else {
      results.forEach((item) => {
        const status = item.todo_tf === 'Y' ? '완료' : '미완료';

        doc.fillColor('#a2e8ff') // 카테고리
            .text(`[${item.todo_cat}]`, { continued: true });

        doc.fillColor('#333') // 내용
            .text(` ${item.todo_list} `, { continued: true });

        doc.fillColor('#d7d7d7') // 상태
            .text(`(${status})`);

        doc.moveDown(1.5);    
      });
    }

    doc.end();
  });
});

module.exports = router;
