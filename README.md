# Capstone_2025
2025년 1학기 캡스톤 디자인 프로젝트
</br>
진행자 : 조윤정
</br>
학교 / 학과 : 경성대학교 소프트웨어학과 4학년

<h6>프로젝트명</h6>
투두리스트 애플리케이션

<h6>개발 목적</h6>
일정과 할 일을 효과적으로 관리할 수 있는 앱을 개발하여 사용자에게 편리한 경험을 제공

<h6>주요 기능</h6>
- 여행 및 일정 템플릿 제공
- 시간표 기능
- 오프라인 지원 및 파일 저장
- 테마별 일정 관리
- 반복 일정 및 자동완성 기능
- 메모 추가 기능
- 미니 위젯 스타일 UI
- 타임 블로킹 및 드래그 앤 드롭
- 날짜마다 리스트 갱신

<h6>사용자 타겟</h6>
대학생, 직장인 등 일정 관리가 필요한 사람

<h6>핵심 요구사항</h6>
직관적인 UI/UX
오프라인에서도 일정 관리 가능
MySQL과 연동하여 일정 데이터 저장 및 관리

프론트엔드: HTML, CSS, JavaScript
백엔드: Node.js (Express)
데이터베이스: MySQL
추가 기술: PWA(오프라인 지원), IndexedDB(로컬 저장), Drag & Drop 라이브러리

<h6>연구 일정</h6>
25.03.05 ~ 25.03.15 : 요구사항 정리 및 핵심 기능 확정 | 와이어프레임 및 디자인 제작 | HTML, CSS, JS로 프론트엔드 기본 구조 만들기
25.03.16 ~ 25.04.01 : MySQL 기본 테이블 설계 (복잡한 기능 빼고 최소한의 데이터 구조) | 간단한 API (예: 일정 추가, 조회) 구현 연습 | 프론트엔드에서 API 호출하는 기능 테스트
25.04.02 ~ 25.04.15 : 일정 CRUD (생성, 조회, 수정, 삭제) 기능 개발 | 로컬스토리지나 IndexedDB 활용해서 백엔드 없이도 일정 저장하는 기능 추가 (오프라인 지원 대비) | 로그인 기능 간단하게 구현 (JWT 또는 세션 방식)
25.04.16 ~ 25.05.01 : 버그 수정 및 성능 개선 | 발표 자료 정리 & 시연 준비

<h6>기대 효과</h6>
사용자의 일정 관리 효율성 향상
직관적인 UI로 편리한 경험 제공
오프라인 지원으로 활용성 증가
