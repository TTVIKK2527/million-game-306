const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
function load(file, extra={}) {
  const context = vm.createContext({window:{}, console, Math, ...extra});
  vm.runInContext(fs.readFileSync(path.join(root,'js',file),'utf8'), context);
  return context.window;
}
function questions(correctIndex=3, level=1) {
  return Array.from({length:15},(_,i)=>({question:'Question '+i,options:['a','b','c','d'],correctIndex,level,explanations:['a','b','c','d'],hint:'A hint'}));
}
test('audience always totals 100 with every possible correct option',()=>{
  for(let correct=0;correct<4;correct++) for(const level of [1,7,12]) {
    const game=load('game.js').Game;
    game.startGame(questions(correct,level));
    const result=game.useAudience();
    assert.equal(result.reduce((sum,x)=>sum+x.percent,0),100);
    assert.ok(result.every(x=>Number.isInteger(x.percent)&&x.percent>=0));
  }
});
test('earned score starts at zero and remains earned rather than next-question value',()=>{
  const game=load('game.js').Game;game.startGame(questions(0));
  assert.equal(game.getCurrentMoney(),0);game.answerQuestion(0);
  assert.equal(game.getCurrentMoney(),100);assert.equal(game.getFinalMoney(),100);
});
test('incorrect answers end the game and retain only achieved safe level',()=>{
  const game=load('game.js').Game;game.startGame(questions(0));
  for(let i=0;i<5;i++)game.answerQuestion(0);
  const result=game.answerQuestion(1);
  assert.equal(result.isCorrect,false);assert.equal(game.getFinalMoney(),1000);
  assert.equal(game.answerQuestion(0),null);
});
test('difficulty always has five easy five medium and five hard questions',()=>{
  const api=load('questions.js').Questions;
  for(const id of ['001','002','003']) {
    const bank=JSON.parse(fs.readFileSync(path.join(root,'questions',id+'.json')));
    for(let i=0;i<20;i++) {
      const selected=api.selectQuestions(bank,15);
      assert.equal(selected.length,15);
      assert.deepEqual([selected.filter(q=>q.level<=5).length,selected.filter(q=>q.level>5&&q.level<=10).length,selected.filter(q=>q.level>10).length],[5,5,5]);
      for(const q of selected) assert.equal(q.explanations.length,4);
    }
  }
});
