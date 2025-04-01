document.addEventListener("DOMContentLoaded", function () {
    // 🌟 사이드바 기능
    const menuToggle = document.getElementById("menu-toggle");
    const menuToggleInside = document.getElementById("menu-toggle-inside"); // 내부 버튼
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector("main");
    const header = document.querySelector("header");
    const dateContainer = document.getElementById("date-container");
    const todoContainer = document.getElementById("todo-container");
    const body = document.body;

    function toggleSidebar() {
        const isOpen = sidebar.classList.toggle("open");

        // 🔥 사이드바 열릴 때 추가할 클래스
        mainContent.classList.toggle("sidebar-open", isOpen);
        header.classList.toggle("sidebar-open", isOpen);
        dateContainer.classList.toggle("sidebar-open", isOpen);
        todoContainer.classList.toggle("sidebar-open", isOpen);
        body.classList.toggle("sidebar-open", isOpen);
    }

    // ☰ 버튼 클릭하면 사이드바 열기/닫기
    menuToggle.addEventListener("click", toggleSidebar);
    menuToggleInside.addEventListener("click", toggleSidebar); // 내부 버튼도 같은 기능

    // 🌟 날짜 선택 기능
    const currentDateElement = document.getElementById("current-date");
    const calendarBtn = document.getElementById("calendar-btn");
    const datePicker = document.getElementById("date-picker");
    const calendarPopup = document.getElementById("calendar-popup");
    const closeCalendar = document.getElementById("close-calendar");

    // 오늘 날짜 표시 함수
    function updateDateDisplay(date) {
        const formattedDate = date.getFullYear() + "년 " + 
                              (date.getMonth() + 1) + "월 " + 
                              date.getDate() + "일";
        currentDateElement.textContent = formattedDate;
    }

    // 초기 날짜 설정
    const today = new Date();
    updateDateDisplay(today);

    // 🔥 팝업 열기 (위치 조정 포함)
    calendarBtn.addEventListener("click", function () {
        if (calendarPopup.style.display === "block") {
            calendarPopup.style.display = "none";
        } else {
            calendarPopup.style.display = "block";

            // 버튼 위치 기준으로 팝업 정렬
            const btnRect = calendarBtn.getBoundingClientRect();
            calendarPopup.style.top = `${btnRect.bottom + window.scrollY}px`;
            calendarPopup.style.left = `${btnRect.left + window.scrollX}px`;
        }
    });

    // 🔥 팝업 닫기
    closeCalendar.addEventListener("click", function () {
        calendarPopup.style.display = "none";
    });

    // 🔥 날짜 선택 후 변경된 날짜 적용
    datePicker.addEventListener("change", function () {
        const selectedDate = new Date(datePicker.value);
        updateDateDisplay(selectedDate);
        calendarPopup.style.display = "none";
    });

    function toggleSidebar() {
        const isOpen = sidebar.classList.toggle("open");
    
        // 🔥 사이드바가 열릴 때 추가, 닫힐 때 제거
        [mainContent, header, dateContainer, todoContainer, body].forEach(el => {
            el.classList.toggle("sidebar-open", isOpen);
        });
    
        if (isOpen) {
            // 사이드바가 열릴 때 마진 적용
            mainContent.style.marginLeft = "250px";
            dateContainer.style.marginLeft = "50px";
            todoContainer.style.marginLeft = "50px";
        } else {
            // 사이드바가 닫힐 때 마진 초기화
            mainContent.style.marginLeft = "0";
            dateContainer.style.marginLeft = "0";
            todoContainer.style.marginLeft = "0";
        }
    }
    
    

});
