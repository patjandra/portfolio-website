/* Side index: highlights which project is on screen (live story or plain page). */
const stage = document.getElementById('stage')!;
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.index a'));
const marker = document.querySelector<HTMLElement>('.marker');
const works = links.map((a) => document.querySelector(a.getAttribute('href')!) as HTMLElement | null);
let cur = 0;
// where each project starts in the story (vh), taken from the timeline
const STARTS = [0, 690, 940, 1228, 1490, 1668];

function place() {
  links.forEach((a, i) => {
    a.setAttribute('aria-current', String(i === cur));
    a.parentElement!.classList.toggle('seen', i <= cur);
  });
  if (marker) marker.style.transform = `translateY(${links[cur].parentElement!.offsetTop}px)`;
}

function pick() {
  const live = stage.classList.contains('live') && scrollY < stage.offsetHeight - innerHeight;
  let best = 0;
  if (live) {
    const sv = (-stage.getBoundingClientRect().top / innerHeight) * 100;
    STARTS.forEach((s, i) => { if (sv >= s) best = i; });
  } else {
    works.forEach((w, i) => { if (w && w.getBoundingClientRect().top <= innerHeight * 0.5) best = i; });
  }
  if (best !== cur) { cur = best; place(); }
}

addEventListener('scroll', pick, { passive: true });
addEventListener('resize', place);
place();
pick();
