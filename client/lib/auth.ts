export function getGitHubLoginUrl() {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://askmyrepo-gp6p.onrender.com";
  return `${backendUrl}/oauth2/authorization/github`;
}

