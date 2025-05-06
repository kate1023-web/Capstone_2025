document.addEventListener("DOMContentLoaded", () => {
  const user_name = localStorage.getItem("user_name");
  const user_pk = localStorage.getItem("user_pk");

  const welcomeName = document.getElementById("welcome-name");
  const loginBtn = document.getElementById("login-btn");
  const currentDate = document.getElementById("current-date");
  const datePicker = document.getElementById("date-picker");
  const todoList = document.getElementById("todo-list");

  const categorySelector = document.getElementById("category-selector");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const toggleCategoryBtn = document.getElementById("toggle-category-list");
  const todoInput = document.getElementById("todo-input");
  const submitBtn = document.getElementById("submit-todo");
  const cancelBtn = document.getElementById("close-todo-form");
  const addTodoBtn = document.getElementById("add-todo-btn");
  const todoFormPopup = document.getElementById("todo-form-popup");
  const overlay = document.getElementById("overlay");

  // ✅ 사이드바 관련 요소
  const menuToggle = document.getElementById("menu-toggle");
  const menuToggleInside = document.getElementById("menu-toggle-inside");

  const sidebarLogin = document.getElementById("sidebar-login");

  //메모 관련 요소
  const saveMemoBtn = document.getElementById("save-memo");
  const memoTextArea = document.getElementById("memo-text");

  //pdf 추출 관련 요소
  const pdfBtn = document.getElementById("pdf-download-btn");
  const pdfPopup = document.getElementById("pdf-popup");
  const closePdfPopup = document.getElementById("close-pdf-popup");
  const downloadPdfBtn = document.getElementById("download-pdf-btn");
  const pdfDatePicker = document.getElementById("pdf-date-picker");

  let selectedCategory = null;
  let categories = new Set();
  let categoryVisible = false;

  // ✅ 사이드바 토글 기능
  menuToggle.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-open");
  });

  menuToggleInside.addEventListener("click", () => {
    document.body.classList.remove("sidebar-open");
  });

  function formatDateKorean(date) {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const day = days[date.getDay()];
    return `${yyyy}년 ${String(mm).padStart(2, "0")}월 ${String(dd).padStart(2, "0")}일 (${day})`;
  }

  function setTodayDate() {
    const today = new Date();
    currentDate.textContent = formatDateKorean(today); // 오늘 날짜 표시
    datePicker.value = today.toISOString().split("T")[0]; // datePicker에 오늘 날짜 설정
    loadTodosFromDB(); // 오늘 날짜의 투두리스트 불러오기
  }

  function addStarListener(star, span, todo_pk) {
    star.addEventListener("change", () => {
      span.style.textDecoration = star.checked ? "line-through" : "none";
      fetch("http://localhost:3000/update-todo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo_pk,
          todo_tf: star.checked ? "Y" : "N",
        })
      }).catch(e => console.error("상태 업데이트 실패:", e));
    });
  }

  function loadTodosFromDB() {
    // datePicker에서 값을 가져오고, 해당 날짜를 한국 시간대로 변환
    const date = new Date(datePicker.value);  // 'YYYY-MM-DD' 형식의 날짜 값
    date.setHours(date.getHours() + 9);  // 한국 시간대로 변환 (UTC +9)
  
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ""); // 'YYYYMMDD' 형식으로 변환
    
    console.log("Sending date:", formattedDate);  // 확인용 로그
    
    fetch("http://localhost:3000/get-todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_pk: Number(user_pk), todo_date: formattedDate })
    })
    .then(res => res.json())
    .then(result => {
      todoList.innerHTML = "";
      if (result.result === "success") {
        const grouped = {};
        result.todos.forEach(todo => {
          if (!grouped[todo.todo_cat]) grouped[todo.todo_cat] = [];
          grouped[todo.todo_cat].push(todo);
        });
        Object.keys(grouped).sort().forEach(cat => {
          const header = document.createElement("div");
          header.className = "todo-category-header";
          header.textContent = cat;
          todoList.appendChild(header);
  
          grouped[cat].forEach(todo => {
            const item = document.createElement("div");
            item.className = "todo-item";
            item.dataset.pk = todo.todo_pk;
  
            const star = document.createElement("input");
            star.type = "checkbox";
            star.classList.add("star-check");
            star.checked = todo.todo_tf === "Y";
  
            const span = document.createElement("span");
            span.textContent = todo.todo_text;
            if (star.checked) span.style.textDecoration = "line-through";
  
            const delBtn = document.createElement("button");
            delBtn.className = "todo-delete";
            delBtn.textContent = "×";
            delBtn.addEventListener("click", () => {
              fetch("http://localhost:3000/delete-todo", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo_pk: todo.todo_pk })
              })
              .then(() => item.remove())
              .catch(e => console.error("삭제 오류:", e));
            });
  
            item.appendChild(star);
            item.appendChild(span);
            item.appendChild(delBtn);
            todoList.appendChild(item);
          });
        });
      }
    })
    .catch(e => console.error("할 일 불러오기 오류:", e));
  }
  
  function renderCategorySelector() {
    categorySelector.innerHTML = "";
    Array.from(categories).forEach(cat => {
      const wrapper = document.createElement("div");
      wrapper.className = "category-wrap";

      const btn = document.createElement("button");
      btn.className = "category-button";
      btn.textContent = cat;
      if (cat === selectedCategory) btn.classList.add("selected");
      btn.addEventListener("click", () => {
        selectedCategory = cat;
        renderCategorySelector();
      });

      const del = document.createElement("button");
      del.className = "remove-category";
      del.textContent = "×";
      del.addEventListener("click", () => {
        if (!confirm(`${cat} 카테고리를 삭제하시겠습니까?`)) return;
        fetch("http://localhost:3000/delete-category", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_pk: Number(user_pk),
            categoryName: cat
          })
        })
          .then(res => res.json())
          .then(result => {
            if (result.result === "success") {
              categories.delete(cat);
              renderCategorySelector();
              loadTodosFromDB();
            }
          })
          .catch(e => console.error("카테고리 삭제 오류:", e));
      });      

      wrapper.appendChild(btn);
      wrapper.appendChild(del);
      categorySelector.appendChild(wrapper);
    });
  }

  datePicker.addEventListener("change", () => {
    const selectedDate = new Date(datePicker.value);
    currentDate.textContent = formatDateKorean(selectedDate);
    loadTodosFromDB();
    if (user_pk) loadMemoFromDB(); // 날짜 바뀔 때마다 메모도 로딩
  });

  addCategoryBtn.addEventListener("click", () => {
    const newCategory = prompt("새 카테고리를 입력하세요:");
    if (newCategory && !categories.has(newCategory)) {
      categories.add(newCategory);
      selectedCategory = newCategory;
      renderCategorySelector();

      fetch("http://localhost:3000/add-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_pk: Number(user_pk),
          todo_cat: newCategory,
          todo_date: datePicker.value.replace(/-/g, "")
        })
      })
        .then(res => res.json())
        .then(result => {
          if (result.result !== "success") {
            alert("카테고리 추가 실패");
            categories.delete(newCategory);
            renderCategorySelector();
          }
        })
        .catch(e => {
          console.error("카테고리 추가 중 오류:", e);
          categories.delete(newCategory);
          renderCategorySelector();
        });
    }
  });

  addTodoBtn.addEventListener("click", () => {
    todoFormPopup.style.display = "flex";
    overlay.style.display = "block";
    todoInput.value = "";
  });

  cancelBtn.addEventListener("click", () => {
    todoFormPopup.style.display = "none";
    overlay.style.display = "none";
  });

  submitBtn.addEventListener("click", () => {
    const content = todoInput.value.trim();
    const date = datePicker.value.replace(/-/g, "");
    if (!content || !selectedCategory || !user_pk) {
      alert("내용과 카테고리를 입력해주세요.");
      return;
    }

    fetch("http://localhost:3000/add-todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_pk,
        todo_cat: selectedCategory,
        todo_text: content,
        todo_date: date
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.result === "success") {
          loadTodosFromDB();
          todoFormPopup.style.display = "none";
          overlay.style.display = "none";
          todoInput.value = "";
        }
      })
      .catch(e => console.error("등록 실패:", e));
  });

  toggleCategoryBtn.addEventListener("click", () => {
    categoryVisible = !categoryVisible;
    categorySelector.style.display = categoryVisible ? "block" : "none";
    toggleCategoryBtn.classList.toggle("collapsed", !categoryVisible);
  });

  if (user_name && welcomeName) {
    const expireTime = localStorage.getItem("login_expire");
    if (expireTime && Date.now() < parseInt(expireTime)) {
      welcomeName.textContent = user_name;
      document.getElementById("welcome-container").style.display = "inline-block";
  
      loginBtn.textContent = "로그아웃";
      loginBtn.style.display = "inline-block";
      loginBtn.addEventListener("click", logout);
  
      // :white_check_mark: 사이드바 로그인도 로그아웃으로 바꿈
      if (sidebarLogin) {
        sidebarLogin.textContent = "로그아웃";
        sidebarLogin.href = "#";
        sidebarLogin.addEventListener("click", (e) => {
          e.preventDefault();
          logout();
        });
      }
  
      loadCategoriesFromDB();

      loadMemoFromDB();

    } else {
      localStorage.clear();
      loginBtn.style.display = "inline-block";
    }
  }
  
  function logout() {
    if (confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_pk");
      localStorage.removeItem("login_expire");
      window.location.href = "index.html";
    }
  }

  setTodayDate();
  if (user_pk) loadMemoFromDB(); // 로그인 되어 있을 경우만 불러오기
  
  // ✅ 달력 버튼 토글 기능 추가
  const calendarBtn = document.getElementById("calendar-btn");
  const calendarPopup = document.getElementById("calendar-popup");
  const closeCalendarBtn = document.getElementById("close-calendar");

  calendarBtn.addEventListener("click", () => {
    calendarPopup.style.display = calendarPopup.style.display === "block" ? "none" : "block";
  });

  closeCalendarBtn.addEventListener("click", () => {
    calendarPopup.style.display = "none";
  });

  // ✅ 메모 토글 기능
  const toggleMemoBtn = document.getElementById("toggle-memo");
  const memoContainer = document.getElementById("memo-container");

  toggleMemoBtn.addEventListener("click", () => {
    memoContainer.classList.toggle("memo-collapsed");
    toggleMemoBtn.classList.toggle("collapsed");
  });

  saveMemoBtn.addEventListener("click", () => {
    const memoText = memoTextArea.value.trim();
    const memoDate = datePicker.value.replace(/-/g, "");
  
    if (!user_pk) return;
  
    fetch("http://localhost:3000/save-memo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_pk: Number(user_pk),
        memo_date: memoDate,
        memo_text: memoText
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.result === "success") {
          alert("메모가 저장되었습니다.");
        } else {
          alert("저장 실패");
        }
      })
      .catch(err => console.error("메모 저장 오류:", err));
  });

  function loadMemoFromDB() {
    const memoDate = datePicker.value.replace(/-/g, "");
    if (!user_pk) return;
  
    fetch("http://localhost:3000/load-memo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_pk: Number(user_pk),
        memo_date: memoDate
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.result === "success") {
          memoTextArea.value = result.memo_text || "";
        } else {
          memoTextArea.value = "";
        }
      })
      .catch(err => console.error("메모 불러오기 오류:", err));
  }
    
  pdfBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    pdfPopup.style.display = "flex";
    document.getElementById("pdf-overlay").style.display = "block"; // ← 흐림 처리 on
    const today = new Date().toISOString().split("T")[0];
    pdfDatePicker.value = today;
  });  
  
  // 팝업 닫기
  closePdfPopup.addEventListener("click", () => {
    pdfPopup.style.display = "none";
    document.getElementById("pdf-overlay").style.display = "none"; // ← 흐림 처리 off
    window.location.href = "index.html";
  });  
  
  // PDF 다운로드 처리
  downloadPdfBtn.addEventListener("click", () => {
    const selectedDate = pdfDatePicker.value.replace(/-/g, "");
    fetch("http://localhost:3000/pdf-todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user_pk: Number(user_pk), 
        todo_date: selectedDate,
        user_name: user_name
      }),
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `todo_${selectedDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
  
        // ✅ 흐림 효과 제거
        pdfPopup.style.display = "none";
        document.getElementById("pdf-overlay").style.display = "none";
  
        // ✅ 메인 페이지로 이동
        window.location.href = "index.html";
      })
      .catch(err => console.error("PDF 추출 실패:", err));
  });



function loadCategoriesFromDB() {
  fetch("http://localhost:3000/get-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_pk: Number(user_pk) })
  })
    .then(res => res.json())
    .then(result => {
      if (result.result === "success") {
        categories = new Set(result.categories);
        selectedCategory = result.categories[0] || null;
        renderCategorySelector(); // 카테고리 렌더링
        loadTodosFromDB(); // 투두 리스트 로딩
      }
    })
    .catch(e => console.error("카테고리 불러오기 오류:", e));
}

});