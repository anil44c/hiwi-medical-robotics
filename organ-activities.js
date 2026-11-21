/* Bilingual anatomy explorer and touch/keyboard-friendly organ puzzle. */
const organActivityState={active:0,placed:new Set(),selected:null,hints:false,cursor:[300,350],message:null};
const organWords=(en,de)=>lang==='de'?de:en;
const abdomenOrgans=[
 {
  "id": "liver",
  "color": "#a54d45",
  "edge": "#7f3936",
  "highlight": "#f9d2b5",
  "en": "Liver",
  "de": "Leber",
  "pin": [
   39,
   34
  ],
  "at": [
   247,
   211
  ],
  "zone": [
   105,
   62
  ],
  "box": [
   135,
   142,
   228,
   140
  ],
  "path": "M154 193 C164 164 216 150 273 158 C301 163 329 175 350 191 C339 214 307 227 280 235 C250 244 217 256 177 269 C156 257 146 231 154 193 Z",
  "details": "M173 196 C207 169 262 174 285 179 M183 254 Q247 232 319 204",
  "fact": [
   "I process nutrients and make bile, which helps digest fats.",
   "Ich verarbeite Nährstoffe und bilde Galle. Sie hilft bei der Fettverdauung."
  ],
  "hint": [
   "Upper right of the body — on your left in this front view.",
   "Rechts oben im Körper – in dieser Vorderansicht links im Bild."
  ]
 },
 {
  "id": "stomach",
  "color": "#d87c91",
  "edge": "#ad5066",
  "highlight": "#ffe6cf",
  "en": "Stomach",
  "de": "Magen",
  "pin": [
   63,
   51
  ],
  "at": [
   361,
   244
  ],
  "zone": [
   63,
   75
  ],
  "box": [
   298,
   166,
   121,
   145
  ],
  "path": "M331 175 L347 175 L347 207 C358 192 374 190 387 200 C409 218 407 241 396 262 C382 286 360 302 340 296 C318 291 305 275 303 260 L321 249 C326 264 339 272 351 265 C365 255 360 247 348 241 C331 238 328 223 330 208 Z",
  "details": "M378 207 Q401 238 374 275 M322 280 Q345 293 361 283",
  "fact": [
   "I mix food with digestive juices.",
   "Ich mische Nahrung mit Verdauungssäften."
  ],
  "hint": [
   "Upper left of the body, next to the liver.",
   "Links oben im Körper, neben der Leber."
  ]
 },
 {
  "id": "small",
  "color": "#d69b74",
  "edge": "#b66e56",
  "highlight": "#f7d8b6",
  "en": "Small intestine",
  "de": "Dünndarm",
  "pin": [
   50,
   72
  ],
  "at": [
   299,
   441
  ],
  "zone": [
   83,
   83
  ],
  "box": [
   205,
   350,
   184,
   171
  ],
  "stroke": true,
  "width": 22,
  "path": "M233 386 C253 367 275 374 295 384 S348 391 365 378 M231 414 C250 398 273 423 296 414 S342 398 363 416 M229 445 C251 425 272 460 299 441 S344 429 364 450 M232 476 C254 455 286 493 309 473 S348 461 359 483 M245 502 C273 487 307 514 346 496",
  "details": "M238 383 C255 375 271 381 287 386 M241 443 Q263 440 286 449 M256 474 Q277 472 291 480",
  "detailWidth": 3,
  "fact": [
   "Most nutrients from your food pass into the body through me.",
   "Durch mich gelangen die meisten Nährstoffe aus dem Essen in den Körper."
  ],
  "hint": [
   "In the centre, inside the frame of the large intestine.",
   "In der Mitte, innerhalb des Rahmens aus Dickdarm."
  ]
 },
 {
  "id": "large",
  "color": "#c9825d",
  "edge": "#ac624d",
  "highlight": "#f2c9a5",
  "en": "Large intestine",
  "de": "Dickdarm",
  "pin": [
   30,
   65
  ],
  "at": [
   304,
   426
  ],
  "zone": [
   121,
   117
  ],
  "box": [
   170,
   307,
   274,
   279
  ],
  "stroke": true,
  "width": 25,
  "path": "M203 525 C196 509 195 462 196 426 L193 365 C190 343 202 334 220 339 C265 352 334 351 383 338 C402 333 415 344 413 363 L414 474 C414 501 406 519 389 529 C371 541 344 529 334 543 C327 554 331 563 347 569",
  "details": "M194 378 L217 381 M194 424 L215 426 M194 472 L216 473 M257 345 L258 362 M312 348 L313 365 M365 342 L363 361 M395 397 L418 397 M394 450 L419 450 M392 496 L414 500",
  "detailWidth": 3,
  "fact": [
   "I absorb water and help form stool.",
   "Ich nehme Wasser auf und helfe, den Stuhl zu formen."
  ],
  "hint": [
   "Make a frame around the small intestine.",
   "Ich bilde einen Rahmen um den Dünndarm."
  ]
 },
 {
  "id": "gall",
  "color": "#5e9567",
  "edge": "#397550",
  "highlight": "#d6e8b1",
  "en": "Gallbladder",
  "de": "Gallenblase",
  "pin": [
   41,
   47
  ],
  "at": [
   255,
   270
  ],
  "zone": [
   32,
   38
  ],
  "box": [
   230,
   238,
   50,
   68
  ],
  "path": "M257 244 C265 246 271 254 270 266 C268 288 256 301 244 294 C233 286 241 270 250 259 L251 245 Z",
  "details": "M257 257 C260 274 255 285 250 289",
  "fact": [
   "I store bile made by the liver and release it to help digest fats.",
   "Ich speichere Galle aus der Leber und gebe sie für die Fettverdauung ab."
  ],
  "hint": [
   "A small pouch tucked beneath the liver.",
   "Ein kleiner Beutel direkt unter der Leber."
  ]
 },
 {
  "id": "pancreas",
  "color": "#d4ad60",
  "edge": "#ad8544",
  "highlight": "#ffe6ae",
  "en": "Pancreas",
  "de": "Bauchspeicheldrüse",
  "pin": [
   53,
   46
  ],
  "at": [
   328,
   289
  ],
  "zone": [
   78,
   38
  ],
  "box": [
   249,
   259,
   174,
   63
  ],
  "path": "M263 289 C277 275 292 277 308 282 C334 288 365 273 395 270 C413 269 417 279 405 287 C383 301 351 301 330 306 C301 315 279 315 263 305 C256 300 258 293 263 289 Z",
  "details": "M274 296 Q304 309 343 293 Q369 286 394 282",
  "fact": [
   "I make digestive enzymes and hormones, including insulin. I sit behind the stomach.",
   "Ich bilde Verdauungsenzyme und Hormone, darunter Insulin. Ich liege hinter dem Magen."
  ],
  "hint": [
   "Across the upper abdomen, behind the stomach.",
   "Quer im Oberbauch, hinter dem Magen."
  ]
 },
 {
  "id": "spleen",
  "color": "#92659a",
  "edge": "#734a82",
  "highlight": "#dfb9dc",
  "en": "Spleen",
  "de": "Milz",
  "pin": [
   72,
   37
  ],
  "at": [
   431,
   228
  ],
  "zone": [
   33,
   51
  ],
  "box": [
   407,
   182,
   56,
   90
  ],
  "path": "M424 194 C435 186 444 192 449 208 C456 233 444 255 430 264 C415 258 414 242 419 221 C421 211 421 201 424 194 Z",
  "details": "M437 203 Q444 226 432 249",
  "fact": [
   "I help defend against germs and filter old blood cells. I am not a digestive organ.",
   "Ich helfe bei der Abwehr von Keimen und filtere alte Blutzellen. Ich bin kein Verdauungsorgan."
  ],
  "hint": [
   "Upper left of the body, beside and behind the stomach.",
   "Links oben im Körper, neben und hinter dem Magen."
  ]
 }
];
function organShape(o,extra=''){
 const base=o.stroke?`<path d="${o.path}" fill="none" stroke="${o.color}" stroke-width="${o.width||23}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`:`<path d="${o.path}" fill="${o.color}" stroke="${o.edge||o.color}" stroke-width="2" stroke-linejoin="round" ${extra}/>`;
 const shine=o.details?`<path d="${o.details}" fill="none" stroke="${o.highlight||'#fff'}" stroke-width="${o.detailWidth||3}" stroke-linecap="round" stroke-linejoin="round" opacity=".53" ${extra}/>`:'';
 return `<g>${base}${shine}</g>`;
}
function organIcon(o){return `<svg viewBox="${o.box.join(' ')}" aria-hidden="true">${organShape(o)}</svg>`}
function organHintShape(o){return `<path d="${o.path}" fill="none" stroke="${o.color}" stroke-width="${o.stroke?(o.width||23):3}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="7 8" opacity=".28"/>`}
function organExplorerHTML(){const de=lang==='de';return `<section class="organ-explorer" aria-labelledby="abdomen-anatomy-title"><div class="organ-intro"><div class="eyebrow">${organWords('EXPLORE THE ANATOMY','ANATOMIE ENTDECKEN')}</div><h2 id="abdomen-anatomy-title">${organWords('What is inside our abdomen?','Was befindet sich in unserem Bauch?')}</h2><p>${organWords('Seven organs. Seven different jobs. Hover over a number, tap it or use the matching organ buttons to explore.','Sieben Organe. Sieben verschiedene Aufgaben. Fahre über eine Zahl, tippe sie an oder wähle einen passenden Organknopf.')}</p></div><div class="organ-explorer-grid"><figure><div class="organ-photo"><img src="assets/abdomen-tiesworks-unlabelled.webp" width="1298" height="1212" alt="${organWords('Textbook illustration of the abdominal organs, viewed from the front.','Lehrbuchzeichnung der Bauchorgane von vorn.')}">${abdomenOrgans.map((o,i)=>`<button type="button" class="organ-pin${o.id==='pancreas'?' organ-pin-hidden':''}" data-organ="${i}" style="left:${o.pin[0]}%;top:${o.pin[1]}%;--organ-color:${o.color}" aria-label="${i+1}: ${de?o.de:o.en}${o.id==='pancreas'?organWords(' — behind the stomach; not visible',' – hinter dem Magen; nicht sichtbar'):''}" aria-pressed="${i===organActivityState.active}">${i+1}</button>`).join('')}</div><figcaption>${organWords('Front view: the person’s right is on your left. Dashed marker 6 indicates the approximate position of the pancreas behind the stomach; it is not visible in this view.','Vorderansicht: Die rechte Körperseite ist links im Bild. Die gestrichelte Markierung 6 zeigt die ungefähre Lage der Bauchspeicheldrüse hinter dem Magen; sie ist in dieser Ansicht nicht sichtbar.')}<span class="organ-image-credit">${organWords('Illustration','Zeichnung')}: <a href="https://commons.wikimedia.org/wiki/File:Anatomy_Abdomen_Tiesworks.jpg" target="_blank" rel="noopener noreferrer">Ties van Brussel / Tiesworks · Wikimedia Commons</a> · ${organWords('Public domain','Gemeinfrei')}. ${organWords('Adapted: labels and leader lines removed; interactive markers added.','Bearbeitet: Beschriftungen und Hinweislinien entfernt; interaktive Markierungen ergänzt.')}</span></figcaption></figure><div class="organ-learning"><div class="organ-list" aria-label="${organWords('Choose an organ','Organ auswählen')}">${abdomenOrgans.map((o,i)=>`<button type="button" data-organ="${i}" style="--organ-color:${o.color}" aria-pressed="${i===organActivityState.active}"><span>${i+1}</span>${de?o.de:o.en}</button>`).join('')}</div><div id="organ-fact" role="status" aria-live="polite"></div><div class="organ-learning-note">${organWords('The abdomen protects many important organs. A laparoscopic camera lets the surgical team see inside through a small opening.','Der Bauch schützt viele wichtige Organe. Eine laparoskopische Kamera zeigt dem Operationsteam das Innere durch einen kleinen Zugang.')}</div></div></div></section>`}
function organGameHTML(){return `<section class="organ-game" id="organ-game" aria-labelledby="organ-game-title"><div class="organ-game-top"><div><div class="eyebrow">${organWords('YOUR ANATOMY MISSION','DEINE ANATOMIE-MISSION')}</div><h2 id="organ-game-title">${organWords('Build a belly!','Baue einen Bauch!')}</h2><p>${organWords('Drag each organ to its anatomical position, or select it and tap the spot. Body right is on your left. Take your time!','Ziehe jedes Organ an seine anatomisch richtige Stelle – oder wähle es aus und tippe auf den Platz. Körperrechts ist links im Bild.')}</p></div><span class="organ-score" id="organ-score"></span></div><div class="organ-game-layout"><div class="organ-tray" id="organ-tray"></div><div class="organ-board-wrap"><div class="organ-orientation"><span>${organWords('Body: right','Körper: rechts')}</span><span>${organWords('Body: left','Körper: links')}</span></div><svg id="organ-board" viewBox="0 0 600 680" tabindex="0" role="group" aria-label="${organWords('Organ placement board. Select an organ, use arrow keys to move the crosshair and press Enter to place it.','Organ-Spielfeld. Wähle ein Organ, bewege das Fadenkreuz mit den Pfeiltasten und drücke Enter zum Platzieren.')}"><defs><linearGradient id="belly-skin" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f9eadc"/><stop offset="1" stop-color="#ecd5c0"/></linearGradient><radialGradient id="organ-cavity" cx=".5" cy=".47" r=".7"><stop stop-color="#fff8ed"/><stop offset="1" stop-color="#e9ccb0"/></radialGradient></defs><path d="M167 113 Q300 81 432 113 C467 122 468 160 467 194 C465 235 463 261 472 308 C483 394 477 505 467 547 C458 587 435 618 413 637 Q300 660 187 637 C165 618 142 587 133 547 C123 505 117 394 128 308 C137 261 135 235 133 194 C132 160 133 122 167 113 Z" fill="url(#belly-skin)" stroke="#c79f81" stroke-width="3"/><path d="M167 153 Q300 123 432 153 Q442 185 439 232 Q447 323 447 491 Q449 564 404 610 Q300 628 196 610 Q151 564 153 491 Q153 323 161 232 Q158 185 167 153 Z" fill="url(#organ-cavity)" stroke="#d9b69c" stroke-width="2" stroke-dasharray="4 6"/><g fill="none" stroke="#d4b094" stroke-width="2" opacity=".65"><path d="M172 165 Q197 189 216 194 M428 165 Q403 189 384 194"/><path d="M173 167 Q300 137 427 167"/><path d="M302 555 Q301 573 302 585"/></g><g id="organ-slots"></g><g id="organ-placed"></g><g id="organ-crosshair" pointer-events="none"></g></svg><p class="organ-board-note">${organWords('Simplified front view. The pancreas lies behind the stomach and is partly covered when both are placed.','Vereinfachte Vorderansicht. Die Bauchspeicheldrüse liegt hinter dem Magen und ist teilweise verdeckt, wenn beide platziert sind.')}</p></div></div><div id="organ-feedback" class="organ-feedback" role="status" aria-live="polite"></div><div class="organ-game-actions"><button type="button" id="organ-hint" class="btn light"></button><button type="button" id="organ-reset" class="share">${organWords('Start again','Neu starten')}</button><span>${organWords('Keyboard: select an organ → arrows → Enter. Escape cancels.','Tastatur: Organ wählen → Pfeiltasten → Enter. Escape bricht ab.')}</span></div></section>`}
function mountOrganActivities(){if(location.hash!=='#station/laparoscopy')return;const panel=document.getElementById('detail');const explorer=panel.querySelector('.organ-explorer');if(!explorer)return;
 const show=i=>{organActivityState.active=i;const o=abdomenOrgans[i];explorer.querySelectorAll('[data-organ]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.organ===i)));explorer.querySelector('#organ-fact').innerHTML=`<div class="organ-fact-card" style="--organ-color:${o.color}"><span class="organ-fact-number">${i+1}</span><h3>${organWords(o.en,o.de)}</h3><p>${organWords(...o.fact)}</p><p class="organ-location">${organWords(...o.hint)}${o.id==='pancreas'?organWords(' The dashed marker shows its approximate location, not a visible organ surface.',' Die gestrichelte Markierung zeigt die ungefähre Lage, keine sichtbare Organoberfläche.'):''}</p></div>`};
 explorer.querySelectorAll('[data-organ]').forEach(b=>{b.onclick=()=>show(+b.dataset.organ);b.onpointerenter=e=>{if(e.pointerType==='mouse')show(+b.dataset.organ)};b.onfocus=()=>show(+b.dataset.organ)});show(organActivityState.active);
 if(!panel.querySelector('#organ-game'))panel.insertAdjacentHTML('beforeend',organGameHTML());const root=panel.querySelector('#organ-game'),board=root.querySelector('#organ-board'),state=organActivityState;
 const setMessage=(kind,i)=>{state.message={kind,i};};
 const draw=()=>{root.querySelector('#organ-score').textContent=`★ ${state.placed.size} / 7`;root.querySelector('#organ-tray').innerHTML=abdomenOrgans.map((o,i)=>`<button type="button" class="organ-piece ${state.placed.has(i)?'is-placed':''}" data-piece="${i}" aria-pressed="${state.selected===i}" aria-disabled="${state.placed.has(i)}" style="--organ-color:${o.color}">${organIcon(o)}<span><b>${i+1}. ${organWords(o.en,o.de)}</b><small>${state.placed.has(i)?organWords('Placed ✓','Platziert ✓'):organWords('Drag or select','Ziehen oder auswählen')}</small></span></button>`).join('');
 board.querySelector('#organ-placed').innerHTML=[5,2,3,6,0,4,1].filter(i=>state.placed.has(i)).map(i=>organShape(abdomenOrgans[i])).join('');board.querySelector('#organ-slots').innerHTML=state.hints?abdomenOrgans.filter((_,i)=>!state.placed.has(i)).map(organHintShape).join(''):'';
 const selected=state.selected===null?null:abdomenOrgans[state.selected];board.querySelector('#organ-crosshair').innerHTML=selected?`<circle cx="${state.cursor[0]}" cy="${state.cursor[1]}" r="22" fill="none" stroke="${selected.color}" stroke-width="3"/><path d="M${state.cursor[0]-30} ${state.cursor[1]}h60M${state.cursor[0]} ${state.cursor[1]-30}v60" stroke="${selected.color}" stroke-width="2"/>`:'';
 root.querySelector('#organ-hint').textContent=state.hints?organWords('Hide outlines','Umrisse ausblenden'):organWords('Show a hint','Hinweis zeigen');root.querySelector('#organ-hint').setAttribute('aria-pressed',String(state.hints));let message=organWords('Choose an organ to begin.','Wähle ein Organ zum Starten.');
 if(state.placed.size===7)message=organWords('Wonderful! All seven organs are home. You are an anatomy explorer!','Wunderbar! Alle sieben Organe sind an ihrem Platz. Du bist ein Anatomie-Profi!');else if(state.message){const {kind,i}=state.message,o=abdomenOrgans[i];message=kind==='right'?`${organWords('Correct!','Richtig!')} ${organWords(o.en,o.de)}: ${organWords(...o.fact)}`:kind==='miss'?`${organWords('Almost! Try again. Hint:','Fast! Versuche es noch einmal. Tipp:')} ${organWords(...o.hint)}`:`${organWords(o.en,o.de)} — ${organWords(...o.hint)}`;}root.querySelector('#organ-feedback').textContent=message;root.classList.toggle('organ-complete',state.placed.size===7);
 root.querySelectorAll('[data-piece]').forEach(b=>{b.onclick=()=>{const i=+b.dataset.piece;if(state.placed.has(i))return;state.selected=i;setMessage('select',i);draw();root.querySelector(`[data-piece="${i}"]`).focus({preventScroll:true})};b.onpointerdown=e=>startDrag(e,b)});
 };
 const point=e=>{const r=board.getBoundingClientRect();return [(e.clientX-r.left)*600/r.width,(e.clientY-r.top)*680/r.height]};
 const place=(x,y)=>{if(state.selected===null)return;const i=state.selected,o=abdomenOrgans[i];const dx=(x-o.at[0])/o.zone[0],dy=(y-o.at[1])/o.zone[1];if(dx*dx+dy*dy<=1){state.placed.add(i);state.selected=null;setMessage('right',i)}else setMessage('miss',i);draw()};
 function startDrag(e,b){if(e.button!==0||state.placed.has(+b.dataset.piece))return;const i=+b.dataset.piece,start=[e.clientX,e.clientY];let ghost=null,moved=false;const move=ev=>{if(!moved&&Math.hypot(ev.clientX-start[0],ev.clientY-start[1])<8)return;moved=true;ev.preventDefault();if(!ghost){state.selected=i;ghost=document.createElement('div');ghost.className='organ-drag-ghost';ghost.innerHTML=organIcon(abdomenOrgans[i]);document.body.append(ghost)}ghost.style.left=ev.clientX+'px';ghost.style.top=ev.clientY+'px'};const finish=ev=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',finish);document.removeEventListener('pointercancel',cancel);if(ghost)ghost.remove();if(moved){ev.preventDefault();b.onclick=null;const [x,y]=point(ev);place(x,y)}};const cancel=()=>{if(ghost)ghost.remove();document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',finish);document.removeEventListener('pointercancel',cancel)};document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',finish,{once:true});document.addEventListener('pointercancel',cancel,{once:true});}
 board.onclick=e=>{const [x,y]=point(e);state.cursor=[x,y];place(x,y)};board.onkeydown=e=>{const moves={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]};if(moves[e.key]){e.preventDefault();state.cursor=[Math.max(110,Math.min(490,state.cursor[0]+moves[e.key][0])),Math.max(140,Math.min(590,state.cursor[1]+moves[e.key][1]))];draw()}else if(e.key==='Enter'||e.key===' '){e.preventDefault();place(...state.cursor)}else if(e.key==='Escape'){state.selected=null;draw()}};
 root.querySelector('#organ-hint').onclick=()=>{state.hints=!state.hints;draw()};root.querySelector('#organ-reset').onclick=()=>{state.placed.clear();state.selected=null;state.hints=false;state.message=null;state.cursor=[300,350];draw()};draw();
}
