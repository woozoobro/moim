-- Dev seed: 4 mock events owned by the current user.
-- Images are served from /public/*-meetup.png in the Next.js app.
insert into public.events
  (id, owner_id, title, description, starts_at, location, host_name, image_url)
values
  (
    'mockFutsal',
    '1b9a83fe-d622-4200-97aa-09717d9868e9',
    '주말 풋살 — 같이 뛸 사람!',
    '초보 환영! 팀 나눠서 미니게임 진행합니다. 조끼·공 준비해요. 끝나고 근처에서 치맥도 같이!',
    '2026-04-26T19:00:00+09:00',
    '서울 마포 풋살장',
    '김풋살',
    '/football-meetup.png'
  ),
  (
    'mockBoardG',
    '1b9a83fe-d622-4200-97aa-09717d9868e9',
    '금요일 밤 보드게임 모임',
    '카탄·스플렌더·세븐원더스까지. 규칙 몰라도 다 알려드려요. 음료·스낵 포함!',
    '2026-04-30T19:30:00+09:00',
    '합정 보드게임 카페',
    '보드마스터 정',
    '/boardgame-meetup.png'
  ),
  (
    'mockFlower',
    '1b9a83fe-d622-4200-97aa-09717d9868e9',
    '5월의 꽃 원데이 클래스',
    '계절 꽃 한 다발 만들어 가는 2시간 클래스. 재료비 포함, 초보 OK.',
    '2026-05-08T14:00:00+09:00',
    '성수동 플라워 스튜디오',
    '플로리스트 유',
    '/flower-meetup.png'
  ),
  (
    'mockDevMtg',
    '1b9a83fe-d622-4200-97aa-09717d9868e9',
    '개발자 사이드 프로젝트 데모 나이트',
    '주말에 만든 토이 프로젝트 5분씩 공유. 피드백 주고받아요. 피자 쏩니다!',
    '2026-05-15T19:00:00+09:00',
    '강남 커뮤니티 라운지',
    '데브 네트워크',
    '/dev-meetup.png'
  )
on conflict (id) do nothing;
