import test from 'node:test';
import assert from 'node:assert/strict';
import {quizzes} from '../src/quizzes.js';
import {validateQuiz,showBagQuiz} from '../src/quiz.js';
test('all five editable quizzes have four options and one correct answer',()=>{
 assert.equal(quizzes.length,5);quizzes.forEach(quiz=>assert.doesNotThrow(()=>validateQuiz(quiz)));
});
test('LA fake-out waits for its reveal before a bag can be claimed',()=>{
 const element=()=>({children:[],append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},focus(){}});
 const document={createElement:element},overlay=element();let delayed,claims=0;const sounds=[];
 const ui=showBagQuiz(document,overlay,quizzes[4],()=>claims++,(fn,ms)=>{delayed=fn;assert.equal(ms,1400);},{answerWrong:()=>sounds.push('wrong'),answerCorrect:()=>sounds.push('correct')});
 ui.buttons[3].onclick();assert.equal(ui.feedback.textContent,'Wrong 😢');assert.equal(ui.claim.hidden,true);assert.deepEqual(sounds,['wrong']);
 assert.ok(ui.buttons.every(button=>button.disabled));
 // Even queued or rapid clicks cannot replace the fake-out after success.
 ui.buttons[0].onclick();ui.buttons[1].onclick();ui.buttons[2].onclick();
 assert.equal(ui.feedback.textContent,'Wrong 😢');
 ui.claim.onclick();assert.equal(claims,0);
 delayed();assert.deepEqual(sounds,['wrong','correct']);assert.equal(ui.feedback.textContent,"Sike, that's obviously correct 🎉");assert.equal(ui.claim.hidden,false);
 ui.claim.onclick();ui.claim.onclick();assert.equal(claims,1);
});
test('invalid quiz definitions cannot silently award a bag',()=>{
 assert.throws(()=>validateQuiz({...quizzes[0],options:quizzes[0].options.slice(1)}));
 assert.throws(()=>validateQuiz({...quizzes[0],options:quizzes[0].options.map(option=>({...option,correct:true}))}));
 assert.throws(()=>validateQuiz({...quizzes[0],options:quizzes[0].options.map(option=>({...option,correct:false}))}));
});

