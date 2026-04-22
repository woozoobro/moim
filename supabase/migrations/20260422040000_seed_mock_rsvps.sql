-- Dev seed: realistic RSVP participation across mock events and the existing live event.
insert into public.rsvps (event_id, name, email) values
  -- 주말 풋살 (8명)
  ('mockFutsal', '김지훈', 'jihoon.kim@gmail.com'),
  ('mockFutsal', '박민준', 'minjun.park@kakao.com'),
  ('mockFutsal', '정도윤', 'doyun.jeong@outlook.com'),
  ('mockFutsal', '조하준', 'hajoon.cho@gmail.com'),
  ('mockFutsal', '장예준', 'yejun.jang@kakao.com'),
  ('mockFutsal', '한건우', 'geonwoo.han@naver.com'),
  ('mockFutsal', '서현우', 'hyunwoo.seo@kakao.com'),
  ('mockFutsal', '황준서', 'junseo.hwang@gmail.com'),

  -- 금요일 밤 보드게임 (6명)
  ('mockBoardG', '이서연', 'seoyeon.lee@naver.com'),
  ('mockBoardG', '강지우', 'jiwoo.kang@naver.com'),
  ('mockBoardG', '윤시우', 'siwoo.yoon@naver.com'),
  ('mockBoardG', '임수빈', 'subin.lim@gmail.com'),
  ('mockBoardG', '오지민', 'jimin.oh@gmail.com'),
  ('mockBoardG', '신예은', 'yeeun.shin@gmail.com'),

  -- 5월의 꽃 원데이 클래스 (4명, 소규모)
  ('mockFlower', '최수아', 'sooah.choi@gmail.com'),
  ('mockFlower', '안유진', 'yujin.an@kakao.com'),
  ('mockFlower', '송민서', 'minseo.song@naver.com'),
  ('mockFlower', '홍예린', 'yerin.hong@naver.com'),

  -- 개발자 데모 나이트 (12명, 인기)
  ('mockDevMtg', '김지훈', 'jihoon.kim@gmail.com'),
  ('mockDevMtg', '박민준', 'minjun.park@kakao.com'),
  ('mockDevMtg', '전지호', 'jiho.jeon@gmail.com'),
  ('mockDevMtg', '배현서', 'hyeonseo.bae@gmail.com'),
  ('mockDevMtg', '노이서', 'iseo.noh@naver.com'),
  ('mockDevMtg', '유준혁', 'junhyuk.yoo@kakao.com'),
  ('mockDevMtg', '남하린', 'harin.nam@gmail.com'),
  ('mockDevMtg', '문채원', 'chaewon.moon@naver.com'),
  ('mockDevMtg', '백도현', 'dohyun.baek@gmail.com'),
  ('mockDevMtg', '허지안', 'jian.heo@kakao.com'),
  ('mockDevMtg', '구서윤', 'seoyoon.gu@naver.com'),
  ('mockDevMtg', '고은우', 'eunwoo.go@gmail.com')
on conflict (event_id, email) do nothing;
