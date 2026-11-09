class BoardGuide extends HTMLElement {
  connectedCallback() {
    const de = this.getAttribute('language') === 'de';
    const catheter = this.getAttribute('activity') === 'catheter';
    const say = (en, german) => de ? german : en;
    const steps = catheter ? [
      [say('Explore the board','Entdecke das Modell'), say('Find the heart, both kidneys and the clear tubes. Trace a route with your finger from the opening at the bottom to the kidney on the right of the picture.','Suche das Herz, beide Nieren und die durchsichtigen Schläuche. Fahre mit dem Finger vom Eingang unten bis zur Niere rechts im Bild.')],
      [say('Find the entrance','Finde den Eingang'),say('With your guide, place the catheter tip just inside the lower opening. Watch the tip through the tube.','Setze die Katheterspitze mit deiner Betreuungsperson in den unteren Eingang. Beobachte die Spitze durch den Schlauch.')],
      [say('Follow the branch','Folge der Abzweigung'),say('Slide the catheter forward in small steps. At the first fork, follow the branch to the right. If the tip catches, pause and ask your guide.','Schiebe den Katheter in kleinen Schritten vor. Folge an der ersten Gabelung dem Schlauch nach rechts. Wenn die Spitze hängen bleibt, halte an und frage deine Betreuungsperson.')],
      [say('Stop at the kidney','Halte an der Niere an'),say('Stop when the tip reaches the kidney opening. Point to the branch you took, then gently slide the catheter back out.','Halte an, sobald die Spitze den Eingang der Niere erreicht. Zeige deine Abzweigung und ziehe den Katheter langsam zurück.')]
    ] : [
      [say('Find the sample','Finde die Probe'),say('The heart and kidneys on this board have hollow spaces. Your guide places modelling clay inside one of them. Find that organ and point to the clay.','Herz und Nieren auf dem Brett haben Hohlräume. Deine Betreuungsperson legt Knete in eines der Organe. Finde das Organ und zeige auf die Knete.')],
      [say('Aim at the clay','Ziele auf die Knete'),say('Watch your guide demonstrate the biopsy tool. Bring its tip to the exposed clay in the model organ.','Lass dir das Biopsiewerkzeug zeigen. Führe seine Spitze an die frei liegende Knete im Modellorgan.')],
      [say('Take a small piece','Nimm eine kleine Probe'),say('Use the tool as your guide showed you to catch a small piece of clay. The gold dot shows the piece you want to collect.','Nimm mit dem Werkzeug ein kleines Stück Knete auf, wie es dir gezeigt wurde. Der goldene Punkt zeigt das Stück für deine Probe.')],
      [say('Lift out the sample','Hole die Probe heraus'),say('Lift the tool out with the piece, then release the clay onto the sample tray your guide points out. Can you see where it came from?','Hebe das Werkzeug mit dem Stück heraus und lege die Knete auf die gezeigte Ablage. Erkennst du, woher die Probe stammt?')]
    ];
    let stage = 0;
    const title = catheter ? say('Guide a catheter to a kidney','Führe einen Katheter zur Niere') : say('Collect a clay sample','Entnimm eine Knetprobe');
    const draw = () => {
      const route = 'M494 977 Q416 799 438 663 Q449 557 495 500 Q603 526 692 427 Q745 376 841 363';
      const offsets = [100,87,36,0];
      const diagram = catheter ? '<path d="'+route+'" pathLength="100" fill="none" stroke="#1d6257" stroke-width="11" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="'+offsets[stage]+'"/>' :
        '<ellipse cx="827" cy="391" rx="52" ry="42" fill="#db8581"/><g transform="translate('+[0,0,0,63][stage]+' '+[0,0,0,-92][stage]+')"><circle cx="826" cy="382" r="12" fill="#ffd15c" stroke="#88551e" stroke-width="3"/>'+(stage ? '<path d="M950 220 L828 379" stroke="#294654" stroke-width="14"/><path d="M950 220 L828 379" stroke="#d7e8eb" stroke-width="6"/>' : '')+'</g>';
      this.innerHTML = '<section class="info board-panel"><div class="eyebrow">'+say('Hands-on model','Mitmachmodell')+'</div><h2>'+title+'</h2><div class="board-layout"><svg viewBox="0 0 1000 1000" role="img" aria-label="'+title+'"><image href="demo-board.webp" width="1000" height="1000"/>'+diagram+'</svg><div aria-live="polite"><small>'+say('Step','Schritt')+' '+(stage+1)+' / 4</small><h3>'+steps[stage][0]+'</h3><p>'+steps[stage][1]+'</p><div class="board-controls"><button type="button" data-prev '+(stage===0?'disabled':'')+'>'+say('Back','Zurück')+'</button><button type="button" data-next>'+(stage===3?say('Start again','Noch einmal'):say('Next step','Weiter'))+'</button></div></div></div></section>';
      this.querySelector('[data-prev]').onclick = () => { stage--; draw(); this.querySelector(stage?'[data-prev]':'[data-next]').focus(); };
      this.querySelector('[data-next]').onclick = () => { stage=(stage+1)%4; draw(); this.querySelector('[data-next]').focus(); };
      if(!matchMedia('(prefers-reduced-motion: reduce)').matches && stage){
        if(catheter) this.querySelector('path').animate([{strokeDashoffset:offsets[stage-1]},{strokeDashoffset:offsets[stage]}],{duration:1100});
        else this.querySelector('g').animate(stage===3?[{translate:'-63px 92px'},{translate:'0 0'}]:[{opacity:.35},{opacity:1}],{duration:800});
      }
    };
    draw();
  }
}
customElements.define('board-guide',BoardGuide);
