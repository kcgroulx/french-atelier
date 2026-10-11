/** Pure learning logic. Intervals are a transparent product heuristic, not a validated model. */
export const DAY = 86400000;
export const STORAGE_KEY = 'elan.french.v1';
export const VERSION = 1;
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function normalize(value) {
  return String(value ?? '').normalize('NFKC').toLocaleLowerCase('fr').replace(/[’‘`]/g,"'").replace(/[.,!?;:"«»…]/g,'').replace(/\s*'\s*/g,"'").replace(/\s+/g,' ').trim();
}
export const foldAccents = value => normalize(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/œ/g,'oe').replace(/æ/g,'ae');
export function gradeAnswer(exercise, input, hinted = false) {
  if (exercise.choices) {
    const correct = Number(input) === exercise.correct && input !== '' && input !== null;
    return {kind: correct ? 'correct':'incorrect', correct, grade: correct ? (hinted ? 1:2):0, expected:exercise.choices[exercise.correct], message: correct ? 'Correct.': 'Not quite.'};
  }
  const answers = exercise.answers || [];
  const answer = answers[0] || '';
  const normalized = normalize(input);
  if (!normalized) return {kind:'empty', correct:false, grade:0, expected:answer, message:'Write an answer first.'};
  if (answers.some(a => normalize(a) === normalized)) return {kind:'correct', correct:true, grade:hinted?1:3, expected:answer, message: hinted ? 'Correct with support.':'Correct.'};
  if (answers.some(a => foldAccents(a) === foldAccents(input))) return {kind:'accent',correct:false,grade:1,expected:answer,message:'Check the accents.'};
  const wantedArticle = /^(le|la|les|un|une|des|du|de la)\s/.exec(normalize(answer));
  const givenArticle = /^(le|la|les|un|une|des|du|de la)\s/.exec(normalized);
  const articleIssue = wantedArticle && givenArticle && wantedArticle[1] !== givenArticle[1];
  return {kind:'incorrect',correct:false,grade:0,expected:answer,message:articleIssue?'Check the article and noun gender.':'Not quite.'};
}
export function localDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function shiftDay(key, amount) {
  const [y,m,d] = key.split('-').map(Number);
  return localDate(new Date(y,m-1,d+amount,12));
}
export function emptyState() {
  return {version:VERSION, records:{}, days:{}, mistakes:{}, settings:{dailyGoal:10, sound:true}, placement:null, createdAt:Date.now()};
}
export function schedule(previous, grade, now = Date.now(), modality = 'production') {
  const old = previous || {seen:0, correct:0, streak:0, intervalDays:0, lapses:0, unhintedDays:[]};
  const unhintedDays = [...(old.unhintedDays || [])];
  if (grade===3 && !unhintedDays.includes(localDate(now))) unhintedDays.push(localDate(now));
  const success = grade >= 2;
  const previousUnhintedAt = old.lastUnhintedAt || (old.lastGrade === 3 ? old.lastReviewed : 0);
  const firstUnhintedAt = old.firstUnhintedAt || previousUnhintedAt || (grade === 3 ? now : 0);
  const advances = success && (!old.lastAdvancedAt || (localDate(now) !== localDate(old.lastAdvancedAt) && now-old.lastAdvancedAt >= DAY));
  const streak = success ? (advances ? old.streak+1 : Math.max(1,old.streak)):0;
  let intervalDays;
  if (grade === 0) intervalDays = 10/1440;
  else if (grade === 1) intervalDays = 4/24;
  else if (!advances && old.lastGrade >= 2) intervalDays = old.intervalDays || 1;
  else if (streak === 1) intervalDays = 1;
  else if (streak === 2) intervalDays = 3;
  else intervalDays = Math.min(90, Math.round(Math.max(3,old.intervalDays) * (grade===3?2.2:1.6)));
  return {...old, seen:old.seen+1, correct:old.correct+(success?1:0), streak, intervalDays, due:success && !advances && old.lastGrade>=2 ? old.due : now+intervalDays*DAY, lastReviewed:now, lastAdvancedAt:advances ? now : old.lastAdvancedAt || 0, firstUnhintedAt, lastUnhintedAt:grade===3 ? now : previousUnhintedAt, lastGrade:grade, modality, lapses:old.lapses+(grade===0?1:0), unhintedDays:unhintedDays.slice(-90), retained:grade===3 && unhintedDays.length>=2 && now-firstUnhintedAt>=DAY && intervalDays>=3};
}
export function recordAnswer(state, exercise, result, response, hinted = false, now=Date.now()) {
  const next = structuredClone(state);
  next.records[exercise.id] = schedule(next.records[exercise.id],result.grade,now, ['dictation','listening'].includes(exercise.type)?'listening':exercise.choices?'recognition':'production');
  const key = localDate(now);
  const day = next.days[key] || {attempts:0, correct:0, xp:0, productive:0};
  day.attempts++;
  day.correct += result.correct?1:0;
  day.productive += result.grade===3?1:0;
  day.xp += result.grade===3?15:result.grade===2?10:result.grade===1?5:2;
  next.days[key] = day;
  if ((!result.correct || hinted) && !(result.correct && hinted && next.mistakes[exercise.id] && !next.mistakes[exercise.id].resolved)) next.mistakes[exercise.id] = {response:String(response).slice(0,2000), expected:result.expected, kind:hinted&&result.correct?'hint':result.kind, at:now, resolved:false};
  else if (result.correct && !hinted && next.mistakes[exercise.id]) next.mistakes[exercise.id].resolved = true;
  return next;
}
export function dueExercises(state, exercises, now=Date.now()) {return exercises.filter(e => state.records[e.id]?.due<=now).sort((a,b)=>state.records[a.id].due-state.records[b.id].due);}
export function currentStreak(state, now = new Date()) {
  const today = localDate(now);
  let key = state.days[today]?.attempts ? today : shiftDay(today,-1);
  let streak=0;
  while(state.days[key]?.attempts) {streak++;key=shiftDay(key,-1);}
  return streak;
}
export function unitStats(unit, state, exercises) {
  const items = exercises.filter(e => e.unit===unit.id);
  return {total:items.length, seen:items.filter(e=>state.records[e.id]).length, retained:items.filter(e=>state.records[e.id]?.retained).length, ready:items.filter(e=>state.records[e.id]?.lastGrade>=2).length};
}
export function suggestedUnit(state, units, exercises) {
  if (state.placement?.unit && !units.some(u=>u.id===state.placement.unit)) state.placement=null;
  const start = state.placement?.unit ? units.findIndex(u=>u.id===state.placement.unit):0;
  return units.slice(Math.max(0,start)).find(u=>unitStats(u,state,exercises).seen<exercises.filter(e=>e.unit===u.id).length) || units[0];
}
export function buildSession(mode, state, exercises, units, unitId, now=Date.now()) {
  if (mode==='placement') {
    // A short placement practice sample. Recommendations are deliberately approximate.
    return ['A1','A1','A1','A1','A2','A2','A2','A2','B1','B1','B1','B1'].map((level,i)=> {
      const pool=exercises.filter(e=>e.level===level && !e.choices && e.type!=='dictation');
      return pool[Math.min(pool.length-1, Math.floor((i%4+.5)*pool.length/4))];
    }).filter(Boolean);
  }
  if (mode==='review') return dueExercises(state,exercises,now).slice(0,15);
  if (mode==='mistakes') return exercises.filter(e=>state.mistakes[e.id]&&!state.mistakes[e.id].resolved).slice(0,12);
  if (mode==='challenge') {
    const pool = [...exercises].filter(e=>e.level!=='A1'&&!e.choices);
    const seed = Number(localDate(now).replaceAll('-',''));
    return pool.map((e,i)=>({e,k:Math.sin((i+1)*(seed+1))*10000%1})).sort((a,b)=>a.k-b.k).slice(0,12).map(x=>x.e);
  }
  const unit = unitId || suggestedUnit(state,units,exercises)?.id;
  const pool = exercises.filter(e=>e.unit===unit);
  const spread = list => { const types=['translate','cloze','dictation','reading','correct','listening']; const buckets=types.map(t=>list.filter(e=>e.type===t));const result=[];while(buckets.some(b=>b.length)){for(const b of buckets)if(b.length)result.push(b.shift());}return result; };
  const unseen=spread(pool.filter(e=>!state.records[e.id]));
  if (mode==='unit') return [...unseen,...pool.filter(e=>state.records[e.id]).sort((a,b)=>state.records[a.id].due-state.records[b.id].due)].slice(0,10);
  const due=dueExercises(state,exercises,now).slice(0,4);
  const dueIds=new Set(due.map(e=>e.id));
  const fresh=unseen.filter(e=>!dueIds.has(e.id)).slice(0,10-due.length);
  const selected=[...due,...fresh];
  const selectedIds=new Set(selected.map(e=>e.id));
  if(selected.length<10) selected.push(...pool.filter(e=>!selectedIds.has(e.id)).slice(0,10-selected.length));
  // Interleave retrieval modes without scattering brand-new grammar across the entire course.
  return spread(selected);
}
function isObject(value) {return value && typeof value==='object'&&!Array.isArray(value);}
export function validateState(raw, knownIds) {
  if(!isObject(raw)||raw.version!==VERSION||!isObject(raw.records)||!isObject(raw.days)||!isObject(raw.settings)) throw new Error('This is not a supported Élan backup (version 1).');
  const clean=emptyState();
  const known=new Set(knownIds);
  if(Object.keys(raw.records).length>10000 || Object.keys(raw.days).length>40000) throw new Error('This backup is unexpectedly large.');
  for (const [id,r] of Object.entries(raw.records)) {
    if(!known.has(id)) continue;
    if(!isObject(r)||!['seen','correct','streak','intervalDays','due','lastReviewed','lapses','lastGrade'].every(k=>Number.isFinite(r[k])&&r[k]>=0)||r.lastGrade>3||r.seen>1e7||r.intervalDays>365) throw new Error('A practice record in this backup is invalid.');
    clean.records[id]={seen:r.seen,correct:r.correct,streak:r.streak,intervalDays:r.intervalDays,due:r.due,lastReviewed:r.lastReviewed,lapses:r.lapses,lastGrade:r.lastGrade,unhintedDays:Array.isArray(r.unhintedDays)?r.unhintedDays.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)).slice(-90):[],lastAdvancedAt:Number.isFinite(r.lastAdvancedAt)?r.lastAdvancedAt:r.lastReviewed,firstUnhintedAt:Number.isFinite(r.firstUnhintedAt)?r.firstUnhintedAt:0,lastUnhintedAt:Number.isFinite(r.lastUnhintedAt)?r.lastUnhintedAt:0,retained:!!r.retained,modality:['production','recognition','listening'].includes(r.modality)?r.modality:'production'};
  }
  for(const [key,day] of Object.entries(raw.days)) if(/^\d{4}-\d{2}-\d{2}$/.test(key)&&isObject(day)&&['attempts','correct','xp','productive'].every(k=>Number.isFinite(day[k])&&day[k]>=0&&day[k]<=1e9)) clean.days[key]={attempts:day.attempts,correct:day.correct,xp:day.xp,productive:day.productive};
  if (isObject(raw.mistakes)) for(const [id,m] of Object.entries(raw.mistakes)) if(known.has(id)&&isObject(m)) clean.mistakes[id]={response:String(m.response||'').slice(0,2000),expected:String(m.expected||'').slice(0,2000),kind:['hint','accent','incorrect'].includes(m.kind)?m.kind:'incorrect',at:Number.isFinite(m.at)?m.at:0,resolved:!!m.resolved};
  clean.settings={dailyGoal:[5,10,15,20].includes(raw.settings.dailyGoal)?raw.settings.dailyGoal:10,sound:raw.settings.sound!==false};
  if(isObject(raw.placement)&&typeof raw.placement.unit==='string') clean.placement={unit:raw.placement.unit.slice(0,80),date:Number.isFinite(raw.placement.date)?raw.placement.date:0,score:Number.isFinite(raw.placement.score)?Math.max(0,Math.min(100,raw.placement.score)):0};
  clean.createdAt=Number.isFinite(raw.createdAt)?raw.createdAt:Date.now();
  return clean;
}
