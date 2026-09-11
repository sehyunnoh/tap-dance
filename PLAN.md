# 탭댄스 스텝 레퍼런스 사이트 — 개발 계획

> 상태: **개발 중** — 1~4단계 완료 (화면 + Level 1~4 데이터, Level 1 확인 완료), 다음: Level 5~7 데이터
> 작성일: 2026-09-10 · 수정: 2026-09-11

---

## 0. 확정된 결정 사항

| 항목 | 결정 |
|---|---|
| 스텝 범위 | **약 300개 전체** (각 레벨의 필수 + 선택 스텝) |
| 난이도 | 원 자료 그대로 **7단계 (Level 1 ~ 7)** |
| 언어 | **사이트 전체 영어** — 화면 문구, 스텝 이름, 설명, 팁 모두 영어 |
| 1차 포함 기능 | 목록·필터·검색·상세 + **영상 느리게 보기 + 구간 반복(A-B 루프) + 좌우 반전(미러) + 메트로놈** |
| 연습 기록 체크 | 1차에서는 **넣지 않음** (나중 후보) |
| 배포 | **GitHub Pages**, 공개 저장소 `sehyunnoh/tap-dance` → `https://sehyunnoh.github.io/tap-dance/` |
| 방문 통계 | **GoatCounter (무료)** — 방문자 수, 국가·지역, 유입 경로, 많이 본 스텝 (Umami 무료 플랜은 사이트 개수 제한에 걸려 변경, 2026-09-11) |
| 와이어프레임 | [v1 디자인 캔버스](https://claude.ai/code/artifact/53487c13-14d1-4fa6-9431-9a667822722a) — 원본 파일은 `wireframes/` 폴더 (검토 중) |
| 사용 방식 | 예전에 탭을 배웠던 사용자가 **Level 1부터 차근차근** 다시 연습 |

---

## 1. 목표

탭댄스를 연습할 때 옆에 띄워두고 참고하는 개인용 레퍼런스 사이트.

- 탭댄스 스텝 약 300개를 **7레벨로 분류**
- 스텝을 클릭하면 **간단한 설명 + 레벨 + 소리 수/카운트 + 유튜브 영상 2~3개**
- 영상은 **느리게 보기, 구간 반복**을 지원해서 따라 하며 연습 가능
- **Level 1부터 순서대로** 따라가기 쉬운 구성
- 연습실에서 **휴대폰으로 보기 편하게** (모바일 우선)

---

## 2. 리서치 결과 요약

### 2.1 참고한 자료
| 자료 | 내용 | 활용 |
|---|---|---|
| [Tap Dance Syllabus (tapdancesyllabus.com)](https://tapdancesyllabus.com/) | 7레벨 구성, 레벨마다 필수(Essential)·선택(Optional) 스텝, 약 300개 | **레벨 분류와 스텝 목록 기준** |
| [United Taps 315 Tap Dictionary](https://unitedtaps.com/315-Tap-Dictionary.html) | 315개 스텝의 영상 해설 사전, 7레벨 구성 | 스텝 목록 교차 검증 |
| [ISTD Tap Syllabus Outline](https://www.istd.org/documents/tap-dance-syllabus-outline/) | 영국 ISTD 급수 체계 | 난이도 교차 검증 |
| [UGA Tap Dance 교재 – Terminology](https://open.online.uga.edu/tapdance/chapter/terminology/) | 용어 정의 | 설명 작성 참고 |
| [Bloch – History of Tap Steps](https://us.blochworld.com/blogs/beyond-the-barre/history-of-our-favorite-tap-steps) | 스텝의 유래 | 짧은 유래 한 줄 |

> ⚠️ 설명 문구는 위 자료를 **그대로 옮기지 않고** 새 문장(영어)으로 씁니다 (저작권).

### 2.2 조사하면서 알게 된 점
- 탭 스텝은 **기본 소리(Toe, Heel, Brush, Step…)를 조합해** 만들어진다.
  예: `Flap = Brush + Step`, `Shuffle = Brush + Spank`, `Maxie Ford = Step + Shuffle + Leap + Toe`
  → 스텝끼리 **선행 스텝 / 다음 단계 스텝**을 연결하면 공부 순서가 자연스럽게 잡힌다.
- 한 스텝이 여러 이름으로 불린다 (예: Pullback = Pick-Up = Grab Off).
  → **별칭(aliases)** 을 저장하고 검색에 반영한다. 화면에도 영어 별칭으로 함께 표시한다.
- **Level 5~7의 선택 스텝** 중 상당수(예: *Maddie Mill, Radiohead, Rorymeister*)는 원 자료에서 만든 **창작 스텝**이다.
  다른 곳에는 영상이나 설명이 거의 없을 수 있다 → 6장의 대응 방법 참고.

---

## 3. 레벨 체계 (7단계)

| 레벨 | 표시 | 성격 | 대표 스텝 |
|---|---|---|---|
| **Level 1** | 🟢 | 입문 — 기본 소리와 첫 조합 | Toe, Heel, Brush, Shuffle, Flap, Cramp Roll, Maxie Ford |
| **Level 2** | 🔵 | 초급 — 클래식 스텝, 첫 타임 스텝 | Scuffle, Pullback, Alexander, Single Time Step |
| **Level 3** | 🟣 | 초중급 — 리프, 타임 스텝 확장, 첫 윙 | Riff, Double/Triple Time Step, Cincinnati, Wings |
| **Level 4** | 🟡 | 중급 — 풀백 조합, 샴샴 | Shim Sham, Nerve Taps, Traveling Time Step, Single Wing |
| **Level 5** | 🟠 | 중상급 — 윙·드로백 심화 | Shiggy Bop, Treadmill, Double Wing, Switching Wing |
| **Level 6** | 🔴 | 상급 — 복합 조합 | Hoofer's Shuffle, Flam, Irish Wing, Same Side Wing |
| **Level 7** | ⚫ | 고급 — 최고 난도 조합 | Frap, Buffalo Wing, Scissor Wing, Five Count Wing |

각 스텝에는 **필수(Essential) / 선택(Optional)** 태그를 붙인다.
Level 1부터 차근차근 연습하신다고 하셨으니, 기본 화면은 **필수 스텝을 먼저** 보여주고 선택 스텝은 필터로 켜서 보게 할 계획이다.

### 3.1 카테고리 (두 번째 필터)
`Basic Sounds` · `Combinations` · `Rolls & Riffs` · `Time Steps` · `Air Steps (Pullback·Wing·Drawback)` · `Turns` · `Classic Steps & Routines`

### 3.2 사이트에 표시할 레벨 이름
Level 1 Beginner · Level 2 Elementary · Level 3 Pre-Intermediate · Level 4 Intermediate · Level 5 Upper-Intermediate · Level 6 Advanced · Level 7 Expert

---

## 4. 스텝 목록 (원 자료 기준, 데이터 작업 때 최종 확정)

> 괄호 안은 별칭. 목록에 적힌 스텝 이름이 그대로 사이트에 표시된다.

### Level 1 🟢
**필수** — Toe (Flat), Heel, Toe Toe Heel Heel (Crawl), Stamp, Stomp, Step, Touch, Toe (Tip), Dig (Heel), Step Heel, Dig Toe (Heel Toe), Dig Toe Step Heel, Hop, Jump, Chug, Brush, Flap, Flap Heel, Flap Ball Change, Spank (Brush Back, Draw, Pull), Spank Step (Back Flap), Spank Step Heel, Spank Step Ball Change, Shuffle, Shuffle Step (Running Shuffle, Leap Shuffles, Jogging Shuffles), Shuffle Ball Change, Buffalo, Cramp Roll, Irish, Maxie Ford, Waltz Clog, Heel Stand, Step Heel Turn, Flap Heel Turn, Slide
**선택** — Clunk, Leap

### Level 2 🔵
**필수** — Hop Shuffle, Shuffle Heel, Scuff, Double Buffalo, Double Cramp Roll (Flap Cramp Roll), Double Irish (v1), Irish Flap, Double Maxie Ford, Double Waltz Clog, Alexander (Broadway, Shirley Temple, Manhattan), Back Essence, Flap Heel Heel, Bombershay Modern (Bombershe, Toe Clip), Drawback, Pullback (Pull, Grab Off, Pick-Up), Scuffle (Dig Brush, Dig Spank, Paddle), Scuffle Step (Paddles), Scuffle Step Heel (Paddle and Roll, Paradiddle), Scuffle Ball Change, Buck Single Time Step, Traditional Single Time Step, Buffalo Turn, Step Irish Turn, Step Toe Hop Turn, In and Out Pullback (Jumping Jack Pullback), Toe Stand, Slap
**선택** — Bombershay Broadway, Clicks (Toe & Heel), Crossing Pullback, Heel Stand Turn, Jump Click, Leap Heel, Smack, Slam, Travel Step

### Level 3 🟣
**필수** — Shuffle Step Heel, Double Shuffle, Double Irish (v2), Alternating Cramp Roll (Around the World, Trading), Pendulum Shuffle, Double Scuffle, Double Scuffle Step Heel, Double Back Essence, Traditional Double Time Step, Traditional Triple Time Step, Buck Double Time Step, Buck Triple Time Step, Cincinnati, Single Pullback (One-Foot Pullback), Trenches (Hoofer & Broadway Style), Riff, 3-Beat Riff Walk (Slam, Flam, Slurp, Third), 4-Beat Riff Walk, 5-Beat Riff Walk, Maxie Ford Turn, Stamp Cramp Roll Turn, Double Pullback, Wings
**선택** — Boomerang, Double Flap, Scuff Dig Ball Change, Single Heel Stand, Skipping Pullback, Step Heel Heel

### Level 4 🟡
**필수** — Triple Cramp Roll (Shuffle Cramp Roll), Irish Pullback, Double Toe Stand, Toe Stand Turn, Nerve Taps, Switching Pullback (Swapping, Alternating), Maxie Ford Pullback, Double Maxie Ford Pullback, Shuffle Pullback Ball Change, Waltz Clog Pullback, Double Waltz Clog Pullback, Shuffle Pullback, Over The Top, Shim Sham, Step Riff Heel (Hop/Leap Riff Heel), 6-Beat Riff Walk, 7-Beat Riff Walk, 8-100 Beat Riff Walk, Riffle, Riffle Step, Hines Riff (Split Riff), Stamp Step Riff Heel Turn, Stamp Step Toe Heel Turn, Paddle Turn, Traditional Quadruple Time Step, Buck Quadruple Time Step, Single / Double / Triple / Quadruple Traveling Time Step, Crossing Wing, Single Wing (One Foot Wing)
**선택** — Backwards Cramp Roll, Cramprolet, Cramp Roll Time Step, Criss Cross Cramp Roll, Dig Slide, Flap Step Ball Change, Heel Grind Time Step, Hop Scuffle, Maxie Ford Clunk, Penguin, Scap, Scuff Dig Toe, Scuffle Dig Toe, Scuffle Step Turn, Single Heel Stand Turn, Single Toe Stand, Single Toe Stand Turn, Spank Toe Step, Spots, Stamp Roll

### Level 5 🟠
**필수** — Shuffle Dig Toe, Shuffle Toe Step, Riffle Step Heel, Double Buffalo Toe, Double Flap Cramp Roll, Triple Double Cramp Roll, Irish Pullback Flap, Irish Pullback Flap Heel, Maxie Ford Toe, Double Maxie Ford Toe, Buffalo Pullback, Double Heel Stand, Shiggy Bop (Shovel, Heel Slide), Crossing Drawback, Double Drawback, Triple Drawback, Scuff Heel Step, Switching Pullback Toe, Treadmill, Pullback Toe, Dwing, Swing, Twing, Single Wing Toe, Double Wing (Separated, Staggered, Alternating), Switching Wing, Traveling Pendulum Shuffle, Shuffle Flap, Shuffle Toe Toe Step
**선택** — Alexander Clunk, Backwards Wing, Click Buffalo, Double Cincinnati, Drawback Heel, Dub Dub Dig Toe, Heelo, Jordan Pullback, Jumper, Lopsided Cramp Roll, Maddie Mill, Radiohead, Rod Roll, Scuffaloeo, Scuffle Toe Slap Heel, Shayberbom, Shuffle Ball Change Heel, Spat, Spear, Spiel, Toe Stand Shuffle Step, Tori, Twister

### Level 6 🔴
**필수** — Shuffle Dig Step Shuffle Toe Step, Shuffle Toe Pullback Ball Change, Double Toe Buffalo, Double Buffalo Toe Pullback, Riffle Cramp Roll, Irish Shiggy Bop (Irish Shovel), Irish Wing, Double Maxie Ford Toe Pullback, Double Toe Maxie Ford, Double Waltz Clog Toe Pullback, Hop Riffle, Pendulum Riffle, Riffle Dig Toe, Bombershay Toe, Shuffle Pullback Heel, Flam, Hoofer's Shuffle, Shuffle Heel Step, Double Pullback Toe, Switching Pullback Flap, Single Wing Heel Toe, Switching Wing Toe, Wing Toe, Same Side Wing
**선택** — Annalisa's 8-beat Riff Walk, Bam Bam, Blur, Clapull, Clunker, Ditto, Dodo, Drawbershay, Farmer, Flabbergast, Hit, Jackhammer, Jimmy, Jinnyshay, Megamines Cramp Roll, Nicaela Quick, Rise, Scopper, Scout, Scuffit, Scuffout, Shay Roll, Shuffle Heel Step Heel, Shunk, Skunk, Spackle, Squiggly Wiggly, Steel, Stephunky, Sugar Bop, Swiffle (Tessa Backdraw), Toto, Tucker

### Level 7 ⚫
**필수** — Hop Shuffle Hop Scuffle Hop Riffle Hop Stomp Spank, Step Riff Brush Heel, Toe Dig Bombershay, Drawback Flam, Switching Pullback Flap Heel Toe, Treadmill Heel, Buffalo Wing, Maxie Ford Wing, Double Waltz Clog Wing, Frap, Frap Cramp Roll, Scuffle Pullback, Buffalo Scuffle, Irish Pullback Heel Flap Heel, Single Pullback Toe, Irish Pullback Toe Flap, Hot Toe, Waltz Clog Scuffle, Scuff Front, Double Scuff Front, Frapback, Cincinnati Flam, Joe Toe Pull, Pullback Dig Toe, 3 Sound Pullback, Pullback Shuffle Step, Single Pullback Opposite Toe, Switching Toe Pullback, Pendulum Wing, Scissor Wing, Five Count Wing, Five Count Single Wing, Heel Flam, Jump Flam
**선택** — Baloney, Brittanyshay, Broken Riff, Clickety Clank, Click Pullback, Click Wing, Drawman, Faluffalo, Maddalo, Riff Raff, Rooster, Rorymeister, Ruffle, Sh-sh-sh-shuffle, Sloppy Joe, Teeler, Toe Stand Wing, Toro

---

## 5. 기능

### 5.1 1차 개발 범위
1. **스텝 목록 화면**
   - Level 1 → 7 순서로 섹션 구성, 섹션마다 스텝 카드 나열
   - 카드에는 스텝 이름(영어), 레벨 배지, 필수/선택 태그, 카테고리, 소리 수
   - **필터**: 레벨, 카테고리, 필수/선택
   - **검색**: 스텝 이름 + 별칭 (예: "pick up"을 검색해도 Pullback이 나옴)
2. **스텝 상세 화면**
   - 이름 / 별칭 / 레벨 / 필수·선택 / 카테고리
   - **설명** (영어 2~4문장)
   - **동작 순서** (예: `Brush → Spank`)와 **카운트** (예: `& 1`)
   - **연습 팁 / 흔한 실수** 1~2줄
   - **유튜브 영상 2~3개** + 아래의 연습용 플레이어 기능
   - **선행 스텝 / 다음 단계 스텝** 링크
   - 같은 레벨의 **이전 / 다음 스텝** 버튼 → Level 1부터 순서대로 넘겨보기
   - URL로 바로 열 수 있음 (`…/tap-dance/#/steps/maxie-ford`)
3. **연습용 영상 플레이어** ⭐ (YouTube IFrame Player API 사용)
   - **속도 조절**: 0.25x / 0.5x / 0.75x / 1x 버튼
   - **구간 반복 (A-B 루프)**: 원하는 지점에서 `A` 버튼과 `B` 버튼을 누르면 그 구간만 계속 반복. `해제` 버튼으로 끄기
   - **되감기·빨리 감기**: ±5초 버튼
   - **좌우 반전(미러)** 🪞: 버튼 하나로 영상을 거울처럼 뒤집어, 강사와 마주 보고 따라 하기 편하게 (마지막 설정 기억)
   - 모바일에서도 누르기 쉬운 큰 버튼
   - (선택) 스텝마다 **"핵심 구간" 추천 시작·끝 시점**을 데이터에 넣어 두면 버튼 하나로 바로 그 구간 반복
4. **메트로놈** 🥁
   - 상세 화면에 붙어 있는 작은 메트로놈 (Web Audio API로 박자를 정확하게 맞춤)
   - BPM 조절 (슬라이더 + ±5 버튼 + 탭 템포), 시작/정지
   - 4박 기준으로 첫 박에 강세, 8분음표(`&`) 표시 켜고 끄기
   - 스텝마다 **추천 연습 BPM**을 데이터에 넣어 두고 "느리게 → 보통" 버튼으로 바로 설정
   - 화면을 옮겨도 계속 울리도록 (하단 고정 바)
5. **모바일 우선 반응형**
6. **방문 통계 (GoatCounter)** 📊 — 자세한 내용은 7.3
   - 기본 집계: 방문자 수, 페이지뷰, 국가·지역·도시, 유입 경로(어느 사이트에서 왔는지), 기기·브라우저·OS, 많이 본 페이지(스텝)
   - 추가 이벤트: 영상 재생, 속도 변경, 구간 반복, 미러, 메트로놈 사용, 검색어
     → "어떤 스텝이 인기인지", "연습 기능이 실제로 쓰이는지"를 볼 수 있음

### 5.2 나중에 추가할 기능 (후보)
- ✅ 연습 상태 체크 ("배우는 중 / 익힘", 레벨별 진행률)
- 🗺 학습 로드맵 뷰 (선행 관계 흐름도)
- 🌙 다크 모드

---

## 6. 영상과 설명 자료 모으기

300개 × 영상 2~3개 = **영상 최대 900개**를 찾아야 하므로, 이 작업이 가장 큽니다.

1. **수집**: 레벨별로 나눠 여러 에이전트가 동시에 조사
   - 스텝마다 `"<step name> tap dance tutorial"` 검색 → 튜토리얼 성격의 영상 2~3개 선택
   - 가능하면 **튜토리얼 1개 + 느린 시범 1개 + 활용 예시 1개**로 구성
2. **자동 검증**: YouTube oEmbed(`https://www.youtube.com/oembed?url=...`, API 키 불필요)로
   - 영상이 **존재하는지**, **사이트 안에서 재생이 허용되는지** 확인
   - 영상 제목과 채널명을 자동으로 기록
   - 검증 스크립트는 저장해 두고, 나중에 영상이 사라지면 다시 돌려서 찾아냄
3. **자료가 적은 창작 스텝 대응** (주로 Level 5~7 선택 스텝)
   - 영상이 1개뿐이거나 없으면 → 있는 만큼만 넣고 **"YouTube에서 더 찾아보기"** 링크를 항상 표시
   - 동작 설명을 확인할 수 없으면 → 추측해서 쓰지 않고 **"설명 준비 중"** 으로 표시 (틀린 설명보다 나음)
4. **로딩 속도**: 처음엔 썸네일만 보여주고, 누르면 플레이어를 불러옴

---

## 7. 기술 구성

| 항목 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | **Vite + React + TypeScript** | 가볍고 빠름, 필터·검색·플레이어 UI 만들기 편함 |
| 스타일 | **Tailwind CSS** | 반응형·모바일 레이아웃을 빠르게 |
| 라우팅 | React Router **HashRouter** (`#/steps/:id`) | GitHub Pages에서 새로고침해도 404가 나지 않음 |
| 영상 | **YouTube IFrame Player API** | 속도 조절(`setPlaybackRate`), 구간 반복(`seekTo`) 제어 |
| 데이터 | `src/data/steps/level-1.json` ~ `level-7.json` | 레벨별로 파일을 나눠 관리·수정이 쉬움 |
| 검색 | 간단한 자체 검색 (필요하면 Fuse.js) | 오타 허용 |
| 저장 | localStorage | 연습 상태 등 개인 기록 |
| 배포 | **GitHub Pages + GitHub Actions** | `main`에 push하면 자동으로 빌드·배포 |
| 방문 통계 | **GoatCounter** | 무료, 쿠키 없이 개인정보를 수집하지 않아 동의 배너가 필요 없음, 스크립트 한 줄로 설치 |

### 7.1 GitHub Pages 배포
- 이 PC에 `gh`가 **`sehyunnoh`** 계정으로 로그인되어 있고, `repo`·`workflow` 권한이 있음 → 여기서 바로 저장소 생성·배포 가능
- 저장소: `sehyunnoh/tap-dance` (현재 없음 → 새로 생성)
- 주소: **`https://sehyunnoh.github.io/tap-dance/`**
- Vite 설정에 `base: '/tap-dance/'` 지정
- `.github/workflows/deploy.yml`: push → `npm ci` → `npm run build` → Pages 배포
- 무료 계정은 GitHub Pages를 쓰려면 **공개(Public) 저장소**여야 함 → **공개로 확정**

### 7.3 방문 통계 — GoatCounter
- **변경 이유**: Umami Cloud 무료 플랜의 사이트 개수 제한에 걸림 (이미 다른 사이트 등록됨) → GoatCounter로 변경 (2026-09-11)
- **플랜**: goatcounter.com 무료 — 개인·소규모 사이트의 "적당한 사용량"은 무료
- **대시보드**: `https://<코드>.goatcounter.com` 에 로그인하면 방문자, 국가, 유입 경로, 페이지별 조회수를 볼 수 있음
- **설치**: `src/lib/analytics.ts`가 배포 주소(`sehyunnoh.github.io`)에서만 `https://gc.zgo.at/count.js`를 불러옴
  - 코드는 GitHub 저장소 변수 `GOATCOUNTER_CODE` → 빌드 때 `VITE_GOATCOUNTER_CODE`로 들어감. 비어 있으면 통계 꺼짐
  - 내 PC(localhost)에서 연 것은 집계되지 않음
  - 해시 주소(`#/steps/maxie-ford`)는 기본 설정으로는 안 잡히므로, 라우터가 바뀔 때마다 `pageview()`로 직접 집계 (`App.tsx`의 `PageviewTracker`)
  - 사이트 코드는 원래 페이지 소스에 공개되는 값이라 공개 저장소에 올려도 문제없음
- **이벤트 추적**: `track(이름, 데이터)` — GoatCounter 이벤트는 이름과 제목만 있고 대시보드가 이름별로 묶으므로, 데이터를 이름에 붙여 보냄
  - 예: `speed-change · rate=0.5`, `video-play · step=maxie-ford video=…`, `metronome-start · bpm=80`, `search · q=pullback results=3`
  - 스크립트가 차단되어도(광고 차단기 등) 사이트는 정상 동작하도록 처리
- **사용자가 직접 할 일** (계정 가입이라 대신할 수 없음)
  1. [goatcounter.com/signup](https://www.goatcounter.com/signup) 가입 — 사이트 코드(예: `tapdance`) 정하기
  2. 정한 **코드**를 알려주기 → 저장소 변수 `GOATCOUNTER_CODE`에 넣고 다시 배포

### 7.4 개발 PC 환경
- Node v24, npm 11, git, gh (로그인됨) — 모두 설치되어 있음

### 7.5 폴더 구조 (예정)
```
tap-dance/
├─ PLAN.md
├─ .github/workflows/deploy.yml
├─ scripts/
│  └─ verify-videos.ts         # oEmbed로 영상 존재·임베드 여부 검증
├─ src/
│  ├─ data/
│  │  ├─ steps/level-1.json … level-7.json
│  │  ├─ levels.ts             # 7레벨 정의 (이름, 색, 설명)
│  │  └─ categories.ts
│  ├─ components/
│  │  ├─ StepCard.tsx
│  │  ├─ LevelBadge.tsx
│  │  ├─ FilterBar.tsx
│  │  ├─ SearchBox.tsx
│  │  ├─ PracticePlayer.tsx    # 속도 조절·A-B 루프·미러 플레이어
│  │  └─ Metronome.tsx         # Web Audio 메트로놈
│  ├─ lib/
│  │  └─ analytics.ts          # GoatCounter 페이지뷰·이벤트 추적 (pageview, track)
│  ├─ pages/
│  │  ├─ StepListPage.tsx
│  │  └─ StepDetailPage.tsx
│  └─ App.tsx
├─ vite.config.ts
└─ package.json
```

### 7.6 스텝 데이터 형식 (예시)
```json
{
  "id": "maxie-ford",
  "name": "Maxie Ford",
  "aliases": [],
  "level": 1,
  "essential": true,
  "category": "classic",
  "sounds": 5,
  "count": "& 1 & a 2",
  "bpm": { "slow": 60, "normal": 100 },
  "breakdown": ["Step", "Shuffle", "Leap", "Toe"],
  "description": "A classic traveling step: step on one foot, shuffle the other, leap onto the shuffling foot, then tap the opposite toe behind.",
  "tips": ["Keep the leap light: a quick transfer of weight, not a big jump", "Make the final toe tap crisp, just behind the landing foot"],
  "trivia": "Named after the dancer Maxie Ford (early 1900s).",
  "prerequisites": ["step", "shuffle", "leap", "toe-tip"],
  "nextSteps": ["double-maxie-ford", "maxie-ford-turn", "maxie-ford-pullback"],
  "videos": [
    { "youtubeId": "xxxxxxxxxxx", "title": "(자동 기록)", "channel": "(자동 기록)", "type": "tutorial", "loop": { "start": 42, "end": 58 } },
    { "youtubeId": "yyyyyyyyyyy", "title": "(자동 기록)", "channel": "(자동 기록)", "type": "demo" }
  ],
  "status": "complete"
}
```
- `status`: `complete` / `no-video` / `description-pending` — 자료가 부족한 스텝 표시용

---

## 8. 진행 순서

Level 1부터 연습하신다고 하셨으니 **Level 1을 가장 먼저 완성해서 배포**하고, 이후 레벨을 차례로 추가합니다.

| 단계 | 작업 | 결과물 |
|---|---|---|
| **1** | 프로젝트 세팅 + GitHub 저장소 생성 + 자동 배포 설정 + 방문 통계(GoatCounter) 연결 | 빈 사이트가 `sehyunnoh.github.io/tap-dance`에 뜨고 방문이 GoatCounter에 집계됨 |
| **2** | 화면 개발: 목록·필터·검색·상세·연습용 플레이어(속도·A-B 루프·미러)·메트로놈 | 동작하는 사이트 틀 |
| **3** | **Level 1 데이터** (설명·팁·영상 수집·검증) | Level 1 완성 → **배포, 확인 요청** |
| **4** | Level 2~4 데이터 | 순서대로 추가·배포 |
| **5** | Level 5~7 데이터 (창작 스텝은 자료가 있는 만큼) | 전체 약 300개 |
| **6** | 전체 영상 재검증, 모바일 점검, 다듬기 | 최종 버전 |

> 3단계가 끝나면 한 번 보여드리고, 설명 방식이나 영상 고르는 기준이 괜찮은지 확인받은 뒤 나머지 레벨에 똑같이 적용하겠습니다.

---

## 9. 질문 답변 기록

| 질문 | 답변 |
|---|---|
| 스텝 범위 | 약 300개 전체 |
| 레벨 단계 | 원 자료대로 7단계 |
| 언어 | 사이트 전체 영어 (화면 문구·설명·팁 포함) |
| 1차 추가 기능 | 느리게 보기, 구간 반복, 좌우 반전(미러), 메트로놈 |
| 배포 | GitHub Pages, 공개 저장소 `sehyunnoh/tap-dance` |
| 연습 기록 체크 | 1차 제외 |
| 사용자 수준 | 예전에 배운 적 있음 → Level 1부터 다시 연습 |
| 방문 통계 | ~~Umami Cloud~~ → GoatCounter 무료 (Umami 사이트 개수 제한) + 연습 기능 사용 이벤트 추적 |

남은 질문 없음.
**사용자가 준비할 것**: GoatCounter 가입 후 사이트 코드 전달 (7.3 참고).
