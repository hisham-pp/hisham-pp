export function generateStatsSvg(stats: any) {
  const { name, totalStars, totalCommits, totalPRs, totalIssues, rank } = stats;

  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #58A6FF; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: #C9D1D9; }
        .icon { fill: #58A6FF; }
      </style>
      <rect width="495" height="195" rx="4.5" fill="#0D1117" stroke="#0D1117" />
      <text x="25" y="35" class="header">${name}'s GitHub Stats</text>
      
      <!-- Total Stars -->
      <g transform="translate(25, 55)">
        <svg class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
          <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
        </svg>
        <text x="25" y="12.5" class="stat">Total Stars Earned:</text>
        <text x="170" y="12.5" class="stat" font-weight="600">${totalStars}</text>
      </g>
      
      <!-- Total Commits -->
      <g transform="translate(25, 85)">
        <svg class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
          <path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.324V4.75A.75.75 0 017.75 4z"></path>
        </svg>
        <text x="25" y="12.5" class="stat">Total Commits:</text>
        <text x="170" y="12.5" class="stat" font-weight="600">${totalCommits}</text>
      </g>
      
      <!-- Total PRs -->
      <g transform="translate(25, 115)">
        <svg class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
          <path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.25 2.25 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1.5 1.5 0 011.5 1.5v5.628a2.25 2.25 0 101.5 0V5.5A3 3 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path>
        </svg>
        <text x="25" y="12.5" class="stat">Total PRs:</text>
        <text x="170" y="12.5" class="stat" font-weight="600">${totalPRs}</text>
      </g>
      
      <!-- Total Issues -->
      <g transform="translate(25, 145)">
        <svg class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
          <path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path>
        </svg>
        <text x="25" y="12.5" class="stat">Total Issues:</text>
        <text x="170" y="12.5" class="stat" font-weight="600">${totalIssues}</text>
      </g>
      
      <!-- Rank -->
      <g transform="translate(400, 75)">
        <circle cx="35" cy="35" r="40" fill="none" stroke="#58A6FF" stroke-width="4"/>
        <text x="35" y="45" font-size="28" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="700" fill="#58A6FF" text-anchor="middle">${rank}</text>
      </g>
    </svg>
  `;
}

export function generateTopLangsSvg(langs: any[]) {
  const bars = langs.map((lang, index) => {
    return `
      <rect x="${index * 20}%" y="0" width="${lang.percent}%" height="8" fill="${lang.color}" />
    `;
  }).join('');
  
  const legend = langs.map((lang, index) => {
    const x = (index % 2 === 0) ? 25 : 180;
    const y = 80 + Math.floor(index / 2) * 25;
    return `
      <g transform="translate(${x}, ${y})">
        <circle cx="5" cy="5" r="5" fill="${lang.color}" />
        <text x="15" y="9" class="stat" font-weight="600">${lang.name}</text>
        <text x="100" y="9" class="stat">${lang.percent}%</text>
      </g>
    `;
  }).join('');

  return `
    <svg width="300" height="165" viewBox="0 0 300 165" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: #58A6FF; }
        .stat { font: 400 12px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: #C9D1D9; }
      </style>
      <rect width="300" height="165" rx="4.5" fill="#0D1117" stroke="#0D1117" />
      <text x="25" y="30" class="header">Most Used Languages</text>
      
      <!-- Progress Bar -->
      <svg x="25" y="45" width="250" height="8" rx="4">
        ${bars}
      </svg>
      
      <!-- Legend -->
      ${legend}
    </svg>
  `;
}
