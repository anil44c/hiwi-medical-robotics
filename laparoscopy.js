const lapState={step:0,level:'easy',part:0,started:null,elapsed:0,hint:false,quiz:null,compare:null};
const L=(en,de)=>lang==='de'?de:en;
const lapParts=()=>[
[L('Instruments','Instrumente'),L('Hold the handles gently. The long tips move inside the training box. Ask your facilitator to show you how to grip and release.','Halte die Griffe locker. Die langen Spitzen bewegen sich in der Trainingsbox. Lass dir zeigen, wie du greifst und loslässt.')],
[L('Entry ports','Zugänge'),L('The instruments pass through these openings. A trocar is a sleeve at the entry point that guides the instrument.','Durch diese Öffnungen führst du die Instrumente. Ein Trokar ist eine Hülse am Zugang, die das Instrument führt.')],
[L('Your phone & holder','Dein Smartphone & die Halterung'),L('Your own phone is the camera and screen. Place it securely in the holder with its rear camera facing the inside of the box. Watch the live view in your camera app.','Dein eigenes Smartphone ist Kamera und Bildschirm. Setze es sicher in die Halterung, sodass die Rückkamera ins Innere der Box zeigt. Beobachte das Livebild in deiner Kamera-App.')],
[L('Rings & pegs','Ringe & Stifte'),L('This is your practice area. Pick up a ring and place it on another peg. The final model may look different.','Hier übst du: Greife einen Ring und setze ihn auf einen anderen Stift. Das fertige Modell kann anders aussehen.')]
];
function trainer(){return `<svg viewBox="0 0 640 400" role="img" aria-label="${L('Illustrative laparoscopic box trainer with tools, a phone in a holder and a ring board','Beispielzeichnung einer Trainingsbox mit Instrumenten, Smartphone-Halterung und Ringbrett')}"><defs><linearGradient id="lap-shell" x2="0" y2="1"><stop stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#e0eade" stop-opacity=".65"/></linearGradient></defs><ellipse cx="299" cy="334" rx="208" ry="29" fill="#cbd9c9"/><path d="M84 243l230-80 181 103-234 88z" fill="#d0b790" stroke="#a28c6f" stroke-width="2"/><path d="M84 243v23l177 111v-23z" fill="#ae9470"/><path d="M261 354l234-88v23l-234 88z" fill="#c2a884"/><path d="M105 237C118 59 384 35 469 257L261 331Z" fill="url(#lap-shell)" stroke="#8da69a" stroke-width="3"/><g fill="#355853"><ellipse cx="208" cy="186" rx="20" ry="12" transform="rotate(-20 208 186)"/><ellipse cx="334" cy="175" rx="20" ry="12" transform="rotate(18 334 175)"/></g><g stroke="#6b8581" stroke-width="7" stroke-linecap="round"><path d="M147 90l116 188M386 72l-84 204"/></g><g stroke="#204d49" stroke-width="8" fill="none"><ellipse cx="132" cy="72" rx="12" ry="23" transform="rotate(-30 132 72)"/><ellipse cx="157" cy="67" rx="12" ry="23" transform="rotate(-30 157 67)"/><ellipse cx="383" cy="48" rx="12" ry="22" transform="rotate(22 383 48)"/><ellipse cx="408" cy="57" rx="12" ry="22" transform="rotate(22 408 57)"/></g><g stroke="#638173" stroke-width="5"><path d="M224 282v-25m56 48v-25m59 0v-25m58 4v-25"/></g><g fill="none" stroke-width="8"><ellipse cx="224" cy="281" rx="14" ry="6" stroke="#bba050"/><ellipse cx="280" cy="304" rx="14" ry="6" stroke="#769366"/><ellipse cx="339" cy="279" rx="14" ry="6" stroke="#cc8875"/></g><rect x="461" y="50" width="158" height="107" rx="9" fill="#28514d"/><rect x="470" y="60" width="140" height="86" rx="4" fill="#e3ebd7"/><path d="M531 157v24m-31 0h62" stroke="#28514d" stroke-width="7"/><g fill="none" stroke-width="5"><ellipse cx="505" cy="118" rx="13" ry="7" stroke="#bba050"/><ellipse cx="569" cy="100" rx="13" ry="7" stroke="#cc8875"/></g><path d="M480 68l55 50m60-51-35 56" stroke="#76968b" stroke-width="4"/><path d="M457 82v44m166-44v44" stroke="#183c38" stroke-width="8" stroke-linecap="round"/><circle cx="465" cy="103" r="2" fill="#c8ddbb"/><path d="M531 181v22l-55 63" stroke="#28514d" stroke-width="6" fill="none"/></svg>`}
function ringTransferHTML(){
return `<div class="lap-split lap-ring-layout">
  <div class="ring-demo-stage">
    <div class="ring-demo-top"><span class="ring-demo-status"><span class="ring-demo-dot"></span>${L('Looping animation','Endlos-Animation')}</span><span>${L('Inside the dome','Im Inneren der Kuppel')}</span></div>
    <svg class="ring-demo-svg" viewBox="0 0 640 420" role="img" aria-label="${L('Looping demonstration: a laparoscopic grasper enters the transparent dome, grasps one ring, lifts it over a peg, carries it to an empty peg, and releases it.','Wiederholte Demonstration: Ein laparoskopischer Greifer kommt durch die transparente Kuppel, greift einen Ring, hebt ihn über den Stift, bringt ihn zu einem leeren Stift und lässt ihn los.')}">
      <defs>
        <linearGradient id="lap-ring-backdrop" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f7faf4"/><stop offset="1" stop-color="#dcebdc"/></linearGradient>
        <linearGradient id="lap-ring-glass" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#ffffff" stop-opacity=".66"/><stop offset=".65" stop-color="#dcebe5" stop-opacity=".12"/><stop offset="1" stop-color="#e0f5e7" stop-opacity=".27"/></linearGradient>
        <linearGradient id="lap-ring-peg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#496d60"/><stop offset=".45" stop-color="#a6c0af"/><stop offset="1" stop-color="#4a6c61"/></linearGradient>
        <linearGradient id="lap-ring-shaft-metal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#a7b9b9"/><stop offset=".5" stop-color="#e3eded"/><stop offset="1" stop-color="#77949a"/></linearGradient>
      </defs>
      <rect width="640" height="420" rx="16" fill="url(#lap-ring-backdrop)"/>
      <ellipse cx="320" cy="360" rx="250" ry="29" fill="#557d65" opacity=".09"/>
      <path d="M80 325 C82 118 190 57 317 56 C473 55 567 145 560 325" fill="url(#lap-ring-glass)" stroke="#9ab8ac" stroke-width="3" opacity=".85"/>
      <path d="M111 291 C121 162 164 123 244 98" fill="none" stroke="white" stroke-opacity=".7" stroke-width="11" stroke-linecap="round"/>
      <path d="M99 303 Q319 278 544 303 L560 351 Q320 383 80 351 Z" fill="#d6bb99" stroke="#a78f71" stroke-width="2"/>
      <path d="M100 302 Q320 276 544 302" fill="none" stroke="#efe1c6" stroke-width="4"/>
      <path d="M99 348 Q320 381 544 348" fill="none" stroke="#9f896f" stroke-width="3"/>
      <ellipse cx="198" cy="300" rx="34" ry="10" fill="#a58f72" opacity=".55"/>
      <ellipse cx="435" cy="300" rx="34" ry="10" fill="#a58f72" opacity=".55"/>
      <path d="M198 307 V238 M435 307 V238" stroke="url(#lap-ring-peg)" stroke-width="15" stroke-linecap="round"/>
      <path d="M193 300 V241 M430 300 V241" stroke="#e7f2e4" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="198" cy="239" rx="8" ry="4" fill="#afcab6"/>
      <ellipse cx="435" cy="239" rx="8" ry="4" fill="#afcab6"/>
      <ellipse id="lap-moving-ring-shadow" cx="198" cy="296" rx="27" ry="8" fill="#654d31" opacity=".13"/>
      <g id="lap-moving-ring" transform="translate(198 266)">
        <ellipse rx="27" ry="11" fill="none" stroke="#bd6d37" stroke-width="13"/>
        <ellipse rx="27" ry="11" fill="none" stroke="#e8aa63" stroke-width="9"/>
        <path d="M-22 -6 Q0 -13 22 -6" fill="none" stroke="#ffe1af" stroke-width="3" stroke-linecap="round"/>
      </g>
      <path d="M148 97 L198 194" stroke="#a0b5b5" stroke-width="15" stroke-linecap="round" opacity=".7"/>
      <path id="lap-grasper-shaft" d="M148 97 L198 194" stroke="url(#lap-ring-shaft-metal)" stroke-width="10" stroke-linecap="round"/>
      <path id="lap-grasper-reflection" d="M148 97 L198 194" stroke="#e9f2f0" stroke-width="2.5" opacity=".85" stroke-linecap="round"/>
      <g id="lap-grasper-tip" transform="translate(198 205)">
        <rect x="-8" y="-22" width="16" height="19" rx="5" fill="#547b7b" stroke="#284b50" stroke-width="1.5"/>
        <circle cy="-10" r="5" fill="#dfe7e5" stroke="#536f70" stroke-width="2"/>
        <path id="lap-jaw-left" d="M-2 -12 Q-16 0 -13 10" fill="none" stroke="#375760" stroke-width="5" stroke-linecap="round"/>
        <path id="lap-jaw-right" d="M2 -12 Q16 0 13 10" fill="none" stroke="#375760" stroke-width="5" stroke-linecap="round"/>
        <path d="M-3 -17 L3 -17" stroke="#e8f4f4" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g transform="translate(148 97)">
        <ellipse rx="23" ry="13" fill="#355b56" stroke="#ecf5ee" stroke-width="4" transform="rotate(-26)"/>
        <ellipse rx="10" ry="6" fill="#9eb5a3" transform="rotate(-26)"/>
      </g>
      <path d="M80 325 Q318 372 560 325" fill="none" stroke="#8ba99c" stroke-width="4"/>
      <text x="198" y="390" font-size="14" font-weight="600" fill="#526e64" text-anchor="middle">${L('Starting peg','Startstift')}</text>
      <text x="435" y="390" font-size="14" font-weight="600" fill="#526e64" text-anchor="middle">${L('Target peg','Zielstift')}</text>
    </svg>
    <div class="ring-demo-controls"><div class="ring-demo-phase"><span>${L('Now showing','Jetzt zu sehen')}</span><strong id="lap-motion-phase" aria-live="off">${L('Approach the ring','Zum Ring führen')}</strong></div><button id="motion-toggle" type="button" class="share">${L('Pause animation','Animation anhalten')}</button></div>
  </div>
  <div class="ring-demo-copy">
    <span class="tag">${L('Watch the demonstration · Step 03','Schau dir die Demonstration an · Schritt 03')}</span>
    <h3 id="lap-ring-heading">${L('Pick up the ring and move it.','Greife den Ring und versetze ihn.')}</h3>
    <p>${L('Follow the grasper tip as it enters the dome. It grips the ring, lifts it over the peg, moves it across, and gently releases it onto the empty peg. The animation repeats automatically.','Beobachte, wie die Greiferspitze in die Kuppel geführt wird. Sie greift den Ring, hebt ihn über den Stift, bewegt ihn zur Seite und setzt ihn vorsichtig auf dem leeren Stift ab. Die Animation wiederholt sich automatisch.')}</p>
    <ol class="ring-demo-steps">
      <li>${L('Guide the open grasper towards the ring.','Führe den geöffneten Greifer zum Ring.')}</li>
      <li>${L('Close the jaws gently to grip the ring.','Schließe die Greifbacken vorsichtig um den Ring.')}</li>
      <li>${L('Lift the ring clear of the first peg and move it across.','Hebe den Ring über den ersten Stift und bewege ihn zur Seite.')}</li>
      <li>${L('Lower it onto the empty peg, open the jaws, and release.','Senke ihn auf den leeren Stift, öffne den Greifer und lass los.')}</li>
    </ol>
    <div class="lap-callout">${L('Tip: Small, controlled movements work best. Lift the ring high enough to clear the peg before moving sideways. Never force the instrument.','Tipp: Kleine, kontrollierte Bewegungen funktionieren am besten. Hebe den Ring zuerst hoch genug über den Stift, bevor du ihn seitlich bewegst. Wende niemals Gewalt an.')}</div>
    <p class="robot-footnote">${L('Simplified, repeating illustration of the task inside the dome. The actual instrument and training model may look different.','Vereinfachte, wiederholte Darstellung der Aufgabe in der Kuppel. Instrument und Trainingsmodell können in Wirklichkeit anders aussehen.')}</p>
  </div>
</div>`;
}
function startLapRingTransfer(root){
  const svg=root.querySelector('.ring-demo-svg'),shaft=root.querySelector('#lap-grasper-shaft'),glint=root.querySelector('#lap-grasper-reflection'),tip=root.querySelector('#lap-grasper-tip'),left=root.querySelector('#lap-jaw-left'),right=root.querySelector('#lap-jaw-right'),ring=root.querySelector('#lap-moving-ring'),shadow=root.querySelector('#lap-moving-ring-shadow'),caption=root.querySelector('#lap-motion-phase'),toggle=root.querySelector('#motion-toggle');
  if(!svg||!shaft||!glint||!tip||!left||!right||!ring||!shadow||!caption||!toggle)return ()=>{};
  const frames=[
    {t:0,x:198,y:205,rx:198,ry:266,closed:0},
    {t:.12,x:198,y:247,rx:198,ry:266,closed:0},
    {t:.21,x:198,y:258,rx:198,ry:266,closed:1},
    {t:.35,x:198,y:195,rx:198,ry:195,closed:1},
    {t:.56,x:435,y:195,rx:435,ry:195,closed:1},
    {t:.69,x:435,y:266,rx:435,ry:266,closed:1},
    {t:.78,x:435,y:266,rx:435,ry:266,closed:0},
    {t:.88,x:322,y:185,rx:435,ry:266,closed:0},
    {t:1,x:198,y:205,rx:435,ry:266,closed:0}
  ];
  const labels=[
    L('Approach the ring','Zum Ring führen'),
    L('Close the grasper','Den Greifer schließen'),
    L('Lift the ring','Den Ring anheben'),
    L('Carry to the empty peg','Zum leeren Stift bewegen'),
    L('Lower the ring','Den Ring absenken'),
    L('Release the ring','Den Ring loslassen')
  ];
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused=Boolean(reduceMotion),active=true,elapsed=0,last=performance.now(),frameId=null,phase=-1;
  const ease=t=>t*t*(3-2*t);
  function draw(){
    const p=(elapsed%9800)/9800;
    let i=0;while(i<frames.length-2&&p>frames[i+1].t)i++;
    const a=frames[i],b=frames[i+1],fraction=ease(Math.max(0,Math.min(1,(p-a.t)/(b.t-a.t))));
    const interpolate=k=>a[k]+(b[k]-a[k])*fraction;
    const x=interpolate('x'),y=interpolate('y'),rx=interpolate('rx'),ry=interpolate('ry'),closed=interpolate('closed');
    const shaftPath='M148 97 L'+x.toFixed(1)+' '+(y-17).toFixed(1);
    shaft.setAttribute('d',shaftPath);
    glint.setAttribute('d',shaftPath);
    tip.setAttribute('transform','translate('+x.toFixed(1)+' '+y.toFixed(1)+')');
    const width=13-8*closed;
    left.setAttribute('d','M-2 -12 Q'+(-width-3).toFixed(1)+' 0 '+(-width).toFixed(1)+' 10');
    right.setAttribute('d','M2 -12 Q'+(width+3).toFixed(1)+' 0 '+width.toFixed(1)+' 10');
    ring.setAttribute('transform','translate('+rx.toFixed(1)+' '+ry.toFixed(1)+')');
    let opacity=1;
    if(p>.94)opacity=Math.max(0,(1-p)/.06);
    else if(p<.06)opacity=Math.min(1,p/.06);
    ring.setAttribute('opacity',opacity.toFixed(2));
    shadow.setAttribute('cx',rx.toFixed(1));
    shadow.setAttribute('opacity',ry<248?'.08':'.13');
    const nextPhase=p<.18?0:p<.25?1:p<.40?2:p<.61?3:p<.73?4:5;
    if(nextPhase!==phase){phase=nextPhase;caption.textContent=labels[phase]}
  }
  function animate(now){
    if(!active||paused)return;
    elapsed+=Math.min(100,Math.max(0,now-last));
    last=now;
    draw();
    frameId=requestAnimationFrame(animate);
  }
  function updateButton(){
    toggle.textContent=paused?L('Play animation','Animation abspielen'):L('Pause animation','Animation anhalten');
    toggle.setAttribute('aria-pressed',String(!paused));
  }
  toggle.onclick=()=>{
    paused=!paused;
    if(frameId!==null){cancelAnimationFrame(frameId);frameId=null}
    updateButton();
    if(!paused){last=performance.now();frameId=requestAnimationFrame(animate)}
  };
  draw();updateButton();
  if(!paused)frameId=requestAnimationFrame(animate);
  return ()=>{active=false;if(frameId!==null)cancelAnimationFrame(frameId);toggle.onclick=null};
}
let lapRingMotionStop=null;
function lapHTML(){const titles=[L('Meet the setup','Lerne den Aufbau kennen'),L('Set up your phone','Richte dein Smartphone ein'),L('Transfer a ring','Einen Ring versetzen'),L('Take the challenge','Starte die Aufgabe'),L('Reflect & discover','Nachdenken & entdecken')];return `<section class="lap-guide"><div class="lap-heading"><div><div class="eyebrow">${L('Your hands-on adventure','Dein Mitmach-Abenteuer')}</div><h2>${L('Ready, steady, gently.','Bereit? Ganz vorsichtig.')}</h2></div><span class="lap-badge">${L('Illustrative model · Final setup coming later','Beispielmodell · Aufbau noch in Arbeit')}</span></div><p class="lap-intro">${L('Try the demo with a facilitator. These drawings and tasks are a first draft; follow the instructions for the actual equipment at your station.','Probiere die Demo mit einer Betreuungsperson aus. Zeichnungen und Aufgaben sind ein erster Entwurf; beachte die Hinweise zum tatsächlichen Aufbau an deiner Station.')}</p><div class="lap-tabs" aria-label="${L('Guide steps','Anleitungsschritte')}">${titles.map((v,i)=>`<button data-lap-step="${i}" aria-current="${i===lapState.step?'step':'false'}"><span>0${i+1}</span>${v}</button>`).join('')}</div><div id="lap-content"></div><div class="lap-navigation"><button id="lap-prev" class="btn light" ${lapState.step===0?'disabled':''}>← ${L('Back','Zurück')}</button><span>${lapState.step+1} / 5</span><button id="lap-next" class="btn">${lapState.step===4?L('Start again','Neu starten'):L('Next step','Nächster Schritt')} →</button></div></section>`}
function content(){if(lapState.step===0)return `<div class="lap-split"><div class="trainer-stage">${trainer()}${[[24,20],[33,47],[83,27],[45,72]].map((p,i)=>`<button class="lap-hot" style="left:${p[0]}%;top:${p[1]}%" data-lap-part="${i}" aria-label="${lapParts()[i][0]}" aria-controls="lap-part">${i+1}</button>`).join('')}</div><div><div class="eyebrow">${L('Tap a number to explore','Tippe auf eine Zahl')}</div><div id="lap-part" aria-live="polite"></div><div class="lap-chips">${lapParts().map((p,i)=>`<button data-lap-part="${i}">${p[0]}</button>`).join('')}</div></div></div>`;
if(lapState.step===1)return `<div class="lap-split"><div class="trainer-stage">${trainer()}<div class="lap-task-label">${L('Your phone = camera + screen','Dein Smartphone = Kamera + Bildschirm')}</div></div><div><span class="tag">${L('Before you pick up the instruments','Bevor du die Instrumente nimmst')}</span><h3>${L('Set up your own camera.','Richte deine eigene Kamera ein.')}</h3><ol class="phone-instructions"><li>${L('Read the movement and ring-transfer instructions first. Then open your phone’s camera app and select the rear camera.','Lies zuerst die Anleitung zur Bewegung und zum Ringversetzen. Öffne dann die Kamera-App deines Smartphones und wähle die Rückkamera.')}</li><li>${L('With your facilitator, place the phone securely in the holder. Keep the camera lens clear and point it into the box.','Setze das Smartphone mit deiner Betreuungsperson sicher in die Halterung. Halte die Kameralinse frei und richte sie ins Innere der Box.')}</li><li>${L('Adjust the holder until the rings, pegs and instrument tips are visible on your screen. Check that the phone stays firmly in place.','Richte die Halterung so aus, dass Ringe, Stifte und Instrumentenspitzen auf dem Bildschirm sichtbar sind. Prüfe, ob das Smartphone fest sitzt.')}</li><li>${L('Use the live camera view to guide your movements. You do not need to take a photo or record a video.','Verfolge deine Bewegungen im Livebild der Kamera. Du musst weder ein Foto machen noch ein Video aufnehmen.')}</li></ol><div class="lap-callout">${L('The guide will be in the background while your camera app is open. Read the next steps now, or ask your facilitator to guide you. For the optional timer, use a second device or ask your facilitator.','Die Anleitung ist im Hintergrund, solange die Kamera-App geöffnet ist. Lies jetzt die nächsten Schritte oder lass dich von deiner Betreuungsperson anleiten. Nutze für die freiwillige Stoppuhr ein zweites Gerät oder bitte die Betreuungsperson.')}</div></div></div>`;
if(lapState.step===2)return ringTransferHTML();
if(lapState.step===3)return `<div class="lap-split"><div class="trainer-stage">${trainer()}<div class="lap-task-label">${L('Pick up → move → place','Greifen → bewegen → absetzen')}</div></div><div><div class="lap-chips" role="group" aria-label="${L('Choose difficulty','Schwierigkeitsgrad wählen')}"><button type="button" data-level="easy" aria-pressed="${lapState.level==='easy'}">${L('Easy','Leicht')}</button><button type="button" data-level="challenge" aria-pressed="${lapState.level==='challenge'}">${L('A little harder','Etwas schwieriger')}</button><button type="button" data-level="harder" aria-pressed="${lapState.level==='harder'}">${L('Harder','Schwieriger')}</button></div><h3>${lapState.level==='easy'?L('Move one ring.','Versetze einen Ring.'):lapState.level==='challenge'?L('Transfer three rings.','Versetze drei Ringe.'):L('Transfer a ring with just one instrument.','Versetze einen Ring mit nur einem Instrument.')}</h3><p>${lapState.level==='easy'?L('Choose a ring with your facilitator. Grip it gently, lift it off its peg and place it onto another peg. Release it slowly.','Wähle mit deiner Betreuungsperson einen Ring. Greife ihn vorsichtig, hebe ihn vom Stift und setze ihn auf einen anderen Stift. Lass langsam los.'):lapState.level==='challenge'?L('Move three rings one at a time. Watch the live camera view on your phone instead of looking directly into the box. Ask for help if the target is hard to see.','Versetze drei Ringe nacheinander. Beobachte das Livebild auf deinem Smartphone, statt direkt in die Box zu schauen. Bitte um Hilfe, wenn du das Ziel schlecht siehst.'):L('Choose one of the two laparoscopic instruments with your facilitator. Leave the other instrument unused. Using just your chosen instrument, gently grip one ring, lift it from its peg, move it to an empty peg, and release it. Watch your phone’s live camera view and move slowly.','Wähle mit deiner Betreuungsperson eines der beiden laparoskopischen Instrumente aus. Das andere Instrument bleibt unbenutzt. Greife mit deinem gewählten Instrument vorsichtig einen Ring, hebe ihn vom Stift, bewege ihn zu einem freien Stift und lasse ihn dort sanft los. Beobachte das Livebild auf deinem Smartphone und bewege dich langsam.')}</p><button class="share" id="lap-hint" aria-expanded="${lapState.hint}">${L('Show a hint','Tipp anzeigen')}</button><p class="lap-callout" ${lapState.hint?'':'hidden'}>${lapState.level==='harder'?L('Lift the ring high enough before moving sideways. Small, steady movements make the one-instrument challenge easier.','Hebe den Ring zuerst hoch genug an, bevor du ihn seitlich bewegst. Kleine, ruhige Bewegungen machen die Aufgabe mit nur einem Instrument leichter.'):L('Pause above the ring, then close the gripper gently. Lift high enough to clear the peg before moving sideways.','Halte kurz über dem Ring an und schließe den Greifer vorsichtig. Hebe den Ring erst über den Stift, bevor du ihn seitlich bewegst.')}</p><div class="lap-timer"><div><span class="tag">${L('Optional timer','Freiwillige Stoppuhr')}</span><output id="lap-time">${timeText()}</output></div><div><button id="timer-toggle" class="share">${lapState.started?L('Pause','Pause'):L('Start','Start')}</button><button id="timer-reset" class="share">${L('Reset','Zurücksetzen')}</button></div><small>${L('Steady movements matter more than speed. Compare only your own attempts.','Ruhige Bewegungen sind wichtiger als Tempo. Vergleiche nur deine eigenen Versuche.')}</small></div></div></div>`;
return `<div class="lap-split"><div><div class="eyebrow">${L('What did you notice?','Was hast du bemerkt?')}</div><h3>${L('Which view felt easier?','Welche Sicht war leichter?')}</h3><p>${L('If you tried both views, choose one. There is no wrong answer.','Falls du beide Ansichten ausprobiert hast, wähle eine. Es gibt keine falsche Antwort.')}</p><div class="lap-chips">${[L('Looking directly','Direkt hineinsehen'),L('Using the camera','Auf den Bildschirm schauen'),L('I only tried one','Nur eine ausprobiert')].map((s,i)=>`<button data-compare="${i}" aria-pressed="${lapState.compare===i}">${s}</button>`).join('')}</div><p class="lap-callout" ${lapState.compare===null?'hidden':''}>${L('A camera gives an inside view through a small opening. Using a screen changes how you judge depth and coordinate your hands. Practice helps!','Eine Kamera zeigt das Innere durch eine kleine Öffnung. Am Bildschirm schätzt du Tiefe anders ein und koordinierst deine Hände anders. Übung hilft!')}</p></div><div class="lap-quiz"><span class="tag">${L('One last discovery','Eine letzte Entdeckung')}</span><h3>${L('Why use a camera in laparoscopy?','Warum nutzt man bei der Laparoskopie eine Kamera?')}</h3>${[L('To see inside through a small opening','Um durch eine kleine Öffnung ins Innere zu sehen'),L('To make the instruments stronger','Um die Instrumente stärker zu machen'),L('So the robot can always work alone','Damit der Roboter immer allein arbeiten kann')].map((s,i)=>`<button data-answer="${i}" aria-pressed="${lapState.quiz===i}">${s}</button>`).join('')}<p id="quiz-feedback" role="status">${lapState.quiz===null?'':lapState.quiz===0?L('Exactly! The camera provides the inside view while instruments work through small openings.','Genau! Die Kamera zeigt das Innere, während die Instrumente durch kleine Öffnungen arbeiten.'):L('Not quite. Think about what you watched on the screen. Try another answer.','Noch nicht ganz. Denk daran, was du auf dem Bildschirm gesehen hast. Versuche eine andere Antwort.')}</p></div></div>`}
function timeText(){const ms=lapState.elapsed+(lapState.started?Date.now()-lapState.started:0),sec=Math.floor(ms/1000);return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function stopLapTimer(){if(lapState.started){lapState.elapsed+=Date.now()-lapState.started;lapState.started=null}}
function mountLap(){if(lapRingMotionStop){lapRingMotionStop();lapRingMotionStop=null;}const panel=document.querySelector('#detail');if(!panel||location.hash!=='#station/laparoscopy')return;panel.classList.add('lap-detail');const old=panel.querySelector('.detail-layout');if(old)old.outerHTML='<div id="lap-root"></div>';const root=panel.querySelector('#lap-root');if(!root)return;root.innerHTML=lapHTML();document.querySelector('#lap-content').innerHTML=content();root.querySelectorAll('[data-lap-step]').forEach(b=>b.onclick=()=>{stopLapTimer();lapState.step=Number(b.dataset.lapStep);mountLap()});document.querySelector('#lap-prev').onclick=()=>{stopLapTimer();lapState.step=Math.max(0,lapState.step-1);mountLap()};document.querySelector('#lap-next').onclick=()=>{stopLapTimer();if(lapState.step===4){lapState.step=0;lapState.quiz=null;lapState.compare=null;lapState.hint=false;lapState.elapsed=0}else lapState.step++;mountLap()};if(lapState.step===0){const show=i=>{lapState.part=i;const p=lapParts()[i];document.querySelector('#lap-part').innerHTML=`<h3>${p[0]}</h3><p>${p[1]}</p>`;root.querySelectorAll('[data-lap-part]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.lapPart)===i)))};show(lapState.part);root.querySelectorAll('[data-lap-part]').forEach(b=>{b.onclick=()=>show(Number(b.dataset.lapPart));b.onfocus=b.onclick;b.onpointerenter=e=>{if(e.pointerType!=='touch')b.onclick()}})}if(lapState.step===2)lapRingMotionStop=startLapRingTransfer(root);root.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{stopLapTimer();lapState.level=b.dataset.level;lapState.elapsed=0;lapState.hint=false;mountLap()});const hint=root.querySelector('#lap-hint');if(hint)hint.onclick=()=>{lapState.hint=!lapState.hint;mountLap()};const timer=root.querySelector('#timer-toggle');if(timer)timer.onclick=()=>{if(lapState.started)stopLapTimer();else lapState.started=Date.now();mountLap()};const reset=root.querySelector('#timer-reset');if(reset)reset.onclick=()=>{lapState.started=null;lapState.elapsed=0;mountLap()};root.querySelectorAll('[data-compare]').forEach(b=>b.onclick=()=>{lapState.compare=Number(b.dataset.compare);mountLap()});root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{lapState.quiz=Number(b.dataset.answer);mountLap()})}
setInterval(()=>{const out=document.querySelector('#lap-time');if(out)out.textContent=timeText()},500);
window.addEventListener('hashchange',()=>{if(location.hash!=='#station/laparoscopy')stopLapTimer()});
mountLap();
