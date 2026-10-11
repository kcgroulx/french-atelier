import test from 'node:test';
import assert from 'node:assert/strict';
import {DAY, schedule, emptyState, recordAnswer, gradeAnswer, buildSession, currentStreak, localDate, validateState, escapeHTML} from '../src/core.js';
import {exercises,units} from '../src/content.js';
const now=new Date(2026,9,11,12).getTime();
test('crossing midnight alone is not delayed recall',()=>{const t=new Date(2026,9,11,23,59).getTime();const a=schedule(undefined,3,t);const b=schedule(a,3,t+120000);assert.equal(b.retained,false);assert.equal(b.intervalDays,1);assert.equal(b.streak,1);});
test('same-day repeats do not postpone an already scheduled review',()=>{const a=schedule(undefined,3,now);const b=schedule(a,3,now+3600000);assert.equal(b.due,a.due);});
test('mistake and hint schedules do not count as retained production',()=>{for(const grade of [0,1]){const r=schedule(undefined,grade,now);assert.equal(r.retained,false);assert.ok(r.due<now+DAY);assert.equal(r.unhintedDays.length,0);}});
test('spaced recognition never implies production retention',()=>{let r=schedule(undefined,2,now);r=schedule(r,2,now+DAY);r=schedule(r,2,now+4*DAY);assert.equal(r.retained,false);assert.equal(r.unhintedDays.length,0);});
test('scheduler interval is bounded to 90 days',()=>{let r;for(let i=0;i<100;i++)r=schedule(r,3,now+i*100*DAY);assert.equal(r.intervalDays,90);});
test('state updates do not mutate the prior state',()=>{const e=exercises[0],s=emptyState();const r=recordAnswer(s,e,gradeAnswer(e,e.answers[0]),e.answers[0],false,now);assert.equal(Object.keys(s.records).length,0);assert.equal(r.records[e.id].seen,1);});
test('empty due queues remain empty rather than inventing work',()=>{assert.deepEqual(buildSession('review',emptyState(),exercises,units,undefined,now),[]);});
test('an interrupted streak can include yesterday but cannot bridge an older gap',()=>{const s=emptyState();s.days[localDate(now-2*DAY)]={attempts:10};assert.equal(currentStreak(s,new Date(now)),0);s.days[localDate(now-DAY)]={attempts:1};assert.equal(currentStreak(s,new Date(now)),2);});
test('import removes unknown IDs and dangerous text is always escaped',()=>{const s=emptyState();s.records['unknown']={};const clean=validateState(s,exercises.map(e=>e.id));assert.deepEqual(clean.records,{});assert.equal(escapeHTML('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');});
test('every unit contains a substantial mixed practice bank with audio',()=>{for(const u of units){const e=exercises.filter(e=>e.unit===u.id);assert.ok(e.length>=20,u.id);assert.ok(e.some(x=>x.type==='dictation'||x.type==='listening'),u.id);assert.ok(new Set(e.map(x=>x.type)).size>=2,u.id);assert.ok(e.some(x=>x.type==='reading'||x.type==='translate'||x.type==='cloze'),u.id);}});

test('a successful assisted repair preserves the original notebook mistake',()=>{const e=exercises[0];let s=recordAnswer(emptyState(),e,gradeAnswer(e,'wrong answer'),'wrong answer',false,now);s=recordAnswer(s,e,gradeAnswer(e,e.answers[0],true),e.answers[0],true,now+1000);assert.equal(s.mistakes[e.id].response,'wrong answer');assert.equal(s.mistakes[e.id].resolved,false);s=recordAnswer(s,e,gradeAnswer(e,e.answers[0]),e.answers[0],false,now+DAY);assert.equal(s.mistakes[e.id].resolved,true);});
