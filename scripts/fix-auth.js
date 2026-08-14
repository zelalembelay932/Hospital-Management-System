const fs = require('fs');
const files = [
  'hospital-system/admin-dashboard/src/contexts/AuthContext.jsx',
  'hospital-system/admin-dashboard/src/services/api.js',
  'hospital-system/public-website/src/contexts/AuthContext.jsx',
  'hospital-system/public-website/src/pages/BookAppointment.jsx',
  'hospital-system/public-website/src/pages/MyAppointments.jsx',
  'hospital-system/public-website/src/pages/Profile.jsx',
  'hospital-system/public-website/src/pages/PatientDashboard.jsx',
  'hospital-system/doctor-dashboard/src/services/api.js'
];
const re = /Authorization:\s*`[^`\n\r]*/g;
files.forEach(fp => {
  if (!fs.existsSync(fp)) {
    console.log('missing', fp);
    return;
  }
  let s = fs.readFileSync(fp, 'utf8');
  if (re.test(s)) {
    let ns = s.replace(re, "Authorization: `Bearer ${token}`");
    fs.writeFileSync(fp, ns, 'utf8');
    console.log('patched', fp);
  } else {
    console.log('no match', fp);
  }
});
