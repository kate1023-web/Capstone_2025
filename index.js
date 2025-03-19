document.addEventListener("DOMContentLoaded", function () {
    const currentDateElement = document.getElementById("current-date");
    const calendarBtn = document.getElementById("calendar-btn");
    const datePicker = document.getElementById("date-picker");
    const calendarPopup = document.getElementById("calendar-popup");
    const closeCalendar = document.getElementById("close-calendar");

    // 오늘 날짜 표시
    function updateDateDisplay(date) {
        const formattedDate = date.getFullYear() + "년 " + 
                              (date.getMonth() + 1) + "월 " + 
                              date.getDate() + "일";
        currentDateElement.textContent = formattedDate;
    }

    // 초기 날짜 설정
    const today = new Date();
    updateDateDisplay(today);

    // 달력 버튼 클릭 시 날짜 선택기 열기
    calendarBtn.addEventListener("click", function () {
        datePicker.showPicker();  // 📌 기본 UI 열기 (모바일 & 일부 브라우저 호환)
    });

    // 날짜 선택 시 업데이트
    datePicker.addEventListener("change", function () {
        if (this.value) {
            const selectedDate = new Date(this.value);
            updateDateDisplay(selectedDate);
        }
    });
});
