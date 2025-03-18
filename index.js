document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.getElementById("close-btn");
    const currentDate = document.getElementById("current-date");
    const calendarBtn = document.getElementById("calendar-btn");
    const datePicker = document.getElementById("date-picker");
    const calendarPopup = document.getElementById("calendar-popup");
    const closeCalendar = document.getElementById("close-calendar");

    // 메뉴 열기
    menuToggle.addEventListener("click", function () {
        sidebar.style.left = "0";
    });

    // 메뉴 닫기
    closeBtn.addEventListener("click", function () {
        sidebar.style.left = "-250px";
    });

    // 날짜 변경 기능
    calendarBtn.addEventListener("click", function () {
        datePicker.style.display = "block";
        datePicker.showPicker();
    });

    datePicker.addEventListener("change", function () {
        currentDate.textContent = this.value;
        datePicker.style.display = "none";
    });

    // 오늘 날짜 표시
    function updateDate() {
        const today = new Date();
        const formattedDate = today.getFullYear() + "년 " + (today.getMonth() + 1) + "월 " + today.getDate() + "일";
        currentDate.textContent = formattedDate;
    }
    updateDate();

    // 달력 버튼 클릭 시 팝업 열기
    calendarBtn.addEventListener("click", function () {
        calendarPopup.style.display = "block";
    });

    // 날짜 선택 시 화면에 표시하고 팝업 닫기
    datePicker.addEventListener("change", function () {
        const selectedDate = new Date(this.value);
        const formattedDate = selectedDate.getFullYear() + "년 " + (selectedDate.getMonth() + 1) + "월 " + selectedDate.getDate() + "일";
        currentDate.textContent = formattedDate;
        calendarPopup.style.display = "none";
    });

    // 닫기 버튼 클릭 시 팝업 닫기
    closeCalendar.addEventListener("click", function () {
        calendarPopup.style.display = "none";
    });
});
