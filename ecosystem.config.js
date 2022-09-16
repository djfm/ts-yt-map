module.exports = {
  apps: [
    {
      name: 'server',
      script: 'src/bin/server.ts',
      watch: ['./src', './views'],
      ignore_watch: ['node_modules', 'logs'],
      watch_delay: 200,
    },
  ],
};
