const fs = require('fs');
const fp = 'hospital-system/public-website/src/pages/BookAppointment.jsx';
let s = fs.readFileSync(fp, 'utf8');
const tokenLine = "const token = localStorage.getItem('token');";
const tokenIdx = s.indexOf(tokenLine);
if (tokenIdx === -1) { console.log('token line not found'); process.exit(0); }
const cfgStart = 'const config = {';
const cfgIdx = s.indexOf(cfgStart, tokenIdx);
if (cfgIdx === -1) { console.log('config start not found'); process.exit(0); }
const afterCfg = s.slice(cfgIdx);
const endIdxRel = afterCfg.indexOf('};');
if (endIdxRel === -1) { console.log('config end not found'); process.exit(0); }
const endIdx = cfgIdx + endIdxRel + 2;
const newCfg = "const config = {\n        headers: { Authorization: 'Bearer ' + token }\n      };";
const ns = s.slice(0, cfgIdx) + newCfg + s.slice(endIdx);
fs.writeFileSync(fp, ns, 'utf8');
console.log('patched', fp);
