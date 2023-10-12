const fs = require('fs');

// Lire le fichier de rapport de couverture
const coverageReport = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));

// Extraire le pourcentage de "branch coverage" du rapport
const branchCoverage = coverageReport.total.branches.pct;
console.log(`Branch coverage: ${branchCoverage}%`);

// Vérifier que le "branch coverage" est d'au moins 80%
if (branchCoverage < 80) {
    console.error('Branch coverage is below 80%');
    process.exit(1);
}
