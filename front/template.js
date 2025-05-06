document.addEventListener("DOMContentLoaded", () => {
    const user_pk = localStorage.getItem("user_pk");
    const user_name = localStorage.getItem("user_name");
    const expireTime = localStorage.getItem("login_expire");
  
    const welcomeName = document.getElementById("welcome-name");
    const loginBtn = document.getElementById("login-btn");
    const sidebarLogin = document.getElementById("sidebar-login");
    const welcomeContainer = document.getElementById("welcome-container");
  
    const container = document.getElementById("template-container");
    const menuToggle = document.getElementById("menu-toggle");
    const menuToggleInside = document.getElementById("menu-toggle-inside");
  
    // ✅ 로그인 표시
    if (user_name && expireTime && Date.now() < Number(expireTime)) {
      if (welcomeName && welcomeContainer) {
        welcomeName.textContent = user_name;
        welcomeContainer.style.display = "inline-block";
      }
  
      if (loginBtn) loginBtn.style.display = "none";
  
      if (sidebarLogin) {
        sidebarLogin.textContent = "로그아웃";
        sidebarLogin.href = "#";
        sidebarLogin.onclick = (e) => {
          e.preventDefault();
          logout();
        };
      }
    } else {
      localStorage.clear();
      if (loginBtn) loginBtn.style.display = "inline-block";
      loginBtn.onclick = () => {
        window.location.href = "login.html";
      };
    }
  
    function logout() {
      if (confirm("로그아웃 하시겠습니까?")) {
        localStorage.clear();
        window.location.href = "index.html";
      }
    }
  
    menuToggle?.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
  
    menuToggleInside?.addEventListener("click", () => {
      document.body.classList.remove("sidebar-open");
    });
  
    // ✅ 하드코딩된 템플릿 목록
    const templates = [
      {
        todo_cat: "아침 루틴",
        todos: [{ todo_text: "일어나기" }, { todo_text: "세수하기" }, { todo_text: "스트레칭" }]
      },
      {
        todo_cat: "공부 플랜",
        todos: [{ todo_text: "알고리즘 풀기" }, { todo_text: "프로젝트 코딩" }]
      },
      {
        todo_cat: "여행",
        todos: [
          { todo_text: "충전기" }, { todo_text: "화장품" }, { todo_text: "환전" }, { todo_text: "지갑" }, 
          { todo_text: "클렌징폼" }, { todo_text: "옷 및 속옷" }, { todo_text: "여권" }, { todo_text: "변압기" }
        ]
      }
    ];
  
    renderTemplates(templates);
  
    function renderTemplates(templates) {
      container.innerHTML = "";
  
      templates.forEach(template => {
        const wrapper = document.createElement("div");
        wrapper.className = "template-category";
  
        const header = document.createElement("div");
        header.className = "template-header";
  
        const title = document.createElement("span");
        title.textContent = template.todo_cat;
  
        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.addEventListener("click", async (e) => {
          e.stopPropagation(); // 클릭 이벤트가 상위 항목으로 전파되지 않도록 함
  
          if (!user_pk) return alert("로그인이 필요합니다.");
  
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          const currentDate = `${yyyy}${mm}${dd}`; // 'yyyymmdd' 형식
  
          try {
            // 카테고리와 템플릿 투두리스트 추가를 하나의 요청으로 처리
            const response = await fetch("http://localhost:3000/add-template", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_pk: Number(user_pk),
                todo_cat: template.todo_cat,
                todo_date: currentDate,
                todos: template.todos
              })
            });
  
            const result = await response.json();
            if (result.result === "success") {
              alert("템플릿이 추가되었습니다!");
            } else {
              console.error("템플릿 추가 실패", result.message);
            }
          } catch (err) {
            console.error("템플릿 추가 오류:", err);
          }
        });
  
        header.appendChild(title);
        header.appendChild(plusBtn);
        wrapper.appendChild(header);
  
        const detail = document.createElement("ul");
        detail.className = "template-todos";
        detail.style.display = "none";
  
        template.todos.forEach(t => {
          const li = document.createElement("li");
          li.textContent = t.todo_text;
          detail.appendChild(li);
        });
  
        header.addEventListener("click", () => {
          detail.style.display = detail.style.display === "none" ? "block" : "none";
        });
  
        wrapper.appendChild(detail);
        container.appendChild(wrapper);
      });
    }
  });
  