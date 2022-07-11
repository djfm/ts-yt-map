import Browser from '../browser';
import { loadConfig } from '../lib';

const start = async (): Promise<Browser> => {
  const cfg = loadConfig();
  const browser = await Browser.launch(cfg.chrome);

  return browser;
};

function main() {
  start().then(() => {
    // eslint-disable-next-line no-console
    console.log('done');
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
}
