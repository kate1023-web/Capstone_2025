async function register() {
    const user_id = document.getElementById("new-username").value;
    const user_pw = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const user_name = document.getElementById("new-name").value;
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    if (user_name === "" || user_id === "" || user_pw === "" || confirmPassword === "") {
        errorMessage.textContent = "모든 필드를 입력하세요.";
        return;
    }    

    if (user_id === "" || user_pw === "" || confirmPassword === "") {
        errorMessage.textContent = "모든 필드를 입력하세요.";
        return;
    }

    if (user_pw !== confirmPassword) {
        errorMessage.textContent = "비밀번호가 일치하지 않습니다.";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, user_pw, user_name })  // ✅ 수정됨
        });        

        const result = await response.json();  // JSON 응답 받기

        if (result.result === "register_success") {
            alert("회원가입 성공! 로그인 페이지로 이동합니다.");
            window.location.href = "login.html";
        } else {
            errorMessage.textContent = result.message || "회원가입 실패";
        }
    } catch (error) {
        console.error("회원가입 오류:", error);
        errorMessage.textContent = "서버 오류가 발생했습니다.";
    }
}
