/* Jump links: land instantly on a project's readable frame instead of smooth-scrolling through the whole story.
   Handles the project list, the side index, the hero's "jump to the full list" link and deep links like /#remindly. */
import { HOLD } from '../config/timeline';

const stage = document.getElementById('stage');
const list = document.getElementById('projects-list');

function go(name: string): boolean {
  if (!stage) return false;
  let top: number;
  if (name === 'projects-list' && list) top = list.getBoundingClientRect().top + scrollY;
  else if (HOLD[name] != null) top = stage.getBoundingClientRect().top + scrollY + (HOLD[name] / 100) * innerHeight;
  else return false;
  window.scrollTo({ top, behavior: 'instant' });
  return true;
}

if (stage?.classList.contains('live')) {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a[href^="#"]');
    if (!a) return;
    const name = a.getAttribute('href')!.slice(1);
    if (go(name)) { e.preventDefault(); history.replaceState(null, '', '#' + name); }
  });
  if (location.hash) requestAnimationFrame(() => go(location.hash.slice(1)));
}
