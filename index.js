const Mocha = require('mocha');
const path = require('path');
const fs = require('fs');

// Configure Mocha
const mocha = new Mocha({
    timeout: 20000
});

// Directory containing test files
const testDir = path.join(__dirname, 'tests');

// Dynamically load all test files in the "tests" directory
fs.readdirSync(testDir)
    .filter(file => file.endsWith('.js'))
    .forEach(file => mocha.addFile(path.join(testDir, file)));

// Run tests type "node index.js"
mocha.run(failures => {
    process.exit(failures ? 1 : 0);
});
