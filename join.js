async function register() {
    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = ""; // 기존 오류 메시지 초기화

    if (username === "" || password === "" || confirmPassword === "") {
        errorMessage.textContent = "모든 필드를 입력하세요.";
        return;
    }
    
    if (password !== confirmPassword) {
        errorMessage.textContent = "비밀번호가 일치하지 않습니다.";
        return;
    }

    try {
        const response = await fetch("register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            alert("회원가입 성공! 로그인 페이지로 이동합니다.");
            window.location.href = "index.html"; // 로그인 페이지로 이동
        } else {
            errorMessage.textContent = result.message;
        }
    } catch (error) {
        console.error("회원가입 오류:", error);
        errorMessage.textContent = "서버 오류가 발생했습니다.";
    }
}
