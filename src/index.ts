
import colors from 'colors/safe';
import * as os from 'os';
import * as si from 'systeminformation';
import { exec } from 'child_process';
import { promisify } from 'util';

import { renderFetch } from './render';
import { colorblock } from './modules/colorblock';

const execPromise = promisify(exec);

function info(name: string, desc: string): string {
  return '  ' + colors.bold(colors.cyan(name)) + '(' + colors.green(`"${desc}"`) + ');';
}

type MaybePromise<T> = T|Promise<T>;
type MaybePromiseOrFunction<T> = MaybePromise<T>|(() => MaybePromise<T>);

async function loadConfig() {
  const p = './config.js'
  const configFn =  await import(p);
  return configFn.default({
    colors,
  });
}

async function main() {
  const config = await loadConfig();

  const texts : MaybePromiseOrFunction<string>[] = [
    colors.gray('/** TODO: Do stuff */'),
    '',
    colors.bold(colors.blue('fn ') + colors.yellow(os.userInfo().username) + '::' + colors.yellow(os.hostname())) + '(args: string[]) {',
    info('setWaifu', 'Misaka Mikoto'),

    async () => info('os', (await si.osInfo()).distro + ' ' + os.arch),

    info('wm', process.env.XDG_CURRENT_DESKTOP || process.env.GDMSESSION || ''),
    info('terminal', process.env.TERM || ''),

    function uptime() {
      const upMinutes = Math.floor(os.uptime() / 60);
      const uptimeHours = Math.floor(upMinutes / 60)
      const uptimeMins = upMinutes % 60
  
      return info('upTime', `${uptimeHours}hr ${uptimeMins}min`)
    },

    async () => info('cpu', (await si.cpu()).brand),
    async () => info('gpu', ((await si.graphics()).controllers[0].model).trim()),

    async function display() {
      const { resolutionx, resolutiony } = (await si.graphics()).displays[0];
      return info('display',resolutionx+'x'+resolutiony)
    },
    info('mem', `${Math.floor(os.freemem()/10**6)}MB / ${Math.floor(os.totalmem()/10**6)}MB`),
    colors.bold(colors.blue('  return')) + ' ⚡;',
    '}',
    '',
    
    colorblock,
    colorblock,
  ];

  const t = await Promise.all(texts.map(x => typeof x === 'function' ? x() : x));
  renderFetch(t, config.image);
}

main();