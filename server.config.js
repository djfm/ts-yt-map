module.exports = {
  apps: [
    {
      name: 'server',
      script: 'dist/bin/server.js',
      watch: ['./src', './views'],
      ignore_watch: ['node_modules', 'logs'],
      watch_delay: 200,
      cwd: __dirname,
    },
  ],
};
