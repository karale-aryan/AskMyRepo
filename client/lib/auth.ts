export function getGitHubLoginUrl() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  return `${backendUrl}/oauth2/authorization/github`;
}
