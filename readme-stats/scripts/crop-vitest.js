const fs = require('fs');
let svg = fs.readFileSync('public/badges/vitest-raw-again.svg', 'utf8');

// Remove the path that draws the text "VITEST"
svg = svg.replace(/<path d="M69\.5859[\s\S]*?\/>/, '');

// Adjust the viewBox to tightly wrap the checkmark AND parentheses
// The checkmark and parentheses span roughly from X=97 to X=123
svg = svg.replace('viewBox="0 0 123 15"', 'viewBox="97 -4 27 23"');

fs.writeFileSync('public/badges/vitest-icon.svg', svg);
const base64 = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
console.log(base64);
