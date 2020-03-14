import { execSync } from 'child_process';

export function renderFetch(text: string[], image: string) {
    // clear whatever was before
    process.stdout.write('\x1Bc');
  
    // calculate image to be a bit less than half, add spaces
    const terminalWidth = process.stdout.columns || 20;
    const size = Math.floor(terminalWidth / 4) - 4;
    const spaces = ' '.repeat(size * 2 + 4);
  
    // kitteh image
    execSync(`kitty +kitten icat --place ${size*2}x${size*2}@0x0 --scale-up ${image}`);
  
    text.map(s => console.log(spaces + s));
    console.log('\n'.repeat(Math.max(size - text.length, 0)))
  }