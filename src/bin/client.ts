const server = process.argv[2];
const password = process.argv[3];

if (typeof server !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Usage: ts-node client.js <server> <password>');
  process.exit(1);
}

if (typeof password !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Usage: ts-node client.js <server> <password>');
  process.exit(1);
}
