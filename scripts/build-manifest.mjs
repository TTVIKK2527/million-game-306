import {readdir, readFile, writeFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignore = new Set(['node_modules', '.git', 'vendor', 'build', 'dist']);
const textTypes = new Set(['.md','.txt','.html','.css','.js','.json','.ts','.py','.java','.sql']);
async function filesIn(folder, prefix='') {
  const files=[];
  for (const entry of (await readdir(folder,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink() || ignore.has(entry.name) || entry.name.startsWith('.')) continue;
    const relative=prefix+entry.name;
    if(entry.isDirectory()) files.push(...await filesIn(path.join(folder,entry.name),relative+'/'));
    else if(entry.isFile() && textTypes.has(path.extname(entry.name))) {
      const data=await readFile(path.join(folder,entry.name));
      if(data.length>131072) throw new Error('Text file too large: '+relative);
      new TextDecoder('utf-8',{fatal:true}).decode(data);
      files.push(relative);
    }
  }
  return files;
}
const tasks=[];
for(const directory of (await readdir(path.join(root,'input'),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
  if(!directory.isDirectory() || !/^\d+$/.test(directory.name))continue;
  const folder=path.join(root,'input',directory.name);
  const files=await filesIn(folder);
  if(!files.includes('assignment.md')||files.length<2)throw new Error('Assignment and solution required: '+directory.name);
  const source=await readFile(path.join(folder,'assignment.md'),'utf8');
  const title=source.match(/^#\s+(.+)$/m)?.[1]?.trim()||'Ülesanne '+directory.name;
  const size=(await Promise.all(files.map(file=>stat(path.join(folder,file))))).reduce((sum,x)=>sum+x.size,0);
  if(size>2097152)throw new Error('Assignment context too large: '+directory.name);
  tasks.push({id:directory.name,name:title,files});
}
await writeFile(path.join(root,'tasks.json'),JSON.stringify({tasks},null,2)+'\n');
console.log('Built manifest:',tasks.length,'assignments');
