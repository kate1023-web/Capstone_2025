// login.js - 로그인 기능

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".login-btn");
  loginBtn.addEventListener("click", login);
});
  
  async function login() {
    const user_id = document.getElementById("login-id").value;
    const user_pw = document.getElementById("login-pw").value;
    const errorMessage = document.getElementById("error-message");
  
    errorMessage.textContent = "";
  
    if (!user_id || !user_pw) {
      errorMessage.textContent = "아이디와 비밀번호를 입력해주세요.";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, user_pw }),
      });
  
      const result = await response.json();
  
      if (result.result === "login_success") {
        localStorage.setItem("user_name", result.user_name);
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("user_pk", result.user_pk);
      
        // ✅ 로그인 유지 시간: 현재 시각 + 30분
        localStorage.setItem("login_expire", Date.now() + 30 * 60 * 1000);
      
        window.location.href = "index.html";
      } else {
        errorMessage.textContent = "아이디 또는 비밀번호가 잘못되었습니다.";
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      errorMessage.textContent = "서버 오류가 발생했습니다.";
    }
  }
  