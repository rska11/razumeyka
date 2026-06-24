module.exports = {
  apps: [
    {
      name: "razumeyka",
      script: "npm",
      args: "start",
      cwd: "/var/www/razumeyka",
      listen_timeout: 15000,
      kill_timeout: 10000,
      env: {
        PORT: 3001,
        NODE_ENV: "production",
        DATABASE_URL: "file:/var/www/razumeyka-data/prod.db",
        NEXT_PUBLIC_SITE_URL: "https://razumeyka-school.ru",
      },
    },
  ],
};
