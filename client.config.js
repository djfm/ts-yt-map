module.exports = {
  apps: [
    {
      name: 'client',
      script: 'dist/bin/client.js',
      watch: false,
      instances: process.env.CONCURRENCY ?? 'max',
      exec_mode: 'cluster',
    },
  ],
};
