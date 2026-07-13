//fable 5 max
import { useState, useEffect } from "react";

/* ================================================================
   AWS DVA-C02 · Elastic Beanstalk 완전 정리 (강의 185–197, 실습 제외)
   - 배포 정책 6종 인터랙티브 시뮬레이터가 핵심 시그니처
   - 색 의미: v1 = 파랑 / v2 = 초록 / 교체 중 = 앰버 / 종료 = 회색
   ================================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.eb-root{
  --bg:#0F1317; --panel:#161C22; --panel2:#1B232B; --line:#28323D; --line2:#39434F;
  --ink:#E9EEF3; --muted:#96A6B5; --dim:#69798A;
  --amber:#FFB454; --amberDim:rgba(255,180,84,.12);
  --v1:#58A6FF; --v1Dim:rgba(88,166,255,.14);
  --v2:#3ECF8E; --v2Dim:rgba(62,207,142,.14);
  --warn:#F2C14E; --danger:#F17878; --dangerDim:rgba(241,120,120,.12);
  --code:#0C1116;
  background:var(--bg); color:var(--ink);
  font-family:'IBM Plex Sans KR',system-ui,-apple-system,sans-serif;
  min-height:100vh; font-size:15px; line-height:1.75; letter-spacing:-0.01em;
  -webkit-font-smoothing:antialiased;
}
.eb-root *{box-sizing:border-box; margin:0; padding:0}
.eb-root button{font:inherit; color:inherit; background:none; border:none; cursor:pointer}
.eb-root button:focus-visible{outline:2px solid var(--amber); outline-offset:2px; border-radius:8px}
.mono{font-family:'IBM Plex Mono',ui-monospace,monospace}

.wrap{max-width:920px; margin:0 auto; padding:0 20px}

/* ---------- 헤더 & 탭 ---------- */
.hdr{position:sticky; top:0; z-index:60; background:rgba(15,19,23,.9); backdrop-filter:blur(10px); border-bottom:1px solid var(--line)}
.hdr-in{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0}
.hdr-title{font-weight:700; font-size:15px; letter-spacing:-.02em; white-space:nowrap}
.hdr-sub{font-size:10.5px; color:var(--dim); letter-spacing:.14em}
.tabs{display:flex; gap:6px; overflow-x:auto; padding:0 0 10px; scrollbar-width:thin; scrollbar-color:var(--line2) transparent}
.tabs::-webkit-scrollbar{height:6px}
.tabs::-webkit-scrollbar-thumb{background:var(--line2); border-radius:3px}
.tabbtn{flex:0 0 auto; text-align:left; border:1px solid transparent; border-radius:10px; padding:7px 12px 8px; color:var(--muted); transition:all .15s ease}
.tabbtn:hover{color:var(--ink); background:rgba(255,255,255,.03)}
.tabbtn.active{color:var(--ink); border-color:var(--line2); background:var(--panel)}
.tabbtn .tno{font-size:10px; color:var(--dim); letter-spacing:.08em; display:block; line-height:1.4}
.tabbtn .tname{font-size:13.5px; font-weight:500; display:block; line-height:1.5}
.tabbtn .tstars{font-size:10px; color:var(--amber); letter-spacing:.1em; display:block; line-height:1.6}
.tabbtn.active .tno{color:var(--amber)}

/* ---------- 타이포 ---------- */
.eyebrow{font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--amber); letter-spacing:.16em; font-weight:500}
.h1{font-size:31px; font-weight:700; letter-spacing:-.035em; line-height:1.3}
.h2{font-size:20px; font-weight:700; letter-spacing:-.025em; line-height:1.4}
.h3{font-size:15.5px; font-weight:700; letter-spacing:-.02em}
.lead{color:var(--muted); font-size:15px}
.small{font-size:13px; color:var(--muted)}
.tiny{font-size:12px; color:var(--dim)}

/* ---------- 패널·칩 ---------- */
.panel{background:var(--panel); border:1px solid var(--line); border-radius:14px}
.panel2{background:var(--panel2)}
.plab{font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--dim); letter-spacing:.14em; text-transform:uppercase}
.chip{display:inline-flex; align-items:center; gap:6px; border:1px solid var(--line2); border-radius:999px; padding:3px 11px; font-size:12.5px; color:var(--muted); background:rgba(255,255,255,.02)}
.chip.hot{border-color:var(--amber); color:var(--amber); background:var(--amberDim)}
.lect{font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--dim); border:1px solid var(--line); border-radius:6px; padding:2px 7px; letter-spacing:.06em}
.stars{font-family:'IBM Plex Mono',monospace; color:var(--amber); letter-spacing:.12em; font-size:12px}
.note{border-left:3px solid var(--amber); background:var(--amberDim); border-radius:0 10px 10px 0; padding:12px 16px; font-size:13.5px}
.warnbox{border-left:3px solid var(--danger); background:var(--dangerDim); border-radius:0 10px 10px 0; padding:12px 16px; font-size:13.5px}
.code{display:block; background:var(--code); border:1px solid var(--line); border-radius:10px; padding:14px 16px; font-family:'IBM Plex Mono',monospace; font-size:12.5px; line-height:1.8; overflow-x:auto; color:#C6D4E1; white-space:pre}
.kv{display:flex; gap:10px; align-items:baseline}
.kv .k{font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--dim); min-width:78px; letter-spacing:.06em}

/* ---------- 표 ---------- */
table.cmp{width:100%; border-collapse:collapse; font-size:13px}
table.cmp th{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.1em; color:var(--dim); text-align:left; padding:9px 10px; border-bottom:1px solid var(--line2); white-space:nowrap}
table.cmp td{padding:10px; border-bottom:1px solid var(--line); vertical-align:top}
table.cmp tr:last-child td{border-bottom:none}
.dots{font-family:'IBM Plex Mono',monospace; letter-spacing:.1em; color:var(--amber); white-space:nowrap}
.dots .off{color:var(--line2)}

/* ---------- 다이어그램 공통 ---------- */
.dbox{border:1px solid var(--line2); border-radius:10px; padding:8px 14px; text-align:center; font-size:13px; background:var(--panel2)}
.dbox .dl{font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--dim); letter-spacing:.1em; display:block}
.arrow{color:var(--dim); font-size:15px; flex:0 0 auto}
.flow{display:flex; align-items:center; gap:10px; flex-wrap:wrap}
.grid2{display:grid; grid-template-columns:1fr 1fr; gap:14px}
.grid3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px}

/* ---------- 시뮬레이터 ---------- */
.inst{width:46px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; border:1px solid var(--line2); transition:all .35s ease}
.inst.v1{background:var(--v1Dim); border-color:var(--v1); color:var(--v1)}
.inst.v2{background:var(--v2Dim); border-color:var(--v2); color:var(--v2)}
.inst.up{background:rgba(242,193,78,.1); border-color:var(--warn); color:var(--warn); animation:ebpulse 1.1s ease-in-out infinite}
.inst.ln{background:transparent; border:1px dashed var(--v2); color:var(--v2); animation:ebpulse 1.5s ease-in-out infinite}
.inst.tm{background:transparent; border-color:var(--line2); color:var(--dim); opacity:.5}
.inst.gh{opacity:0; pointer-events:none}
@keyframes ebpulse{0%,100%{opacity:1}50%{opacity:.4}}
.grp{border:1px solid var(--line2); border-radius:12px; padding:10px 12px 12px; background:rgba(255,255,255,.015); min-width:128px}
.grp.dashed{border-style:dashed; background:transparent}
.grp .gname{font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--muted); letter-spacing:.08em; margin-bottom:8px; display:block}
.grp .ginst{display:flex; gap:6px; flex-wrap:wrap; min-height:36px}
.grp .gempty{font-size:11.5px; color:var(--dim); font-style:normal; align-self:center}
.modebtn{border:1px solid var(--line2); border-radius:10px; padding:7px 12px; font-size:13px; color:var(--muted); transition:all .15s ease; background:rgba(255,255,255,.02)}
.modebtn:hover{color:var(--ink)}
.modebtn.active{border-color:var(--amber); color:var(--amber); background:var(--amberDim); font-weight:500}
.ctrl{border:1px solid var(--line2); border-radius:10px; padding:7px 14px; font-size:13px; color:var(--ink); background:var(--panel2); transition:all .15s ease}
.ctrl:hover{border-color:var(--dim)}
.ctrl:disabled{opacity:.35; cursor:default}
.ctrl.play{border-color:var(--v2); color:var(--v2)}
.stepdot{width:8px; height:8px; border-radius:50%; background:var(--line2); padding:0; transition:all .2s ease}
.stepdot.on{background:var(--amber); transform:scale(1.25)}
.capbar{height:8px; border-radius:4px; background:var(--line); overflow:hidden; position:relative}
.capfill{height:100%; border-radius:4px; transition:width .4s ease, background .4s ease}
.tsplit{display:flex; height:20px; border-radius:6px; overflow:hidden; border:1px solid var(--line2)}
.tseg{transition:width .45s ease; display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:600; overflow:hidden; white-space:nowrap}

/* ---------- 스텝(번호형 절차) ---------- */
.step{display:flex; gap:14px}
.stepno{flex:0 0 auto; width:26px; height:26px; border-radius:8px; border:1px solid var(--amber); color:var(--amber); font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; display:flex; align-items:center; justify-content:center; margin-top:2px}
.stepline{flex:1; padding-bottom:16px; border-left:1px dashed var(--line2); margin-left:-27px; padding-left:41px}
.step:last-child .stepline{border-left-color:transparent; padding-bottom:0}

/* ---------- 반응형 & 모션 ---------- */
@media (max-width:720px){
  .h1{font-size:24px}
  .h2{font-size:18px}
  .grid2,.grid3{grid-template-columns:1fr}
  .hdr-sub{display:none}
  .inst{width:40px; height:32px; font-size:11px}
}
@media (prefers-reduced-motion: reduce){
  .eb-root *{animation:none !important; transition:none !important}
}
`;

/* ================================================================
   데이터
   ================================================================ */

const rep = (s, n) => Array.from({ length: n }, () => s);

const SECTIONS = [
  { id: "overview", no: "186", name: "개요", freq: 3 },
  { id: "components", no: "186", name: "구성 요소", freq: 3 },
  { id: "deploy", no: "189", name: "배포 모드", freq: 5 },
  { id: "cli", no: "191", name: "CLI · 배포 과정", freq: 2 },
  { id: "lifecycle", no: "192", name: "수명 주기 정책", freq: 3 },
  { id: "ext", no: "193·194", name: "확장 · CFN", freq: 4 },
  { id: "migrate", no: "195·196", name: "복제 · 마이그레이션", freq: 4 },
  { id: "exam", no: "총정리", name: "시험 총정리", freq: 5 },
];

const PLATFORMS = [
  "Go",
  "Java SE",
  "Java + Tomcat",
  ".NET Core (Linux)",
  ".NET (Windows)",
  "Node.js",
  "PHP",
  "Python",
  "Ruby",
  "Packer Builder",
  "Docker (단일 컨테이너)",
  "Docker (멀티 컨테이너)",
  "사전 구성 Docker",
];

const CLI_CMDS = [
  ["eb create", "환경 생성"],
  ["eb status", "환경 상태"],
  ["eb health", "인스턴스 헬스"],
  ["eb events", "이벤트 로그"],
  ["eb logs", "로그 조회"],
  ["eb open", "브라우저로 열기"],
  ["eb deploy", "새 버전 배포"],
  ["eb config", "구성 편집"],
  ["eb terminate", "환경 종료"],
];

/* ---- 배포 정책 6종: 시뮬레이션 스텝 데이터 ---- */
const MODES = [
  {
    id: "all",
    label: "All at Once",
    ko: "한 번에 모두",
    spec: {
      time: 1,
      timeNote: "가장 빠름",
      down: "있음",
      cost: "없음",
      roll: "수동 재배포",
      fit: "개발(dev) · 빠른 반복",
    },
    points: [
      "모든 인스턴스에 동시에 새 버전을 배포",
      "배포하는 동안 애플리케이션 전체가 중단됨",
      "추가 비용 없음 — 기존 인스턴스만 사용",
      "개발 환경에서 빠르게 반복할 때 적합",
    ],
    steps: [
      {
        cap: "v1이 4대의 인스턴스에서 서비스 중",
        capacity: 100,
        groups: [{ name: "ASG", inst: rep("v1", 4) }],
      },
      {
        cap: "전 인스턴스를 동시에 내리고 v2 배포 — 이 구간 동안 서비스 중단",
        capacity: 0,
        downtime: true,
        groups: [{ name: "ASG", inst: rep("up", 4) }],
      },
      {
        cap: "v2 기동 완료 — 가장 빠르게 배포가 끝난다",
        capacity: 100,
        groups: [{ name: "ASG", inst: rep("v2", 4) }],
      },
    ],
  },
  {
    id: "rolling",
    label: "Rolling",
    ko: "롤링",
    spec: {
      time: 2,
      timeNote: "배치 크기에 따라 ↑",
      down: "없음",
      cost: "없음",
      roll: "수동 재배포 (느림)",
      fit: "비용 민감한 환경",
    },
    points: [
      "버킷(배치) 크기만큼 인스턴스를 내리고 v2로 교체, 정상이면 다음 버킷으로",
      "배포 중 용량이 100% 아래로 떨어짐 (버킷만큼 감소)",
      "구버전과 신버전이 동시에 트래픽을 처리하는 구간 존재",
      "추가 비용 없음 · 인스턴스가 많고 버킷이 작으면 배포가 매우 오래 걸림",
    ],
    steps: [
      {
        cap: "버킷 크기 2 설정 — v1 4대 운영 중",
        capacity: 100,
        groups: [{ name: "ASG", inst: rep("v1", 4) }],
      },
      {
        cap: "버킷 ①: 2대를 내리고 v2 배포 → 용량 50%로 감소",
        capacity: 50,
        groups: [{ name: "ASG", inst: ["up", "up", "v1", "v1"] }],
      },
      {
        cap: "버킷 ① 정상(healthy) 확인 — v1·v2가 동시에 서비스",
        capacity: 100,
        groups: [{ name: "ASG", inst: ["v2", "v2", "v1", "v1"] }],
      },
      {
        cap: "버킷 ②: 남은 2대 교체 → 다시 용량 50%",
        capacity: 50,
        groups: [{ name: "ASG", inst: ["v2", "v2", "up", "up"] }],
      },
      {
        cap: "전체 v2 전환 완료 — 추가 비용 없이 무중단 달성",
        capacity: 100,
        groups: [{ name: "ASG", inst: rep("v2", 4) }],
      },
    ],
  },
  {
    id: "rollbatch",
    label: "Rolling + Additional Batch",
    ko: "롤링 + 추가 배치",
    spec: {
      time: 3,
      timeNote: "배치 크기에 따라 ↑",
      down: "없음",
      cost: "소폭 (추가 배치만큼)",
      roll: "수동 재배포 (느림)",
      fit: "운영(prod)",
    },
    points: [
      "롤링과 같지만, 먼저 새 인스턴스 배치를 추가로 띄운 뒤 교체 시작",
      "배포 내내 용량이 100% 이상으로 유지됨",
      "신·구 버전 동시 운영 · 배포가 끝나면 추가 배치는 제거",
      "추가 배치만큼의 소폭 비용 발생 — 항상 최대 용량이 필요한 운영 환경에 적합",
    ],
    steps: [
      {
        cap: "v1 4대 운영 중 — 버킷 크기 2",
        capacity: 100,
        groups: [
          { name: "ASG · 기존", inst: rep("v1", 4) },
          { name: "추가 배치", dashed: true, inst: [], empty: "아직 없음" },
        ],
      },
      {
        cap: "추가 배치에 v2 신규 2대 기동 — 기존 용량은 그대로 유지",
        capacity: 100,
        groups: [
          { name: "ASG · 기존", inst: rep("v1", 4) },
          { name: "추가 배치", dashed: true, inst: rep("ln", 2) },
        ],
      },
      {
        cap: "추가 배치 정상 — 총 6대, 용량 150%로 초과 운영",
        capacity: 150,
        groups: [
          { name: "ASG · 기존", inst: rep("v1", 4) },
          { name: "추가 배치", inst: rep("v2", 2) },
        ],
      },
      {
        cap: "기존 인스턴스를 버킷 단위로 v2 교체 — 그래도 가용 용량 100% 유지",
        capacity: 100,
        groups: [
          { name: "ASG · 기존", inst: ["up", "up", "v1", "v1"] },
          { name: "추가 배치", inst: rep("v2", 2) },
        ],
      },
      {
        cap: "다음 버킷 교체 진행",
        capacity: 100,
        groups: [
          { name: "ASG · 기존", inst: ["v2", "v2", "up", "up"] },
          { name: "추가 배치", inst: rep("v2", 2) },
        ],
      },
      {
        cap: "완료 — 추가 배치를 종료해 비용 정리",
        capacity: 100,
        groups: [
          { name: "ASG · 기존", inst: rep("v2", 4) },
          { name: "추가 배치", dashed: true, inst: rep("tm", 2) },
        ],
      },
    ],
  },
  {
    id: "immutable",
    label: "Immutable",
    ko: "변경 불가",
    spec: {
      time: 4,
      timeNote: "최장급",
      down: "없음",
      cost: "일시적 2배",
      roll: "임시 ASG 종료 — 빠름",
      fit: "운영(prod) · 안전 최우선",
    },
    points: [
      "임시 ASG를 만들고 신규 인스턴스에만 v2를 배포 (기존 인스턴스는 건드리지 않음)",
      "먼저 1대만 기동해 헬스 체크 → 통과하면 전체 용량으로 확장",
      "정상이면 신규 인스턴스를 기존 ASG로 옮기고 v1을 종료",
      "다운타임 0 · 일시적으로 비용 2배 · 배포 시간은 가장 긴 축",
      "실패하면 임시 ASG만 종료하면 끝 — 롤백이 빠르고 안전",
    ],
    steps: [
      {
        cap: "현재 ASG에서 v1 4대 운영",
        capacity: 100,
        groups: [
          { name: "ASG · 현재", inst: rep("v1", 4) },
          { name: "임시 ASG", dashed: true, inst: [], empty: "아직 없음" },
        ],
      },
      {
        cap: "임시 ASG 생성 → v2 1대만 먼저 기동해 헬스 체크",
        capacity: 100,
        groups: [
          { name: "ASG · 현재", inst: rep("v1", 4) },
          { name: "임시 ASG", dashed: true, inst: ["ln", "gh", "gh", "gh"] },
        ],
      },
      {
        cap: "헬스 체크 통과 → 나머지 3대 기동 · 총 8대(일시적 비용 2배)",
        capacity: 200,
        groups: [
          { name: "ASG · 현재", inst: rep("v1", 4) },
          { name: "임시 ASG", inst: rep("v2", 4) },
        ],
      },
      {
        cap: "신규 인스턴스를 기존 ASG로 이동 → v1 종료 시작",
        capacity: 100,
        groups: [
          {
            name: "ASG · 현재",
            inst: ["tm", "tm", "tm", "tm", "v2", "v2", "v2", "v2"],
          },
          { name: "임시 ASG", dashed: true, inst: [], empty: "삭제됨" },
        ],
      },
      {
        cap: "완료 — 실패했다면? 임시 ASG만 종료하면 즉시 롤백",
        capacity: 100,
        groups: [{ name: "ASG · 현재", inst: rep("v2", 4) }],
      },
    ],
  },
  {
    id: "traffic",
    label: "Traffic Splitting",
    ko: "트래픽 분할 (카나리)",
    router: "ALB",
    spec: {
      time: 4,
      timeNote: "평가 시간 포함",
      down: "없음",
      cost: "일시적 2배",
      roll: "자동 롤백 — 매우 빠름",
      fit: "운영 · 카나리 테스트",
    },
    points: [
      "카나리(Canary) 테스트 — 신규 버전에 소량의 트래픽만 먼저 전달",
      "동일 용량의 임시 ASG에 v2를 배포",
      "설정한 시간 동안 소량 트래픽(예: 10%)을 보내며 배포 상태를 모니터링",
      "실패 감지 시 자동 롤백(트래픽 원복 + 신규 종료) — 매우 빠름 · 무중단",
      "정상이면 신규 인스턴스를 원래 ASG로 이동시키고 구버전 종료",
    ],
    steps: [
      {
        cap: "v1 4대가 트래픽 100% 처리 중",
        capacity: 100,
        traffic: [100, 0],
        groups: [
          { name: "ASG · 기존", inst: rep("v1", 4) },
          { name: "ASG · 임시", dashed: true, inst: [], empty: "아직 없음" },
        ],
      },
      {
        cap: "임시 ASG에 v2를 동일 용량으로 배포",
        capacity: 100,
        traffic: [100, 0],
        groups: [
          { name: "ASG · 기존", inst: rep("v1", 4) },
          { name: "ASG · 임시", dashed: true, inst: rep("ln", 4) },
        ],
      },
      {
        cap: "카나리: v2에 트래픽 10%만 전달, 설정 시간 동안 헬스 모니터링 — 실패 시 자동 롤백",
        capacity: 200,
        traffic: [90, 10],
        groups: [
          { name: "ASG · 기존", inst: rep("v1", 4) },
          { name: "ASG · 임시", inst: rep("v2", 4) },
        ],
      },
      {
        cap: "정상 판정 → 전체 트래픽을 v2로 전환, v1 종료",
        capacity: 100,
        traffic: [0, 100],
        groups: [
          { name: "ASG · 기존", inst: rep("tm", 4) },
          { name: "ASG · 임시", inst: rep("v2", 4) },
        ],
      },
      {
        cap: "신규 인스턴스가 원래 ASG로 이동 — 완료",
        capacity: 100,
        traffic: [0, 100],
        groups: [{ name: "ASG · 기존", inst: rep("v2", 4) }],
      },
    ],
  },
  {
    id: "bluegreen",
    label: "Blue / Green",
    ko: "블루 / 그린",
    router: "Route 53 · 가중치 라우팅",
    spec: {
      time: 5,
      timeNote: "가장 오래 걸림",
      down: "없음",
      cost: "환경 1개 추가",
      roll: "URL 재스왑 — 빠름",
      fit: "운영 · 신중한 릴리스",
    },
    points: [
      "Elastic Beanstalk의 내장 기능이 아닌, 별도 환경을 활용한 배포 전략",
      "새 환경(Green)을 만들어 v2를 배포 — 운영과 완전히 격리된 상태에서 검증",
      "Route 53 가중치 정책으로 소량의 트래픽을 Green에 보내 테스트 가능",
      "검증이 끝나면 Swap URLs — 두 환경의 CNAME을 맞바꿔 전체 전환",
      "6종 중 유일하게 DNS 변경이 필요한 방식 · 되돌릴 때도 다시 스왑",
    ],
    steps: [
      {
        cap: "Blue 환경에서 v1이 트래픽 100% 처리 중",
        capacity: 100,
        traffic: [100, 0],
        groups: [
          { name: "환경 Blue · 운영", inst: rep("v1", 2) },
          { name: "환경 Green", dashed: true, inst: [], empty: "아직 없음" },
        ],
      },
      {
        cap: "새 Green 환경 생성 + v2 배포 — 운영과 격리된 채로 마음껏 검증",
        capacity: 100,
        traffic: [100, 0],
        groups: [
          { name: "환경 Blue · 운영", inst: rep("v1", 2) },
          { name: "환경 Green · 신규", inst: rep("v2", 2) },
        ],
      },
      {
        cap: "Route 53 가중치 레코드로 트래픽 일부(예: 10%)를 Green에 보내 확인",
        capacity: 100,
        traffic: [90, 10],
        groups: [
          { name: "환경 Blue · 운영", inst: rep("v1", 2) },
          { name: "환경 Green · 신규", inst: rep("v2", 2) },
        ],
      },
      {
        cap: "검증 완료 → Swap URLs(CNAME 교체)로 전체 전환 — DNS가 바뀐다",
        capacity: 100,
        traffic: [0, 100],
        groups: [
          { name: "환경 Blue", inst: rep("v1", 2) },
          { name: "환경 Green · 운영", inst: rep("v2", 2) },
        ],
      },
      {
        cap: "Blue는 롤백 대비로 잠시 유지하거나 종료",
        capacity: 100,
        traffic: [0, 100],
        groups: [
          { name: "환경 Blue", dashed: true, inst: rep("tm", 2) },
          { name: "환경 Green · 운영", inst: rep("v2", 2) },
        ],
      },
    ],
  },
];

/* ---- AWS 공식 문서 스타일 비교표 ---- */
const COMPARE = [
  {
    name: "All at once",
    time: 1,
    plus: false,
    down: "있음",
    dns: "없음",
    roll: "수동 재배포",
    target: "기존 인스턴스",
    cost: "없음",
  },
  {
    name: "Rolling",
    time: 2,
    plus: true,
    down: "없음",
    dns: "없음",
    roll: "수동 재배포",
    target: "기존 인스턴스",
    cost: "없음",
  },
  {
    name: "Rolling + additional batch",
    time: 3,
    plus: true,
    down: "없음",
    dns: "없음",
    roll: "수동 재배포",
    target: "신규 + 기존",
    cost: "소폭",
  },
  {
    name: "Immutable",
    time: 4,
    plus: false,
    down: "없음",
    dns: "없음",
    roll: "신규 인스턴스 종료",
    target: "신규 인스턴스",
    cost: "일시 2배",
  },
  {
    name: "Traffic splitting",
    time: 4,
    plus: false,
    down: "없음",
    dns: "없음",
    roll: "트래픽 원복 + 신규 종료 (자동)",
    target: "신규 인스턴스",
    cost: "일시 2배",
  },
  {
    name: "Blue / green",
    time: 5,
    plus: false,
    down: "없음",
    dns: "있음",
    roll: "URL 재스왑",
    target: "신규 인스턴스",
    cost: "환경 추가",
  },
];

/* ---- 시험 총정리 데이터 ---- */
const FREQ = [
  {
    t: "배포 정책 6종 — 요구조건 매칭",
    s: 5,
    note: "다운타임·비용·롤백 조건을 주고 정책을 고르게 하는 유형이 단골. 사실상 매 회차 등장",
  },
  {
    t: ".ebextensions (.config)",
    s: 4,
    note: "디렉터리 위치·형식·option_settings를 알면 보기만 봐도 풀리는 암기형",
  },
  {
    t: "마이그레이션 — RDS 분리 · LB 유형 변경",
    s: 4,
    note: "절차 순서(스냅샷 → 삭제 방지 → 새 환경 → CNAME 스왑)를 그대로 묻는 문제",
  },
  {
    t: "Blue/Green · Swap URLs(CNAME)",
    s: 4,
    note: "배포 정책 문제와 결합해 자주 출제 — 'DNS 변경'이 힌트",
  },
  {
    t: "수명 주기 정책 (버전 1,000개 한도)",
    s: 3,
    note: "'갑자기 배포가 안 된다' 시나리오의 정답으로 등장",
  },
  {
    t: "웹 티어 vs 워커 티어 (SQS · cron.yaml)",
    s: 3,
    note: "오래 걸리는 작업을 분리하는 시나리오",
  },
  {
    t: "EB ↔ CloudFormation 관계",
    s: 2,
    note: "'내부적으로 CFN을 사용한다'는 한 줄 지식",
  },
  {
    t: "환경 복제 (RDS 데이터 미보존)",
    s: 2,
    note: "테스트 환경 생성 시나리오 · 함정 보기로 활용",
  },
  {
    t: "EB CLI · zip 배포 과정",
    s: 2,
    note: "eb deploy, 의존성 파일, S3 저장 정도만",
  },
];

const KEYWORDS = [
  { cue: "다운타임 허용 · 가장 빠르고 저렴하게", ans: "All at once" },
  { cue: "추가 인스턴스 비용 없이 무중단", ans: "Rolling" },
  {
    cue: "무중단 + 항상 100% 용량 + 비용 최소화",
    ans: "Rolling + additional batch",
  },
  { cue: "실패 시 즉시 롤백 · 비용은 상관없음", ans: "Immutable" },
  { cue: "카나리 테스트 · 자동 롤백", ans: "Traffic splitting" },
  {
    cue: "새 버전을 격리 검증 후 전환 · DNS 변경",
    ans: "Blue/Green + Swap URLs",
  },
  {
    cue: "콘솔 UI 설정을 코드로 관리 (환경 변수 등)",
    ans: ".ebextensions + option_settings",
  },
  {
    cue: "환경을 지워도 살아남아야 하는 DB",
    ans: "RDS 분리 (스냅샷 → 삭제 방지 → 새 환경 → 스왑)",
  },
  {
    cue: "LB 유형을 ALB → NLB로 변경",
    ans: "새 환경 생성 + CNAME 스왑 (복제·수정 불가)",
  },
  {
    cue: "버전이 쌓여 배포 실패 (1,000개)",
    ans: "수명 주기 정책 (시간/개수 기반)",
  },
  {
    cue: "오래 걸리는 작업을 백그라운드로",
    ans: "워커 환경 + SQS (+ cron.yaml 주기 작업)",
  },
  { cue: "EB가 리소스를 만드는 내부 방식", ans: "CloudFormation 스택" },
];

const MEMO = [
  "신규 인스턴스에 배포하는 정책은 셋뿐 — Immutable · Traffic splitting · Blue/Green",
  "DNS 변경이 필요한 건 Blue/Green 하나뿐 — 나머지는 DNS 그대로",
  "Rolling 계열의 롤백 = 또 한 번의 느린 수동 재배포 (그래서 운영엔 Immutable 선호)",
  "복제(Clone)는 구성만 복사 — RDS의 '데이터'는 복사되지 않는다",
  "수명 주기 정책은 '현재 사용 중인 버전'을 절대 지우지 않는다",
  "Beanstalk 자체는 무료 — 그 아래 EC2·ELB·RDS 요금만 낸다",
  "환경 하나 = 실행 중인 애플리케이션 버전 하나",
  "LB는 생성 후 '구성'만 바꿀 수 있고 '유형'은 못 바꾼다",
];

/* ================================================================
   아톰 컴포넌트
   ================================================================ */

const Stars = ({ n }) => (
  <span className="stars" aria-label={`빈출도 ${n}/5`}>
    {"★".repeat(n)}
    <span style={{ color: "var(--line2)" }}>{"★".repeat(5 - n)}</span>
  </span>
);

const Dots = ({ n, plus }) => (
  <span className="dots">
    {"●".repeat(n)}
    <span className="off">{"●".repeat(5 - n)}</span>
    {plus ? " +" : ""}
  </span>
);

const Lect = ({ children }) => <span className="lect">강의 {children}</span>;

const SectionHead = ({ no, title, freq, desc }) => (
  <div style={{ marginBottom: 22 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 10,
      }}
    >
      <Lect>{no}</Lect>
      <span className="tiny mono" style={{ letterSpacing: ".08em" }}>
        빈출도
      </span>
      <Stars n={freq} />
    </div>
    <h2 className="h2" style={{ marginBottom: 8 }}>
      {title}
    </h2>
    {desc && (
      <p className="lead" style={{ fontSize: 14.5 }}>
        {desc}
      </p>
    )}
  </div>
);

const Panel = ({ label, children, style, pad = 18 }) => (
  <div className="panel" style={{ padding: pad, ...style }}>
    {label && (
      <div className="plab" style={{ marginBottom: 12 }}>
        {label}
      </div>
    )}
    {children}
  </div>
);

const DBox = ({ label, children, tone, style }) => {
  const tones = {
    v1: {
      borderColor: "var(--v1)",
      color: "var(--v1)",
      background: "var(--v1Dim)",
    },
    v2: {
      borderColor: "var(--v2)",
      color: "var(--v2)",
      background: "var(--v2Dim)",
    },
    amber: {
      borderColor: "var(--amber)",
      color: "var(--amber)",
      background: "var(--amberDim)",
    },
    dim: { borderStyle: "dashed", color: "var(--muted)" },
  };
  return (
    <div className="dbox" style={{ ...(tone ? tones[tone] : {}), ...style }}>
      {label && <span className="dl">{label}</span>}
      {children}
    </div>
  );
};

const Bullets = ({ items, tight }) => (
  <ul
    style={{
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: tight ? 6 : 9,
    }}
  >
    {items.map((it, i) => (
      <li
        key={i}
        style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--ink)" }}
      >
        <span
          style={{ color: "var(--amber)", flex: "0 0 auto", lineHeight: 1.75 }}
        >
          –
        </span>
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

/* ================================================================
   배포 시뮬레이터 (시그니처 컴포넌트)
   ================================================================ */

const InstChip = ({ s }) => {
  const label = { v1: "v1", v2: "v2", up: "⟳", ln: "···", tm: "✕", gh: "" }[s];
  return (
    <div className={"inst " + s} aria-hidden={s === "gh"}>
      {label}
    </div>
  );
};

const Legend = () => (
  <div
    style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}
  >
    {[
      ["v1", "구버전 v1"],
      ["v2", "신버전 v2"],
      ["up", "교체 중"],
      ["ln", "기동 중"],
      ["tm", "종료"],
    ].map(([s, t]) => (
      <span
        key={s}
        style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
      >
        <span
          className={"inst " + s}
          style={{ width: 24, height: 18, fontSize: 9, borderRadius: 5 }}
        >
          {s === "up" ? "⟳" : s === "ln" ? "·" : s === "tm" ? "✕" : ""}
        </span>
        <span className="tiny">{t}</span>
      </span>
    ))}
  </div>
);

const TrafficBar = ({ router, split }) => {
  const [a, b] = split;
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 6,
        }}
      >
        <span className="plab">{router}</span>
        <span className="mono tiny">
          <span style={{ color: "var(--v1)" }}>v1 {a}%</span>
          <span style={{ color: "var(--dim)" }}> · </span>
          <span style={{ color: "var(--v2)" }}>v2 {b}%</span>
        </span>
      </div>
      <div className="tsplit">
        <div
          className="tseg"
          style={{
            width: a + "%",
            background: "var(--v1Dim)",
            color: "var(--v1)",
            borderRight: a > 0 && b > 0 ? "1px solid var(--line2)" : "none",
          }}
        >
          {a >= 18 ? "v1" : ""}
        </div>
        <div
          className="tseg"
          style={{
            width: b + "%",
            background: "var(--v2Dim)",
            color: "var(--v2)",
          }}
        >
          {b >= 18 ? "v2" : ""}
        </div>
      </div>
    </div>
  );
};

const CapacityMeter = ({ pct, downtime }) => {
  const color =
    downtime || pct === 0
      ? "var(--danger)"
      : pct < 100
        ? "var(--warn)"
        : "var(--v2)";
  return (
    <div style={{ marginTop: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 6,
        }}
      >
        <span className="plab">가용 용량</span>
        <span className="mono" style={{ fontSize: 12, color, fontWeight: 600 }}>
          {pct}% {pct > 100 ? "· 초과 프로비저닝" : ""}
          {downtime ? " · 서비스 중단" : ""}
        </span>
      </div>
      <div className="capbar">
        <div
          className="capfill"
          style={{ width: Math.min(pct, 100) + "%", background: color }}
        />
      </div>
    </div>
  );
};

const Simulator = () => {
  const [modeId, setModeId] = useState("all");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const mode = MODES.find((m) => m.id === modeId);
  const cur = mode.steps[step];
  const last = mode.steps.length - 1;

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [modeId]);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= last) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1700);
    return () => clearInterval(t);
  }, [playing, modeId, last]);

  return (
    <Panel label="INTERACTIVE — 배포 정책 시뮬레이터" pad={20}>
      {/* 모드 선택 */}
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            className={"modebtn" + (m.id === modeId ? " active" : "")}
            onClick={() => setModeId(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 스테이지 */}
      <div
        className="panel2"
        style={{
          border: "1px solid var(--line)",
          borderRadius: 12,
          padding: "18px 18px 16px",
        }}
      >
        {cur.traffic && <TrafficBar router={mode.router} split={cur.traffic} />}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          {cur.groups.map((g, i) => (
            <div
              key={i}
              className={"grp" + (g.dashed ? " dashed" : "")}
              style={{ flex: "1 1 180px" }}
            >
              <span className="gname">{g.name}</span>
              <div className="ginst">
                {g.inst.length === 0 ? (
                  <span className="gempty">{g.empty || "—"}</span>
                ) : (
                  g.inst.map((s, j) => <InstChip key={j} s={s} />)
                )}
              </div>
            </div>
          ))}
        </div>
        {typeof cur.capacity === "number" && (
          <CapacityMeter pct={cur.capacity} downtime={cur.downtime} />
        )}
        {cur.downtime && (
          <div
            className="warnbox"
            style={{ marginTop: 12, padding: "8px 14px", fontSize: 12.5 }}
          >
            ⚠ 이 구간 동안 사용자 요청이 실패한다 — All at once의 대가
          </div>
        )}
      </div>

      {/* 캡션 + 컨트롤 */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginTop: 14,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <div
            className="mono tiny"
            style={{
              color: "var(--amber)",
              marginBottom: 3,
              letterSpacing: ".1em",
            }}
          >
            STEP {step + 1} / {mode.steps.length}
          </div>
          <p style={{ fontSize: 14 }}>{cur.cap}</p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="ctrl"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            ◀ 이전
          </button>
          <button
            className="ctrl"
            onClick={() => setStep((s) => Math.min(last, s + 1))}
            disabled={step === last}
          >
            다음 ▶
          </button>
          <button
            className={"ctrl" + (playing ? " play" : "")}
            onClick={() => {
              if (step >= last) setStep(0);
              setPlaying((p) => !p);
            }}
          >
            {playing ? "⏸ 일시정지" : "▶ 자동 재생"}
          </button>
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 7, marginTop: 12, alignItems: "center" }}
      >
        {mode.steps.map((_, i) => (
          <button
            key={i}
            className={"stepdot" + (i === step ? " on" : "")}
            onClick={() => setStep(i)}
            aria-label={`스텝 ${i + 1}`}
          />
        ))}
      </div>

      {/* 스펙 스트립 */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 18,
          paddingTop: 16,
          borderTop: "1px dashed var(--line)",
        }}
      >
        {[
          [
            "배포 시간",
            <Dots key="d" n={mode.spec.time} />,
            mode.spec.timeNote,
          ],
          [
            "다운타임",
            mode.spec.down === "있음" ? (
              <span key="x" style={{ color: "var(--danger)", fontWeight: 600 }}>
                있음
              </span>
            ) : (
              <span key="o" style={{ color: "var(--v2)", fontWeight: 600 }}>
                없음
              </span>
            ),
          ],
          ["추가 비용", mode.spec.cost],
          ["롤백", mode.spec.roll],
          ["추천", mode.spec.fit],
        ].map(([k, v, sub], i) => (
          <div
            key={i}
            style={{
              flex: "1 1 140px",
              background: "var(--panel2)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "9px 12px",
            }}
          >
            <div className="plab" style={{ marginBottom: 3 }}>
              {k}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
            {sub && <div className="tiny">{sub}</div>}
          </div>
        ))}
      </div>

      {/* 특징 */}
      <div style={{ marginTop: 16 }}>
        <div className="plab" style={{ marginBottom: 10 }}>
          {mode.label} — 핵심 특징
        </div>
        <Bullets items={mode.points} tight />
      </div>

      <div style={{ marginTop: 16 }}>
        <Legend />
      </div>
    </Panel>
  );
};

/* ================================================================
   다이어그램 컴포넌트
   ================================================================ */

/* 개요: 문제 → 해결 */
const ProblemSolution = () => (
  <div
    style={{
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      alignItems: "stretch",
    }}
  >
    <Panel label="개발자의 고민" style={{ flex: "1 1 260px" }}>
      <Bullets
        tight
        items={[
          "인프라를 직접 관리해야 한다",
          "코드 배포 파이프라인 구축이 번거롭다",
          "DB · 로드 밸런서 등 구성이 복잡하다",
          "확장(스케일링)까지 신경 써야 한다",
          "그런데 웹앱 구조는 대부분 비슷하다 (ALB + ASG)",
        ]}
      />
      <p
        className="small"
        style={{ marginTop: 12, fontStyle: "normal", color: "var(--amber)" }}
      >
        "그냥 내 코드만 돌아가면 좋겠다 — 어떤 앱·환경에서든 일관되게."
      </p>
    </Panel>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--amber)",
        fontSize: 22,
        flex: "0 0 auto",
        alignSelf: "center",
      }}
    >
      →
    </div>
    <Panel
      label="Elastic Beanstalk의 답"
      style={{ flex: "1 1 260px", borderColor: "var(--amber)" }}
    >
      <Bullets
        tight
        items={[
          "용량 프로비저닝 · 로드 밸런싱 자동 처리",
          "스케일링 · 애플리케이션 헬스 모니터링 자동",
          "인스턴스 구성까지 알아서 — 개발자는 코드만 책임",
          "그래도 모든 구성에 대한 완전한 제어권은 유지",
          "내부적으로는 익숙한 EC2 · ASG · ELB · RDS를 그대로 사용",
        ]}
      />
    </Panel>
  </div>
);

/* 구성 요소 계층 */
const HierarchyDiagram = () => (
  <Panel label="DIAGRAM — Application ⊃ Version + Environment">
    <div
      className="panel2"
      style={{
        border: "1px solid var(--line2)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 12,
          color: "var(--amber)",
          marginBottom: 14,
          letterSpacing: ".06em",
        }}
      >
        Application — my-app{" "}
        <span className="tiny" style={{ color: "var(--dim)" }}>
          (환경·버전·구성의 모음)
        </span>
      </div>
      <div className="grid2">
        <div>
          <div className="plab" style={{ marginBottom: 8 }}>
            Application Versions — 코드의 반복(iteration)
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <DBox tone="dim" style={{ opacity: 0.6 }}>
              v1
            </DBox>
            <DBox tone="v1">v2</DBox>
            <DBox tone="v2">
              v3 <span className="tiny">최신</span>
            </DBox>
          </div>
          <p className="tiny" style={{ marginTop: 10 }}>
            zip으로 업로드 → S3에 저장 · 최대 1,000개
          </p>
        </div>
        <div>
          <div className="plab" style={{ marginBottom: 8 }}>
            Environments — 버전을 실행하는 리소스 묶음
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              className="dbox"
              style={{
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>
                my-app-<b>dev</b>
              </span>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--v2)" }}
              >
                ▸ v3 실행 중
              </span>
            </div>
            <div
              className="dbox"
              style={{
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>
                my-app-<b>prod</b>
              </span>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--v1)" }}
              >
                ▸ v2 실행 중
              </span>
            </div>
          </div>
          <p className="tiny" style={{ marginTop: 10 }}>
            환경 하나는{" "}
            <b style={{ color: "var(--ink)" }}>한 번에 하나의 버전만</b> 실행 ·
            dev/test/prod 등 여러 개 생성 가능
          </p>
        </div>
      </div>
    </div>
    <div className="flow" style={{ marginTop: 14, justifyContent: "center" }}>
      <DBox label="1">애플리케이션 생성</DBox>
      <span className="arrow">→</span>
      <DBox label="2">버전 업로드</DBox>
      <span className="arrow">→</span>
      <DBox label="3">환경 시작</DBox>
      <span className="arrow">→</span>
      <DBox label="4">
        환경 관리 <span className="tiny">(버전 업데이트 ↻)</span>
      </DBox>
    </div>
  </Panel>
);

/* 웹 티어 vs 워커 티어 */
const TierDiagram = () => (
  <div className="grid2">
    <Panel label="웹 서버 티어 — HTTP 요청 처리">
      <div
        className="flow"
        style={{ justifyContent: "center", marginBottom: 12 }}
      >
        <DBox label="CLIENT">사용자</DBox>
        <span className="arrow">→</span>
        <DBox tone="amber" label="ELB">
          로드 밸런서
        </DBox>
        <span className="arrow">→</span>
        <div className="grp" style={{ minWidth: 0 }}>
          <span className="gname">Auto Scaling Group</span>
          <div className="ginst">
            <InstChip s="v1" />
            <InstChip s="v1" />
            <InstChip s="v1" />
          </div>
        </div>
      </div>
      <p className="small">
        일반적인 웹 애플리케이션 — ELB가 트래픽을 받아 ASG의 EC2 인스턴스로 분배
      </p>
    </Panel>
    <Panel label="워커 티어 — 백그라운드 작업 처리">
      <div
        className="flow"
        style={{ justifyContent: "center", marginBottom: 12 }}
      >
        <DBox tone="amber" label="SQS">
          메시지 큐
        </DBox>
        <span className="arrow">→</span>
        <div className="grp" style={{ minWidth: 0 }}>
          <span className="gname">워커 (EC2)</span>
          <div className="ginst">
            <InstChip s="v2" />
            <InstChip s="v2" />
          </div>
        </div>
      </div>
      <Bullets
        tight
        items={[
          "긴 작업(영상 인코딩·이메일 발송 등)은 워커 환경으로 분리",
          "웹 티어가 SQS 큐에 작업을 밀어 넣고, 워커가 꺼내 처리",
          "SQS 메시지 수에 따라 워커 수가 스케일링됨",
          "cron.yaml 파일로 주기적 작업 정의 가능",
        ]}
      />
    </Panel>
  </div>
);

/* 환경 아키텍처 2종 (189 전반부) */
const ArchOptions = () => (
  <div className="grid2">
    <Panel label="① 단일 인스턴스 — 개발용">
      <div
        className="flow"
        style={{ justifyContent: "center", marginBottom: 12 }}
      >
        <DBox label="DNS">Elastic IP</DBox>
        <span className="arrow">→</span>
        <div className="grp" style={{ minWidth: 0 }}>
          <span className="gname">ASG (desired: 1)</span>
          <div className="ginst">
            <InstChip s="v1" />
          </div>
        </div>
      </div>
      <Bullets
        tight
        items={[
          "EC2 1대 + Elastic IP · DNS 이름이 Elastic IP를 가리킴",
          "ASG는 있지만 인스턴스는 1개 유지",
          "RDS를 함께 둘 수도 있음 — 개발(dev)에 적합",
        ]}
      />
    </Panel>
    <Panel label="② 고가용성(HA) + 로드 밸런서 — 운영용">
      <div
        className="flow"
        style={{ justifyContent: "center", marginBottom: 12 }}
      >
        <DBox tone="amber" label="ALB">
          로드 밸런서
        </DBox>
        <span className="arrow">→</span>
        <div className="grp" style={{ minWidth: 0 }}>
          <span className="gname">ASG · AZ-a / AZ-b</span>
          <div className="ginst">
            <InstChip s="v1" />
            <InstChip s="v1" />
            <InstChip s="v1" />
            <InstChip s="v1" />
          </div>
        </div>
      </div>
      <Bullets
        tight
        items={[
          "ALB 뒤에 여러 AZ에 걸친 ASG — 무중단·확장 대응",
          "DNS 이름은 ALB의 CNAME을 가리킴",
          "RDS Multi-AZ 선택 가능 — 운영(prod)에 적합",
        ]}
      />
    </Panel>
  </div>
);

/* CLI 배포 과정 */
const DeployFlow = () => (
  <Panel label="DIAGRAM — 배포 과정 (콘솔 · CLI 공통)">
    <div className="flow" style={{ justifyContent: "center" }}>
      <DBox label="SOURCE">
        코드 + 의존성 명세
        <br />
        <span className="mono tiny">requirements.txt · package.json</span>
      </DBox>
      <span className="arrow">→</span>
      <DBox label="PACKAGE">zip 패키징</DBox>
      <span className="arrow">→</span>
      <DBox tone="amber" label="UPLOAD">
        새 애플리케이션 버전
        <br />
        <span className="tiny">콘솔 업로드 또는 eb deploy → S3 저장</span>
      </DBox>
      <span className="arrow">→</span>
      <DBox label="EC2 × N">
        각 인스턴스에 zip 전개
        <br />
        <span className="tiny">의존성 설치 → 앱 기동</span>
      </DBox>
    </div>
    <p className="small" style={{ marginTop: 14 }}>
      Beanstalk이 zip을 각 EC2 인스턴스에 배포하고, 의존성을 해결(resolve)한 뒤
      애플리케이션을 시작한다.
    </p>
  </Panel>
);

/* 수명 주기 정책 */
const LifecycleDiagram = () => (
  <Panel label="DIAGRAM — 버전 보관함과 수명 주기 정책">
    <div
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <DBox tone="dim" style={{ opacity: 0.35 }}>
        v1
      </DBox>
      <DBox tone="dim" style={{ opacity: 0.45 }}>
        v2
      </DBox>
      <span className="mono tiny" style={{ padding: "0 4px" }}>
        ···
      </span>
      <DBox tone="dim" style={{ opacity: 0.6 }}>
        v997
      </DBox>
      <DBox>v998</DBox>
      <DBox tone="v1">
        v999 <span className="tiny">prod 사용 중</span>
      </DBox>
      <DBox tone="v2">
        v1000 <span className="tiny">최신</span>
      </DBox>
      <span className="arrow" style={{ color: "var(--danger)" }}>
        ⛔
      </span>
      <DBox
        style={{
          borderColor: "var(--danger)",
          color: "var(--danger)",
          borderStyle: "dashed",
        }}
      >
        v1001 배포 불가
      </DBox>
    </div>
    <div className="grid2">
      <div
        className="panel2"
        style={{
          border: "1px solid var(--line2)",
          borderRadius: 10,
          padding: 14,
        }}
      >
        <div className="plab" style={{ marginBottom: 6 }}>
          정책 ① 시간 기반
        </div>
        <p className="small">
          오래된 버전을 <b style={{ color: "var(--ink)" }}>경과 시간</b>{" "}
          기준으로 자동 삭제
        </p>
      </div>
      <div
        className="panel2"
        style={{
          border: "1px solid var(--line2)",
          borderRadius: 10,
          padding: 14,
        }}
      >
        <div className="plab" style={{ marginBottom: 6 }}>
          정책 ② 공간(개수) 기반
        </div>
        <p className="small">
          버전이 <b style={{ color: "var(--ink)" }}>일정 개수</b>를 넘으면
          오래된 것부터 삭제
        </p>
      </div>
    </div>
  </Panel>
);

/* .ebextensions zip 구조 */
const ZipTree = () => (
  <pre className="code">{`my-app.zip
├── .ebextensions/            ← 반드시 소스 루트의 이 디렉터리
│   ├── env.config            ← option_settings — 환경 변수 등 기본 설정 변경
│   └── resources.config      ← RDS · ElastiCache · DynamoDB 등 리소스 추가
├── src/ ...                  ← 애플리케이션 코드
└── package.json              ← 의존성 명세`}</pre>
);

const OptionSettingsCode = () => (
  <pre className="code">{`# .ebextensions/env.config   (YAML 또는 JSON · 확장자는 .config)
option_settings:
  aws:elasticbeanstalk:application:environment:
    DB_URL: "jdbc:postgresql://mydb.xxxx.rds.amazonaws.com:5432/app"
    DB_USER: admin`}</pre>
);

/* EB ↔ CloudFormation */
const CfnDiagram = () => (
  <Panel label="DIAGRAM — Beanstalk의 속사정">
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <DBox tone="amber" label="사용자가 보는 것" style={{ minWidth: 240 }}>
        Elastic Beanstalk 환경
      </DBox>
      <span className="arrow">
        ↓ <span className="tiny">내부적으로 생성·관리</span>
      </span>
      <DBox label="실제 엔진" style={{ minWidth: 240 }}>
        CloudFormation 스택
      </DBox>
      <span className="arrow">
        ↓ <span className="tiny">프로비저닝</span>
      </span>
      <div className="flow" style={{ justifyContent: "center" }}>
        <DBox>EC2 · ASG</DBox>
        <DBox>ELB</DBox>
        <DBox>보안 그룹</DBox>
        <DBox tone="v2">
          .ebextensions로 추가한 리소스
          <br />
          <span className="tiny">ElastiCache · S3 등 무엇이든</span>
        </DBox>
      </div>
    </div>
  </Panel>
);

/* LB 마이그레이션 */
const LbMigration = () => (
  <Panel label="DIAGRAM — 로드 밸런서 유형 변경 (CNAME 스왑)">
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <DBox tone="amber" label="DNS">
        Route 53 / CNAME
      </DBox>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span className="mono tiny" style={{ color: "var(--v1)" }}>
          전환 전 ↙
        </span>
        <span className="mono tiny" style={{ color: "var(--dim)" }}>
          — 스왑 —
        </span>
        <span className="mono tiny" style={{ color: "var(--v2)" }}>
          ↘ 전환 후
        </span>
      </div>
      <div className="grid2" style={{ width: "100%" }}>
        <div className="grp">
          <span className="gname">환경 A — 기존 (ALB)</span>
          <div className="ginst">
            <InstChip s="v1" />
            <InstChip s="v1" />
          </div>
        </div>
        <div className="grp">
          <span className="gname">환경 B — 신규 (NLB)</span>
          <div className="ginst">
            <InstChip s="v2" />
            <InstChip s="v2" />
          </div>
        </div>
      </div>
    </div>
    <ol
      style={{
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {[
        "동일한 구성으로 새 환경을 만들되, 로드 밸런서 유형만 원하는 것으로 선택 — 복제(Clone)는 LB 유형까지 복사하므로 사용할 수 없다",
        "새 환경에 애플리케이션을 배포",
        "CNAME 스왑 또는 Route 53 업데이트로 트래픽 전환",
      ].map((t, i) => (
        <li key={i} className="step">
          <div className="stepno">{i + 1}</div>
          <div className="stepline">
            <p style={{ fontSize: 14 }}>{t}</p>
          </div>
        </li>
      ))}
    </ol>
  </Panel>
);

/* RDS 분리 6단계 */
const RdsSteps = () => (
  <Panel label="PROCEDURE — 운영 환경에서 RDS 분리하기 (시험 단골 순서)">
    <div className="grid2" style={{ marginBottom: 16 }}>
      <div className="grp" style={{ borderColor: "var(--danger)" }}>
        <span className="gname" style={{ color: "var(--danger)" }}>
          Before — EB 환경 안에 RDS
        </span>
        <p className="small">
          환경을 지우면 <b style={{ color: "var(--danger)" }}>DB도 함께 삭제</b>{" "}
          — 수명 주기가 묶여 있어 운영에 부적합
        </p>
      </div>
      <div className="grp" style={{ borderColor: "var(--v2)" }}>
        <span className="gname" style={{ color: "var(--v2)" }}>
          After — RDS를 환경 밖으로
        </span>
        <p className="small">
          환경은 연결 문자열로만 접근 — 환경을 갈아치워도{" "}
          <b style={{ color: "var(--v2)" }}>DB는 유지</b>
        </p>
      </div>
    </div>
    <ol style={{ listStyle: "none", display: "flex", flexDirection: "column" }}>
      {[
        ["RDS 스냅샷 생성", "만일의 사고에 대비한 안전장치"],
        [
          "RDS 삭제 방지(Deletion Protection) 활성화",
          "RDS 콘솔에서 설정 — 이후 어떤 삭제 시도에도 DB가 살아남는다",
        ],
        [
          "RDS 없는 새 EB 환경 생성",
          "애플리케이션이 기존 RDS를 가리키도록 연결 문자열(환경 변수) 설정",
        ],
        [
          "CNAME 스왑 또는 Route 53 업데이트",
          "블루/그린 방식으로 트래픽 전환 → 정상 동작 확인",
        ],
        ["이전 환경 종료", "삭제 방지 덕분에 RDS는 삭제되지 않고 살아남음"],
        [
          "CloudFormation 스택 수동 삭제",
          "RDS를 지우지 못해 DELETE_FAILED 상태로 남는다 → 직접 삭제로 마무리",
        ],
      ].map(([t, d], i) => (
        <li key={i} className="step">
          <div className="stepno">{i + 1}</div>
          <div className="stepline">
            <p style={{ fontSize: 14, fontWeight: 500 }}>{t}</p>
            <p className="small">{d}</p>
          </div>
        </li>
      ))}
    </ol>
  </Panel>
);

/* ================================================================
   섹션
   ================================================================ */

const SecOverview = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <SectionHead
      no="186"
      title="Elastic Beanstalk 개요"
      freq={3}
      desc="개발자 중심(developer-centric)의 배포 서비스 — 인프라는 AWS가, 코드는 당신이."
    />
    <ProblemSolution />
    <div className="grid2">
      <Panel label="꼭 기억할 4가지">
        <Bullets
          items={[
            <span key="a">
              <b>관리형 서비스</b> — 용량 프로비저닝 · 로드 밸런싱 · 스케일링 ·
              헬스 모니터링 · 인스턴스 구성을 자동 처리
            </span>,
            <span key="b">
              <b>개발자는 코드만 책임</b> — 그러면서도 모든 구성에 대한 완전한
              제어권 유지
            </span>,
            <span key="c">
              <b>Beanstalk 자체는 무료</b> — 아래에서 돌아가는 EC2·ELB·RDS 등
              리소스 비용만 지불
            </span>,
            <span key="d">
              <b>새로운 기술이 아니다</b> — EC2, ASG, ELB, RDS 등 기존 구성
              요소를 하나로 묶은 것
            </span>,
          ]}
        />
      </Panel>
      <Panel label="지원 플랫폼">
        <div
          style={{
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {PLATFORMS.map((p) => (
            <span key={p} className="chip">
              {p}
            </span>
          ))}
        </div>
        <p className="small">
          목록에 없는 언어라면?{" "}
          <b style={{ color: "var(--ink)" }}>커스텀 플랫폼</b>을 직접 작성할 수
          있다 (고급 기능).
        </p>
      </Panel>
    </div>
    <div className="note">
      <b>시험 관점</b> — 개요 자체보다 "관리형이지만 제어권 유지", "EB
      무료·리소스만 과금" 두 문장이 보기 판별에 쓰인다.
    </div>
  </div>
);

const SecComponents = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <SectionHead
      no="186"
      title="구성 요소 & 두 가지 티어"
      freq={3}
      desc="Application · Application Version · Environment — 이 세 단어의 관계만 잡으면 절반은 끝."
    />
    <div className="grid3">
      {[
        [
          "Application",
          "환경·버전·구성 등 Beanstalk 구성 요소 전체를 담는 컨테이너",
        ],
        [
          "Application Version",
          "애플리케이션 코드의 한 반복(iteration) — zip 업로드마다 하나씩 생성",
        ],
        [
          "Environment",
          "특정 버전을 실행하는 AWS 리소스 모음 — 한 번에 한 버전만 실행하며 dev·test·prod처럼 여러 개 생성 가능",
        ],
      ].map(([t, d]) => (
        <Panel key={t}>
          <div
            className="mono"
            style={{
              fontSize: 13,
              color: "var(--amber)",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            {t}
          </div>
          <p className="small">{d}</p>
        </Panel>
      ))}
    </div>
    <HierarchyDiagram />
    <TierDiagram />
    <div className="note">
      <b>시험 포인트</b> — "완료까지 오래 걸리는 요청을 어떻게 처리할까?" → 웹
      티어에서 SQS로 넘기고 <b>워커 환경</b>이 처리. 주기 작업은{" "}
      <span className="mono">cron.yaml</span>.
    </div>
  </div>
);

const SecDeploy = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <SectionHead
      no="189"
      title="배포 모드 — 이 섹션의 심장"
      freq={5}
      desc="DVA에서 Beanstalk이 나오면 십중팔구 이 주제. 각 정책의 트레이드오프(속도·비용·다운타임·롤백)를 조건 매칭으로 묻는다."
    />
    <div>
      <h3 className="h3" style={{ marginBottom: 12 }}>
        먼저, 환경 아키텍처 두 가지
      </h3>
      <ArchOptions />
    </div>
    <div>
      <h3 className="h3" style={{ marginBottom: 6 }}>
        업데이트 배포 정책 6종
      </h3>
      <p className="small" style={{ marginBottom: 12 }}>
        정책을 골라 <b style={{ color: "var(--ink)" }}>다음 ▶</b> 을 누르며
        인스턴스가 v1 → v2로 바뀌는 과정을 따라가 보자.
      </p>
      <Simulator />
    </div>
    <Panel label="AWS 공식 비교표 — 그대로 암기">
      <div style={{ overflowX: "auto" }}>
        <table className="cmp">
          <thead>
            <tr>
              <th>정책</th>
              <th>배포 시간</th>
              <th>다운타임</th>
              <th>DNS 변경</th>
              <th>롤백 방법</th>
              <th>배포 대상</th>
              <th>추가 비용</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((r) => (
              <tr key={r.name}>
                <td
                  className="mono"
                  style={{
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    color: "var(--ink)",
                  }}
                >
                  {r.name}
                </td>
                <td>
                  <Dots n={r.time} plus={r.plus} />
                </td>
                <td
                  style={{
                    color: r.down === "있음" ? "var(--danger)" : "var(--muted)",
                    fontWeight: r.down === "있음" ? 600 : 400,
                  }}
                >
                  {r.down}
                </td>
                <td
                  style={{
                    color: r.dns === "있음" ? "var(--amber)" : "var(--muted)",
                    fontWeight: r.dns === "있음" ? 600 : 400,
                  }}
                >
                  {r.dns}
                </td>
                <td>{r.roll}</td>
                <td>{r.target}</td>
                <td>{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tiny" style={{ marginTop: 10 }}>
        + 표시: 배치(버킷) 크기에 따라 배포 시간이 더 늘어남
      </p>
    </Panel>
    <div className="note">
      <b>정답 고르는 공식</b> — ① 다운타임 허용? → All at once ② 비용 0 +
      무중단? → Rolling ③ 항상 풀 용량 + 저비용? → Rolling+batch ④ 빠른 롤백 +
      비용 무관? → Immutable ⑤ "카나리·자동 롤백"? → Traffic splitting ⑥ "격리
      검증·DNS 변경"? → Blue/Green
    </div>
  </div>
);

const SecCli = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <SectionHead
      no="191"
      title="EB CLI & 배포 과정"
      freq={2}
      desc="Beanstalk 전용 CLI — CI/CD 파이프라인 자동화에 특히 유용하다."
    />
    <Panel label="EB CLI 주요 명령어">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 8,
        }}
      >
        {CLI_CMDS.map(([c, d]) => (
          <div
            key={c}
            className="panel2"
            style={{
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "9px 12px",
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 12.5,
                color: "var(--v2)",
                fontWeight: 600,
                display: "block",
              }}
            >
              {c}
            </span>
            <span className="tiny">{d}</span>
          </div>
        ))}
      </div>
    </Panel>
    <DeployFlow />
    <div className="note">
      <b>시험 포인트</b> — 배포 단위는 <b>zip</b>이고, 의존성은{" "}
      <span className="mono">requirements.txt</span>(Python)·
      <span className="mono">package.json</span>(Node.js) 같은 명세 파일로 각
      인스턴스에서 설치된다. 업로드된 버전은 S3에 저장.
    </div>
  </div>
);

const SecLifecycle = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <SectionHead
      no="192"
      title="애플리케이션 버전 수명 주기 정책"
      freq={3}
      desc="버전은 최대 1,000개 — 안 지우면 어느 날 배포가 막힌다."
    />
    <LifecycleDiagram />
    <div className="grid2">
      <Panel label="규칙">
        <Bullets
          items={[
            "Elastic Beanstalk은 애플리케이션 버전을 최대 1,000개까지 저장",
            "오래된 버전을 지우지 않으면 새 버전을 배포할 수 없게 됨",
            "수명 주기 정책으로 시간 기반 또는 공간(개수) 기반 자동 정리",
          ]}
        />
      </Panel>
      <Panel label="안전장치 2가지">
        <Bullets
          items={[
            <span key="a">
              <b>현재 사용 중인 버전</b>은 정책이 절대 삭제하지 않음
            </span>,
            <span key="b">
              버전 삭제 시 <b>S3의 소스 번들은 남기는 옵션</b> — 데이터 유실
              방지
            </span>,
          ]}
        />
      </Panel>
    </div>
  </div>
);

const SecExt = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <SectionHead
      no="193 · 194"
      title=".ebextensions & CloudFormation"
      freq={4}
      desc="콘솔에서 클릭하던 모든 설정을 코드로 — 그리고 그 코드가 실제로 실행되는 곳은 CloudFormation."
    />
    <div className="grid2">
      <Panel label=".ebextensions — 4가지 요구사항">
        <Bullets
          items={[
            <span key="a">
              소스 코드 <b>루트</b>의{" "}
              <span className="mono">.ebextensions/</span> 디렉터리에 위치
            </span>,
            <span key="b">
              <b>YAML 또는 JSON</b> 형식
            </span>,
            <span key="c">
              파일 확장자는 반드시 <span className="mono">.config</span> (예:
              logging.config)
            </span>,
            <span key="d">
              <span className="mono">option_settings</span>로 기본 설정 변경 —
              환경 변수 등
            </span>,
          ]}
        />
        <p className="small" style={{ marginTop: 12 }}>
          RDS · ElastiCache · DynamoDB 같은{" "}
          <b style={{ color: "var(--ink)" }}>리소스 추가</b>도 가능하다.
        </p>
      </Panel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ZipTree />
        <OptionSettingsCode />
      </div>
    </div>
    <div className="warnbox">
      <b>함정 주의</b> — .ebextensions로 만든 리소스는{" "}
      <b>환경이 삭제되면 함께 삭제</b>된다. 운영 DB를 여기에 두면 안 되는 이유.
    </div>
    <CfnDiagram />
    <Panel label="Beanstalk × CloudFormation — 강의 194 요약">
      <Bullets
        items={[
          "Beanstalk은 내부적으로(under the hood) CloudFormation에 의존해 리소스를 프로비저닝",
          ".ebextensions 안에 CloudFormation 리소스를 직접 정의하면 ElastiCache든 S3 버킷이든 무엇이든 생성 가능",
          "실제 스택은 CloudFormation 콘솔에서 그대로 확인할 수 있다",
        ]}
      />
    </Panel>
  </div>
);

const SecMigrate = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <SectionHead
      no="195 · 196"
      title="복제 & 마이그레이션"
      freq={4}
      desc="복제는 '같게', 마이그레이션은 '다르게' — 그리고 전환의 열쇠는 언제나 CNAME 스왑."
    />
    <Panel label="환경 복제 (Clone) — 강의 195">
      <div className="grid2">
        <div>
          <Bullets
            items={[
              "환경을 정확히 같은 구성으로 복제 — 테스트 버전 배포에 유용",
              "복제 후에는 설정을 자유롭게 변경 가능",
            ]}
          />
        </div>
        <div>
          <div className="plab" style={{ marginBottom: 8 }}>
            보존되는 것
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <span className="chip">로드 밸런서 유형 · 구성</span>
            <span className="chip">RDS 데이터베이스 유형</span>
            <span className="chip">환경 변수</span>
          </div>
          <p
            className="small"
            style={{ marginTop: 10, color: "var(--danger)" }}
          >
            단, RDS의 <b>데이터는 보존되지 않는다</b> — 유형(엔진·설정)만 복사.
          </p>
        </div>
      </div>
    </Panel>
    <LbMigration />
    <div className="note">
      <b>왜 복제가 아닌가?</b> — 환경 생성 후 로드 밸런서는{" "}
      <b>구성만 변경 가능, 유형은 변경 불가</b>. 복제는 유형까지 그대로
      복사하므로, 유형을 바꾸려면 반드시 <b>새 환경</b>을 만들어야 한다.
    </div>
    <Panel label="RDS와 Beanstalk — 강의 196">
      <Bullets
        items={[
          <span key="a">
            RDS를 EB 환경에 포함해 프로비저닝 가능 — <b>dev/test에는 좋다</b>
          </span>,
          <span key="b">
            그러나 운영에서는 부적합 —{" "}
            <b>DB 수명 주기가 환경 수명 주기에 묶이기 때문</b>
          </span>,
          <span key="c">
            운영의 정석: RDS를 <b>별도로 생성</b>하고 EB 앱에는 연결 문자열만
            제공
          </span>,
        ]}
      />
    </Panel>
    <RdsSteps />
  </div>
);

const SecExam = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <SectionHead
      no="총정리"
      title="시험 총정리 — 빈출도 & 키워드 매칭"
      freq={5}
      desc="DVA-C02 Domain 3 「배포」 = 시험의 24%. Beanstalk은 CodePipeline·CodeDeploy와 함께 이 도메인의 축으로, 체감상 회차당 2~4문제 수준."
    />
    <Panel label="주제별 빈출도">
      <div style={{ overflowX: "auto" }}>
        <table className="cmp">
          <thead>
            <tr>
              <th>주제</th>
              <th>빈출도</th>
              <th>출제 포인트</th>
            </tr>
          </thead>
          <tbody>
            {FREQ.map((r) => (
              <tr key={r.t}>
                <td
                  style={{
                    fontWeight: 500,
                    color: "var(--ink)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.t}
                </td>
                <td>
                  <Stars n={r.s} />
                </td>
                <td className="small">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tiny" style={{ marginTop: 12 }}>
        * 빈출도는 AWS 공식 통계가 아니라, DVA-C02 시험 가이드의 도메인 비중과
        수험 커뮤니티·모의고사에서 반복 확인되는 경향을 바탕으로 한
        추정치입니다.
      </p>
    </Panel>
    <Panel label="지문 속 이 표현이 보이면 → 이 정답">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 10,
        }}
      >
        {KEYWORDS.map((k) => (
          <div
            key={k.ans + k.cue}
            className="panel2"
            style={{
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "11px 14px",
            }}
          >
            <p className="small" style={{ marginBottom: 6 }}>
              "{k.cue}"
            </p>
            <p
              className="mono"
              style={{ fontSize: 12, color: "var(--v2)", fontWeight: 600 }}
            >
              → {k.ans}
            </p>
          </div>
        ))}
      </div>
    </Panel>
    <Panel label="마지막 8줄 — 헷갈림 방지">
      <Bullets items={MEMO} />
    </Panel>
  </div>
);

/* ================================================================
   메인 앱
   ================================================================ */

const RENDER = {
  overview: SecOverview,
  components: SecComponents,
  deploy: SecDeploy,
  cli: SecCli,
  lifecycle: SecLifecycle,
  ext: SecExt,
  migrate: SecMigrate,
  exam: SecExam,
};

export default function App() {
  const [tab, setTab] = useState("overview");
  const Body = RENDER[tab];
  const idx = SECTIONS.findIndex((s) => s.id === tab);

  const go = (i) => {
    const next = SECTIONS[i];
    if (next) {
      setTab(next.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="eb-root">
      <style>{CSS}</style>

      <header className="hdr">
        <div className="wrap">
          <div className="hdr-in">
            <div>
              <div className="hdr-title">AWS Elastic Beanstalk</div>
              <div className="hdr-sub mono">
                DVA-C02 · SECTION 185–197 · 실습 제외
              </div>
            </div>
            <span className="chip hot mono" style={{ fontSize: 11 }}>
              Domain 3 · 배포 24%
            </span>
          </div>
          <nav className="tabs" aria-label="목차">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={"tabbtn" + (s.id === tab ? " active" : "")}
                onClick={() => {
                  setTab(s.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span className="tno">{s.no}</span>
                <span className="tname">{s.name}</span>
                <span className="tstars">
                  {"★".repeat(s.freq)}
                  {"☆".repeat(5 - s.freq)}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="wrap" style={{ padding: "34px 20px 20px" }}>
        {tab === "overview" && (
          <div style={{ marginBottom: 30 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              AWS CERTIFIED DEVELOPER — ASSOCIATE
            </div>
            <h1 className="h1" style={{ marginBottom: 12 }}>
              코드만 던지면 인프라가 따라온다,
              <br />
              <span style={{ color: "var(--amber)" }}>
                Elastic Beanstalk
              </span>{" "}
              한 판 정리
            </h1>
            <p className="lead">
              강의 185–197의 이론 전체를 다이어그램으로 재구성했다. 탭의
              별점(★)은 시험 빈출도 —
              <b style={{ color: "var(--ink)" }}> 배포 모드</b>부터 잡고
              나머지를 채우는 순서를 추천한다.
            </p>
          </div>
        )}
        <Body />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 34,
          }}
        >
          <button
            className="ctrl"
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
          >
            ◀ {idx > 0 ? SECTIONS[idx - 1].name : "이전"}
          </button>
          <button
            className="ctrl"
            onClick={() => go(idx + 1)}
            disabled={idx === SECTIONS.length - 1}
          >
            {idx < SECTIONS.length - 1 ? SECTIONS[idx + 1].name : "다음"} ▶
          </button>
        </div>

        <footer
          style={{
            margin: "36px 0 28px",
            paddingTop: 18,
            borderTop: "1px solid var(--line)",
          }}
        >
          <p className="tiny">
            강의 185(섹션 소개)·197(정리)은 별도 이론이 없어 본문에 녹였고, 실습
            강의(187·188·190, 192 실습부)의 개념 포인트는 해당 섹션에
            통합했습니다.
          </p>
        </footer>
      </main>
    </div>
  );
}
