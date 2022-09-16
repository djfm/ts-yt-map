module.exports = {
  apps: [
    {
      name: 'client',
      script: 'dist/bin/client.js',
      watch: false,
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
