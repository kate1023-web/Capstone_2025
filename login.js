function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "" || password === "") {
        alert("아이디와 비밀번호를 입력하세요.");
        return;
    }

    // 로그인 처리 로직 (백엔드 연동 필요)
    alert("로그인 성공 (실제 로그인 로직 필요)");
}
