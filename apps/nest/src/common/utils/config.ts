export const getRedisConfig = (url: string) => {
  const redisUrl = url;
  if (!redisUrl) return {};
  try {
    const { port, password, username, hostname } = new URL(redisUrl);
    return {
      host: hostname,
      port: +port,
      password: password,
      username: username,
    };
  } catch (e) {
    return {};
  }
};
