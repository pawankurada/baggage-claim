import {mkdir,copyFile,cp,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),output=path.join(root,'dist');
await mkdir(output,{recursive:true});
for(const file of ['index.html','style.css'])await copyFile(path.join(root,file),path.join(output,file));
for(const folder of ['src','public'])await cp(path.join(root,folder),path.join(output,folder),{recursive:true});
await writeFile(path.join(output,'.nojekyll'),'');
console.log('GitHub Pages files prepared in dist/ (original photos, tests and local server excluded).');
