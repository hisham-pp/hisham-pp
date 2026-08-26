export async function fetchGitHubStats(username: string) {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    throw new Error("GITHUB_TOKEN is missing");
  }

  const query = `
    query userInfo($login: String!) {
      user(login: $login) {
        name
        login
        contributionsCollection {
          totalCommitContributions
        }
        pullRequests(first: 1) {
          totalCount
        }
        issues(first: 1) {
          totalCount
        }
        followers {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
          nodes {
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0].message}`);
  }

  const user = data.data.user;
  
  const totalStars = user.repositories.nodes.reduce(
    (acc: number, repo: any) => acc + repo.stargazers.totalCount,
    0
  );

  return {
    name: user.name || user.login,
    totalCommits: user.contributionsCollection.totalCommitContributions,
    totalPRs: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    totalStars: totalStars,
    rank: "A+", // Simplified rank logic for now
  };
}

export async function fetchTopLanguages(username: string) {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    throw new Error("GITHUB_TOKEN is missing");
  }

  const query = `
    query topLangs($login: String!) {
      user(login: $login) {
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
          nodes {
            name
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  color
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0].message}`);
  }

  const repos = data.data.user.repositories.nodes;
  const langMap: Record<string, { name: string; color: string; size: number }> = {};

  repos.forEach((repo: any) => {
    repo.languages.edges.forEach((edge: any) => {
      const { size, node } = edge;
      if (!langMap[node.name]) {
        langMap[node.name] = { name: node.name, color: node.color, size: 0 };
      }
      langMap[node.name].size += size;
    });
  });

  const totalSize = Object.values(langMap).reduce((acc, curr) => acc + curr.size, 0);

  const topLangs = Object.values(langMap)
    .sort((a, b) => b.size - a.size)
    .slice(0, 5)
    .map((lang) => ({
      ...lang,
      percent: ((lang.size / totalSize) * 100).toFixed(2),
    }));

  return topLangs;
}
