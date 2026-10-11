import test from 'node:test';
import assert from 'node:assert/strict';
import { DAY, normalize, gradeAnswer, schedule, emptyState, recordAnswer, validateState, buildSession, dueExercises, localDate, currentStreak } from '../src/core.js';
import { exercises, units } from '../src/content.js';
const now = new Date(2026, 9, 11, 12).getTime();
const ids=exercises.map(e=>e.id);
test('content has unique IDs and internally valid model answers', () => {
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(units.length>0);
 for (const e of exercises) {
  assert.ok(units.some(u=>u.id===e.unit),e.id+' unit');
  assert.ok(e.prompt && e.explanation && e.hint,e.id+' metadata');
  if(e.choices) {assert.ok(Number.isInteger(e.correct)&&e.correct>=0&&e.correct<e.choices.length,e.id+' correct index');assert.equal(gradeAnswer(e,String(e.correct)).correct,true,e.id);}
  else {assert.ok(e.answers?.length,e.id+' answers');for(const a of e.answers)assert.equal(gradeAnswer(e,a).correct,true,e.id+' '+a);}
  if(e.type==='dictation')assert.ok(e.audio,e.id+' audio');
 }
});
test('accepted answers tolerate case, apostrophe glyphs, whitespace and final punctuation',()=> {
 for (const e of exercises.filter(e=>e.answers)) {
  const transformed=e.answers[0].toLocaleUpperCase('fr').replaceAll('’',"'").replaceAll(' ','   ').trim()+' !';
  assert.equal(gradeAnswer(e,transformed).correct,true,e.id+' normalized');
 }
});
test('empty and meaningless responses receive no full recall credit',()=> {
 for(const e of exercises){assert.equal(gradeAnswer(e,'').correct,false,e.id);if(!e.choices)assert.equal(gradeAnswer(e,'this is absolutely unrelated').grade,0,e.id);}
});
test('accents and meaning-changing homographs do not silently earn full credit',()=> {
 for(const [answer,response] of [['à','a'],['où','ou'],['Je suis française.','Je suis francaise.'],['Il est sûr.','Il est sur.']]) {
  const r=gradeAnswer({answers:[answer]},response);assert.notEqual(r.grade,3);assert.notEqual(r.correct,true);
 }
});
test('hints prevent independent recall and recognition never equals production grade',()=> {
 assert.equal(gradeAnswer({answers:['bonjour']},'bonjour',true).grade,1);
 assert.equal(gradeAnswer({choices:['yes','no'],correct:0},'0').grade,2);
});
test('same-day repetition cannot inflate spaced intervals or streaks',()=> {
 const first=schedule(undefined,3,now);let repeat=first;
 for(let i=1;i<20;i++)repeat=schedule(repeat,3,now+i*1000);
 assert.equal(repeat.intervalDays,first.intervalDays);
 assert.equal(repeat.streak,first.streak);
 assert.equal(repeat.unhintedDays.length,1);
 assert.equal(repeat.retained,false);
});
test('correct answers on separate days can establish delayed retention',()=> {
 const first=schedule(undefined,3,now);const next=schedule(first,3,now+DAY);
 assert.ok(next.intervalDays>first.intervalDays);assert.equal(next.unhintedDays.length,2);assert.equal(next.retained,true);
});
test('daily session has audio and comprehension while avoiding duplicate items',()=> {
 const session=buildSession('daily',emptyState(),exercises,units,undefined,now);
 assert.equal(new Set(session.map(e=>e.id)).size,session.length);
 assert.ok(session.some(e=>e.type==='dictation'||e.type==='listening'),'listening present');
 assert.ok(session.some(e=>e.passage||e.type==='reading'||e.type==='listening'),'connected meaning present');
 assert.ok(session.some(e=>!e.choices&&e.type!=='dictation'),'production present');
});
test('due review is chronologically prioritized',()=> {
 const s=emptyState();exercises.slice(0,3).forEach((e,i)=>s.records[e.id]={due:now-i});
 assert.deepEqual(dueExercises(s,exercises,now).map(e=>e.id),exercises.slice(0,3).reverse().map(e=>e.id));
});
test('record, export and validated import preserve real progress',()=> {
 const e=exercises.find(e=>e.answers);let s=recordAnswer(emptyState(),e,gradeAnswer(e,e.answers[0]),e.answers[0],false,now);
 const imported=validateState(JSON.parse(JSON.stringify(s)),ids);
 assert.deepEqual(imported.records,s.records);assert.deepEqual(imported.days,s.days);assert.deepEqual(imported.mistakes,s.mistakes);
});
test('malformed backup roots and impossible record numbers are rejected',()=> {
 for(const bad of [null,[],{}, {version:999,records:{},days:{},settings:{}}])assert.throws(()=>validateState(bad,ids));
 const s=emptyState();s.records[ids[0]]={seen:1,correct:1,streak:1,intervalDays:1,due:Infinity,lastReviewed:now,lapses:0,lastGrade:3};
 assert.throws(()=>validateState(s,ids));
});
test('streak counts local-day participation without requiring today',()=> {
 const s=emptyState();s.days[localDate(now-DAY)]={attempts:1};assert.equal(currentStreak(s,new Date(now)),1);
});
