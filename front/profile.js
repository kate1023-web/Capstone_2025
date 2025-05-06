// profile.js - 프로필 페이지 기능 스크립트

document.addEventListener("DOMContentLoaded", () => {
    const nameEl = document.getElementById("profile-name");
    const idEl = document.getElementById("profile-id");
    const messageEl = document.getElementById("message");
  
    const userName = localStorage.getItem("user_name");
    const userId = localStorage.getItem("user_id");
  
    if (userName) nameEl.textContent = userName;
    if (userId) idEl.textContent = userId;
  
    // 이름 변경
    document.getElementById("change-name-btn").addEventListener("click", async () => {
      const newName = document.getElementById("new-name").value.trim();
      if (!newName) return showMessage("이름을 입력해주세요.");
  
      try {
        const res = await fetch("http://localhost:3000/update-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, new_name: newName })
        });
        const result = await res.json();
        if (result.result === "success") {
          localStorage.setItem("user_name", newName);
          nameEl.textContent = newName;
          showMessage("이름이 성공적으로 변경되었습니다.", true);
        } else {
          showMessage("이름 변경 실패: " + result.message);
        }
      } catch (err) {
        showMessage("서버 오류 발생: 이름 변경 실패");
      }
    });
  
    // 비밀번호 변경
    document.getElementById("change-pw-btn").addEventListener("click", async () => {
      const currentPw = document.getElementById("current-pw").value;
      const newPw = document.getElementById("new-pw").value;
      const confirmPw = document.getElementById("confirm-pw").value;
  
      if (!currentPw || !newPw || !confirmPw) return showMessage("모든 비밀번호 필드를 입력해주세요.");
      if (newPw !== confirmPw) return showMessage("새 비밀번호가 일치하지 않습니다.");
  
      try {
        const res = await fetch("http://localhost:3000/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, current_pw: currentPw, new_pw: newPw })
        });
        const result = await res.json();
        if (result.result === "success") {
          showMessage("비밀번호가 성공적으로 변경되었습니다.", true);
          document.getElementById("current-pw").value = "";
          document.getElementById("new-pw").value = "";
          document.getElementById("confirm-pw").value = "";
        } else {
          showMessage("비밀번호 변경 실패: " + result.message);
        }
      } catch (err) {
        showMessage("서버 오류 발생: 비밀번호 변경 실패");
      }
    });
  
    // 로그아웃
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_id");
      window.location.href = "index.html";
    });
  
    function showMessage(msg, success = false) {
      messageEl.textContent = msg;
      messageEl.style.color = success ? "green" : "red";
    }

    document.getElementById("back-btn").addEventListener("click", function () {
        window.location.href = "index.html";
      });
  });
  