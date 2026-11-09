class BoardGuide extends HTMLElement {
  connectedCallback() {
    const de = this.getAttribute('language') === 'de';
    const biopsy = this.getAttribute('activity') === 'biopsy';
    const tr = (en, german) => de ? german : en;
    const names = {heart:tr('Heart','Herz'),left:tr('Kidney on the left','Niere links im Bild'),right:tr('Kidney on the right','Niere rechts im Bild')};
    const trunk = 'M240 334 V233';
    const paths = {heart:trunk+' V99',left:trunk+' C240 200 175 190 119 187',right:trunk+' C240 200 305 190 361 187'};
    const steps = biopsy ? [
      tr('Find the clay in the kidney on the right. Trace its clear tube back to the lower opening.','Suche die Knete in der Niere rechts im Bild. Folge dem Schlauch bis zum unteren Eingang.'),
      tr('With your guide, insert the closed biopsy tool at the lower opening. Follow the right branch inside the tube.','Führe das geschlossene Biopsiewerkzeug mit deiner Betreuungsperson unten ein. Folge im Schlauch der rechten Abzweigung.'),
      tr('At the clay, open the tip and close it around a small piece.','Öffne die Spitze an der Knete und schließe sie um ein kleines Stück.'),
      tr('Keep the tip closed. Draw the sample back through the same tube and release it at the entrance.','Halte die Spitze geschlossen. Ziehe die Probe durch denselben Schlauch zurück und lege sie am Eingang ab.')
    ] : [
      tr('Choose an organ. Trace the route from the lower opening to your target.','Wähle ein Organ. Fahre den Weg vom unteren Eingang bis zum Ziel mit dem Finger nach.'),
      tr('Place the catheter tip in the opening. Advance a little at a time and watch the tip through the clear tube.','Setze die Katheterspitze unten ein. Schiebe sie langsam vor und beobachte sie im durchsichtigen Schlauch.'),
      tr('Follow the branch to your chosen organ. Stop when the tip reaches it.','Folge der Abzweigung zu deinem Zielorgan. Halte an, sobald die Spitze dort ankommt.'),
      tr('Gently slide the catheter back along the same route until it leaves the model.','Ziehe den Katheter auf demselben Weg langsam wieder aus dem Modell.')
    ];
    const kidney = '<path d="M-8 -43 C-43 -43 -54 -14 -50 13 C-47 42 -25 56 -5 47 Q14 40 12 26 Q11 17 0 11 Q-10 3 1 -5 Q16 -13 13 -27 Q10 -42 -8 -43Z" fill="url(#bg-kidney)" stroke="#945d4e" stroke-width="2.4"/><path d="M-10 -31 C-32 -29 -39 -10 -37 9 Q-34 32 -17 36 M-31 -13 Q-24 -6 -10 0 M-34 7 L-13 5 M-25 25 L-11 11" fill="none" stroke="#f6c8ae" stroke-width="4" stroke-linecap="round"/>';
    const tubes = Object.values(paths).join(' ');
    this.innerHTML = `<style>
    board-guide .bg-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(20px,4vw,52px);align-items:center}
    board-guide .bg-grid svg{display:block;width:100%;height:auto}board-guide .bg-actions{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
    board-guide .bg-actions button{font:inherit;padding:7px 14px;border-radius:20px;cursor:pointer;border:1px solid #759990;background:#fff;color:#15453e}
    board-guide .bg-actions button[aria-pressed=true]{background:#15453e;color:white}
    board-guide .bg-list{padding-left:1.65em}board-guide .bg-list li{padding:7px 10px;border-inline-start:3px solid transparent;line-height:1.5}
    board-guide .bg-list li[aria-current=step]{border-color:#c17c3e;background:#eaf3ee;color:#183f37}
    @media(max-width:720px){board-guide .bg-grid{grid-template-columns:1fr}}
    </style><section class="lap-guide"><h2>${biopsy?tr('Collect a sample through the tube','Eine Probe durch den Schlauch entnehmen'):tr('Guide the catheter to an organ','Den Katheter zum Organ führen')}</h2>
    <div class="bg-actions">${biopsy?'':Object.entries(names).map(([key,label])=>`<button type="button" data-target="${key}">${label}</button>`).join('')}<button type="button" data-play>↻ ${tr('Play again','Erneut abspielen')}</button></div>
    <div class="bg-grid"><svg viewBox="0 0 480 362" role="img" aria-label="${tr('Training board with a heart, two kidneys and branching tubes','Übungsmodell mit Herz, zwei Nieren und verzweigten Schläuchen')}">
    <defs><linearGradient id="bg-board" x2="1" y2="1"><stop stop-color="#f6faf4"/><stop offset="1" stop-color="#dcece6"/></linearGradient><linearGradient id="bg-kidney" x2="1" y2="1"><stop stop-color="#edb697"/><stop offset="1" stop-color="#c78673"/></linearGradient></defs>
    <rect x="4" y="4" width="472" height="354" rx="24" fill="url(#bg-board)" stroke="#b8d0c7"/>
    <g transform="translate(120 186)">${kidney}</g><g transform="translate(360 186) scale(-1 1)">${kidney}</g>
    <g stroke="#935951" stroke-width="2.5" stroke-linejoin="round"><path d="M215 58 Q209 46 218 36 L225 38 L224 50 L232 51 L234 28 L243 29 L244 48 L251 45 L259 34 L266 39 L259 54 Q279 66 267 86 Q258 103 239 114 Q215 105 207 86 Q200 69 215 58Z" fill="#db9688"/><path d="M213 64 Q232 55 248 66 M232 62 Q247 83 238 101" fill="none" stroke="#f3c8b6"/></g>
    <g fill="none" stroke-linecap="round"><path d="${tubes}" stroke="#729c98" stroke-width="17"/><path d="${tubes}" stroke="#d4eeeb" stroke-width="13"/><path d="${tubes}" stroke="#f2fbf8" stroke-width="7"/></g>
    ${biopsy?'<path d="M358 181 Q362 174 369 179 Q377 176 378 185 Q381 193 372 196 Q362 199 357 192Z" fill="#c97485" stroke="#93485e" stroke-width="2"/>':''}
    <path data-shaft fill="none" stroke="${biopsy?'#506b77':'#176d63'}" stroke-width="4" stroke-linecap="round"/>
    <g data-tip>${biopsy?'<path data-jaws fill="none" stroke="#294f5a" stroke-width="2.5" stroke-linecap="round"/>':'<circle r="4" fill="#ebae53" stroke="#74552a"/>'}</g>
    <circle data-piece r="3.8" fill="#f5aa6b" stroke="#895343" stroke-width="1.4"/></svg>
    <ol class="bg-list">${steps.map(step=>'<li>'+step+'</li>').join('')}</ol></div></section>`;
    const shaft = this.querySelector('[data-shaft]'), tip = this.querySelector('[data-tip]'), piece = this.querySelector('[data-piece]');
    let target = biopsy ? 'right' : 'heart';
    const play = () => {
      cancelAnimationFrame(this.frame);
      this.querySelectorAll('[data-target]').forEach(button=>button.setAttribute('aria-pressed', button.dataset.target===target));
      shaft.setAttribute('d',paths[target]);
      const length=shaft.getTotalLength();
      shaft.style.strokeDasharray=length+' '+length;
      const start=performance.now();
      const clamp=x=>Math.max(0,Math.min(1,x));
      const render = now => {
        const t=clamp((now-start)/11500);
        const progress=t<0.60?clamp((t-0.08)/0.52):1-clamp((t-0.73)/0.25);
        const distance=progress*length;
        const p=shaft.getPointAtLength(distance);
        const a=shaft.getPointAtLength(Math.max(0,distance-1)), b=shaft.getPointAtLength(Math.min(length,distance+1));
        tip.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI})`);
        shaft.style.strokeDashoffset=length-distance;
        if(biopsy){
          const open=t>=0.59&&t<0.67 || t>=0.98;
          this.querySelector('[data-jaws]').setAttribute('d',open?'M-4 0 L4 -4 M-4 0 L4 4':'M-4 0 L4 -1 M-4 0 L4 1');
          piece.setAttribute('cx',t<0.67?364:p.x);
          piece.setAttribute('cy',t<0.67?187:p.y+(t>=0.98?6:0));
        }else piece.style.display='none';
        const step=t<0.08?0:t<(biopsy?0.59:0.35)?1:t<0.73?2:3;
        this.querySelectorAll('li').forEach((li,i)=>li.setAttribute('aria-current',i===step?'step':'false'));
        if(t<1)this.frame=requestAnimationFrame(render);
      };
      render(start);
    };
    this.onclick=event=>{
      const button=event.target.closest('button');
      if(!button)return;
      if(button.dataset.target)target=button.dataset.target;
      play();
    };
    this.observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){this.observer.disconnect();play();}
    });
    shaft.setAttribute('d',paths[target]);shaft.style.strokeDasharray='0 9999';
    tip.setAttribute('transform','translate(240 334)');piece.style.display=biopsy?'':'none';piece.setAttribute('cx',364);piece.setAttribute('cy',187);
    this.querySelector('[data-target="heart"]')?.setAttribute('aria-pressed','true');
    this.observer.observe(this);
  }
  disconnectedCallback(){cancelAnimationFrame(this.frame);this.observer?.disconnect();}
}
customElements.define('board-guide',BoardGuide);
