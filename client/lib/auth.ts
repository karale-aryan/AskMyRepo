export function getGitHubLoginUrl() {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://askmyrepo-1-jf80.onrender.com";
  return `${backendUrl}/oauth2/authorization/github`;
}

