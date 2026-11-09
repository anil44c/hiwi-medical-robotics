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
    const labels = catheter
      ? [say('Meet the setup','Aufbau entdecken'),say('Find the entrance','Eingang finden'),say('Take the turn','Abbiegen'),say('Reach the kidney','Ziel erreichen')]
      : [say('Meet the setup','Aufbau entdecken'),say('Aim the tool','Werkzeug ansetzen'),say('Collect a piece','Probe nehmen'),say('Lift it out','Probe herausheben')];
    const route = 'M305 363 C303 316 303 286 313 245 C377 259 399 196 478 189';
    const tubes = route+' M313 245 Q315 203 293 166 Q251 148 208 179 Q170 205 130 204 M293 166 Q311 132 342 111 Q327 51 272 45 Q223 36 210 75 M342 111 Q436 119 485 107';
    const kidney = '<path d="M0 -43 C-35 -46 -53 -13 -49 17 C-47 47 -22 54 -4 46 C10 39 14 29 4 19 C-9 10 -13 4 -6 -5 C0 -10 15 -12 16 -23 Q17 -39 0 -43Z" fill="#f7dcbd" stroke="#805f53" stroke-width="3"/><path d="M-21 -29 Q-39 -12 -34 10 Q-31 29 -22 33 M-29 3 L-7 4" fill="none" stroke="#c39478" stroke-width="4" stroke-linecap="round"/>';
    function illustration(){
      const detail = !catheter && stage>0;
      const clay = '<path d="M464 180 Q461 172 470 168 Q477 160 486 168 Q497 167 498 177 Q505 189 492 195 Q479 202 467 195Z" fill="#c86879" stroke="#924259" stroke-width="2"/>';
      const sample = '<circle cx="481" cy="176" r="5" fill="#ffce63" stroke="#845e22" stroke-width="1.7"/>';
      const shift = stage===1 ? '12 -12' : stage===3 ? '31 -30' : '0 0';
      const tool = '<g data-tool transform="translate('+shift+')"><path d="M545 111 L488 168" stroke="#536d76" stroke-width="7"/><path d="M545 110 L489 166" stroke="#c8e1e4" stroke-width="3"/><path d="'+(stage===1?'M488 168 L477 173 M488 168 L485 181':'M488 168 L478 176 Q479 181 484 178 Z')+'" fill="#cadfe0" stroke="#385662" stroke-width="2"/>'+(stage>=2?sample:'')+'</g>';
      const catheterLine = '<path data-line d="'+route+'" fill="none" stroke="#126258" stroke-width="5" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="'+[100,86,32,0][stage]+'"/>';
      return '<svg style="display:block;width:100%;height:auto" viewBox="'+(detail?'425 90 147 145':'0 0 600 390')+'" role="img" aria-label="'+title+'"><rect width="600" height="390" rx="22" fill="#eef5ed"/><path d="M54 22 H549 L574 349 Q575 357 565 358 H30Z" fill="#d8eee9" stroke="#9ebfb9" stroke-width="3"/><g transform="translate(127 203)">'+kidney+'</g><g transform="translate(482 188) scale(-1 1)">'+kidney+'</g><path d="M166 68 Q175 54 194 65 L198 46 L210 47 L208 66 L223 55 L230 64 L218 77 Q239 94 220 120 Q208 139 186 145 Q157 125 153 99 Q150 81 166 68Z" fill="#f3c9b8" stroke="#966f62" stroke-width="3"/><path d="M175 80 Q195 74 208 86 M188 80 Q201 105 189 129" fill="none" stroke="#c4917d" stroke-width="4"/><g fill="none" stroke-linecap="round"><path d="'+tubes+'" stroke="#84aaa5" stroke-width="14"/><path d="'+tubes+'" stroke="#e6f7f4" stroke-width="9"/></g>'+(catheter?catheterLine:clay+(stage<2?sample:'')+(detail?tool:''))+'</svg>';
    }
    const draw = () => {
      this.innerHTML = '<section class="lap-guide"><div class="lap-heading"><div><div class="eyebrow">'+say('Your hands-on adventure','Dein Mitmach-Abenteuer')+'</div><h2>'+say('Ready, steady, gently.','Bereit? Ganz vorsichtig.')+'</h2></div></div><p class="lap-intro">'+title+'.</p><div class="lap-tabs" aria-label="'+say('Guide steps','Anleitungsschritte')+'">'+labels.map((label,i)=>'<button type="button" data-stage="'+i+'" aria-current="'+(i===stage?'step':'false')+'"><span>0'+(i+1)+'</span>'+label+'</button>').join('')+'</div><div class="lap-split"><div class="trainer-stage">'+illustration()+'</div><div aria-live="polite"><h3>'+steps[stage][0]+'</h3><p>'+steps[stage][1]+'</p></div></div><div class="lap-navigation"><button type="button" class="btn light" data-prev '+(stage===0?'disabled':'')+'>← '+say('Back','Zurück')+'</button><span>'+(stage+1)+' / 4</span><button type="button" class="btn" data-next>'+(stage===3?say('Start again','Neu starten'):say('Next step','Nächster Schritt'))+' →</button></div></section>';
    };
    this.onclick = event => {
      const button = event.target.closest('button');
      if(!button) return;
      const previous = stage;
      stage = button.hasAttribute('data-stage') ? Number(button.dataset.stage) : button.hasAttribute('data-prev') ? stage-1 : (stage+1)%4;
      draw();
      this.querySelector('[data-stage="'+stage+'"]').focus({preventScroll:true});
      if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if(catheter && stage>0) this.querySelector('[data-line]').animate([{strokeDashoffset:[100,86,32,0][previous]},{strokeDashoffset:[100,86,32,0][stage]}],{duration:1000});
      if(!catheter && stage>0) this.querySelector('[data-tool]').animate([{translate:stage===3?'-31px 30px':'10px -10px'},{translate:'0 0'}],{duration:800});
    };
    draw();
  }
}
customElements.define('board-guide',BoardGuide);
