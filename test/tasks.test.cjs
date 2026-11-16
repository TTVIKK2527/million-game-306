const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
test('selected assignment reads assignment and nested solution files',async()=>{
 const calls=[];
 const responses={'tasks.json':{tasks:[{id:'007',name:'Nested',files:['assignment.md','src/main.py']}]},'input/007/assignment.md':'# Test','input/007/src/main.py':'print(1)'};
 const context=vm.createContext({window:{location:{protocol:'http:'}},fetch:async url=>{calls.push(url);return{ok:url in responses,json:async()=>responses[url],text:async()=>responses[url]};}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/tasks.js'),'utf8'),context);
 const result=await context.window.Tasks.loadTaskFiles('007');
 assert.equal(result['src/main.py'],'print(1)');assert.equal(result['assignment.md'],'# Test');
 assert.ok(calls.includes('input/007/src/main.py'));
 await assert.rejects(context.window.Tasks.loadTaskFiles('../secret'));
});
