module.exports = {
  apps: [
    {
      name: 'server',
      script: 'src/bin/server.ts',
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
    },
  ],
};
