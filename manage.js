(() => {
  const cfg=window.stationAuth;
  const configured=Boolean(cfg?.url && cfg?.publicKey);
  const fields = ['name','tag','desc','why','setup','reflect'];
  const esc = text => text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const message = (en,de) => lang==='de'?de:en;
  let token='', revision=0, draft, original, editing=false, busy=false;
  const videos=new Map();
  const style=document.createElement('style');
  style.textContent='.manage-bar{position:fixed;right:12px;bottom:12px;z-index:1000;max-width:min(440px,94vw);background:white;color:#173f39;padding:10px;border:1px solid #aec4b9;border-radius:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;font:15px system-ui}.manage-bar[hidden]{display:none}.manage-bar button,.manage-dialog button,.manage-file{background:white;color:#173f39;padding:7px 12px;border:1px solid #69988a;border-radius:8px;cursor:pointer;font:inherit}.manage-dialog{max-width:min(450px,90vw);border:1px solid #aac6b9;border-radius:14px;padding:24px}.manage-dialog input{width:100%;margin:12px 0;padding:8px}.manage-dialog::backdrop{background:#10282288}[data-edit-field][contenteditable=true]{outline:1.5px dashed #408f80;outline-offset:3px;cursor:text}.manage-file{display:inline-block;margin:8px}.manage-bar [role=status]{font-size:13px}';
  document.head.append(style);
  async function api(path,method='GET',body,extra={}){
    const raw=body instanceof Blob;
    const headers={apikey:cfg.publicKey,'Content-Type':raw?'video/mp4':'application/json',...extra};
    if(token)headers.Authorization='Bearer '+token;
    const res=await fetch(cfg.url+path,{method,headers,body:raw?body:JSON.stringify(body),cache:'no-store'});
    if(!res.ok)throw Error(message('Request denied or unavailable. Check your sign-in and publishing permission.','Anfrage fehlgeschlagen. Bitte Anmeldung und Berechtigung prüfen.'));
    return res.status===204?null:res.json();
  }
  const stationId=()=>location.hash.replace('#station/','');
  const langKey=()=>lang==='de'?'de':'en';
  function apply(content){
    for(const [locale,stations] of [['en',englishData],['de',germanData]])
      for(const station of stations){
        const values=content[locale]?.[station.id];
        if(values)for(const field of fields)station[field]=esc(values[field]);
      }
  }

  const builtInQuestions=structuredClone(stationLumiQuestions);
  function syncQuiz(content){
    for(const id of Object.keys(builtInQuestions)){
      const next=content?.quiz?.[id]||builtInQuestions[id];
      if(JSON.stringify(next)===JSON.stringify(stationLumiQuestions[id]))continue;
      stationLumiQuestions[id]=structuredClone(next);delete stationLumiStates[id];
      sessionStorage.removeItem('lumi-station-'+id);
    }
  }
  window.syncStationQuiz=syncQuiz;
  function button(label,fn){const b=document.createElement('button');b.className='manage-file';b.type='button';b.textContent=label;b.onclick=fn;return b;}
  function dialog(title){
    const d=document.createElement('dialog');d.className='manage-dialog';d.style.cssText='width:min(550px,94vw);max-height:85vh;overflow:auto';
    const h=document.createElement('h2');h.textContent=title;d.append(h,button(message('Close','Schließen'),()=>d.close()));
    document.body.append(d);d.onclose=()=>d.remove();d.showModal();return d;
  }
  function input(d,title,value){
    const l=document.createElement('label'),a=document.createElement('textarea');l.textContent=title;a.value=value;a.rows=2;
    a.style.cssText='display:block;width:100%;font:inherit;margin:4px 0 12px';l.append(a);d.append(l);return a;
  }
  function form(title,labels,values,save,correct){
    const d=dialog(title),inputs=labels.map((label,i)=>input(d,label,values[i])),select=document.createElement('select');
    if(correct!==undefined){['A','B','C'].forEach((v,i)=>select.add(new Option(v,i)));select.value=correct;d.append(message('Correct answer ','Richtige Antwort '),select);}
    const status=document.createElement('p');status.setAttribute('role','status');
    const submit=button(message('Translate and save draft','Übersetzen und Entwurf speichern'),async()=>{
      const texts=inputs.map(n=>n.value.trim());if(texts.some(v=>!v)){status.textContent=message('Complete all fields.','Bitte alle Felder ausfüllen.');return;}
      submit.disabled=true;let translator;
      try{
        if(!window.Translator)throw Error(message('Open this editor in desktop Chrome to translate.','Öffne den Editor zum Übersetzen in Chrome am Computer.'));
        status.textContent=message('Preparing translation…','Übersetzung wird vorbereitet…');
        const sourceLanguage=langKey(),targetLanguage=sourceLanguage==='de'?'en':'de';
        translator=await Translator.create({sourceLanguage,targetLanguage});
        const translations=[];for(const text of texts){const result=(await translator.translate(text)).trim();if(!result)throw Error('Translation unavailable');translations.push(result);}
        if(!d.open)return;save(texts,translations,Number(select.value));d.close();refresh();
        tell(message('Both languages saved to draft. Preview or publish.','Beide Sprachen im Entwurf gespeichert.'));
      }catch(e){status.textContent=e.message;submit.disabled=false;}finally{translator?.destroy();}
    });d.append(status,submit);
  }
  function editBank(id,locale){
    const list=draft.quiz?.[id]||builtInQuestions[id],d=dialog(message('Lumi questions','Lumis Fragen'));
    function edit(i){
      d.close();const q=list[i],v=q?.[locale],other=locale==='en'?'de':'en';
      form('Lumi · '+locale.toUpperCase(),[message('Question','Frage'),'A','B','C',message('Explanation','Erklärung')],v?[v.question,...v.options,v.explanation]:['','','','',''],(texts,translations,answer)=>{
        const pack=a=>({question:a[0],options:a.slice(1,4),explanation:a[4]});
        const bank=((draft.quiz??={})[id]??=structuredClone(list));
        bank[i<0?bank.length:i]={name:q?.name||id,answer,[locale]:pack(texts),[other]:pack(translations)};
      },q?.answer??0);
    }
    d.append(button(message('Add question','Frage hinzufügen'),()=>edit(-1)));
    list.forEach((q,i)=>d.append(button(q[locale].question,()=>edit(i))));
  }
  function article(id,locale,entry){
    const root=document.querySelector('#detail:not([hidden])');if(!root||!builtInStations.has(id))return;
    const content=draft||window.stationPublishedContent,other=locale==='en'?'de':'en';
    for(const n of root.querySelectorAll('[data-edit-field],section h2,section h3,section p')){
      const key=n.dataset.editField;
      if(!key&&(n.children.length||!n.textContent.trim()||n.closest('[data-station-quiz],board-guide,[aria-live],button')||n.hidden))continue;
      let path='',cur=n;while(cur!==root){const siblings=Array.from(cur.parentElement.children).filter(x=>x.tagName===cur.tagName);path=cur.tagName+siblings.indexOf(cur)+'/'+path;cur=cur.parentElement;}
      const override=content?.articles?.[id]?.[locale]?.[path];if(!key&&override!==undefined)n.textContent=override;
      if(!entry||!editing)continue;
      n.after(button('✎ '+message('Edit','Bearbeiten'),()=>form(message('Edit text','Text bearbeiten'),['Text · '+locale.toUpperCase()],[n.textContent],([v],[t])=>{
        if(key){entry[key]=v;draft[other][id][key]=t;}
        else{const section=((draft.articles??={})[id]??={});(section[locale]??={})[path]=v;(section[other]??={})[path]=t;}
      })));
    }
  }
  const builtInStations=new Set(['robotics','laparoscopy','catheter','biopsy']);
  let manager=false;
  async function team(){
    const d=dialog(message('Manage users','Benutzer verwalten')),status=document.createElement('p'),list=document.createElement('div');
    const email=input(d,'E-mail',''),role=document.createElement('select');role.add(new Option('Editor','editor'));role.add(new Option('Admin','admin'));
    const rpc=(action,address='',is_manager=false)=>api('/rest/v1/rpc/station_team','POST',{action,address,is_manager});
    function show(rows){list.replaceChildren();for(const row of rows){const p=document.createElement('p');p.textContent=row.email+' · '+(row.manager?'Admin':'Editor')+(row.pending?' · '+message('Invited','Eingeladen'):'');
      if(!row.self)p.append(button(message('Remove','Entfernen'),async()=>{if(confirm(row.email+'?'))try{show(await rpc('remove',row.email));}catch(e){status.textContent=e.message;}}));list.append(p);}}
    d.append(role,button(message('Invite','Einladen'),async()=>{try{
      show(await rpc('invite',email.value.trim(),role.value==='admin'));const url=location.origin+location.pathname+'?invite=1';
      const mail=document.createElement('a');mail.href='mailto:'+encodeURIComponent(email.value.trim())+'?subject=Medical%20Robotics&body='+encodeURIComponent(url);
      mail.textContent=message('Send invitation email','Einladung per E-Mail senden');status.replaceChildren(mail,document.createElement('br'),url);
    }catch(e){status.textContent=e.message;}}),status,list);
    try{show(await rpc('list'));}catch(e){status.textContent=e.message;}
  }
  function invite(){
    const d=dialog(message('Accept invitation','Einladung annehmen')),email=input(d,'E-mail',''),password=document.createElement('input'),status=document.createElement('p');
    password.type='password';password.autocomplete='new-password';password.placeholder=message('New password','Neues Passwort');
    d.append(password,button(message('Create account','Konto erstellen'),async()=>{try{
      await api('/auth/v1/signup?redirect_to='+encodeURIComponent(location.origin+location.pathname),'POST',{email:email.value.trim(),password:password.value});
      password.value='';status.textContent=message('Confirm your email, then sign in using the user icon.','Bestätige deine E-Mail und melde dich über das Benutzersymbol an.');
    }catch(e){status.textContent=e.message;}}),button(message('Already registered? Sign in','Bereits registriert? Anmelden'),()=>{d.close();login();}),status);
  }

  let bar,status;
  function tell(text){status.textContent=text;}
  function dirty(){return original && (JSON.stringify(original)!==JSON.stringify(draft)||videos.size);}
  function cleanup(){for(const video of videos.values()) URL.revokeObjectURL(video.url);videos.clear();}
  addEventListener('beforeunload',event=>{if(dirty()){event.preventDefault();event.returnValue='';}});
  function buttons(){
    bar.replaceChildren();
    const add=(label,action)=>{const b=document.createElement('button');b.textContent=label;b.disabled=busy;b.onclick=action;bar.append(b);};
    if(draft){
      if(manager)add(message("Manage users","Benutzer verwalten"),team);
      add(editing?message('Preview','Vorschau'):message('Edit page','Seite bearbeiten'),()=>{editing=!editing;refresh();});
      add(message('Publish','Veröffentlichen'),publish);
      add(message('Sign out','Abmelden'),()=>{if(dirty()&&!confirm(message('Discard unpublished changes?','Unveröffentlichte Änderungen verwerfen?')))return;cleanup();token='';original=draft=null;location.replace(location.pathname+location.hash);});
    }
    status=document.createElement('span');status.setAttribute('role','status');bar.append(status);
  }
  function refresh(){syncQuiz(draft);apply(draft);renderHome();route(false);buttons();}
  async function login(){
    const dlg=document.createElement('dialog');dlg.className='manage-dialog';
    dlg.innerHTML='<form><h2>'+message('Administrator sign in','Verwaltung anmelden')+'</h2>'+(configured?'<label>E-mail<input type="email" autocomplete="username" required></label><label>'+message('Password','Passwort')+'<input type="password" autocomplete="current-password" required></label><button>'+message('Sign in','Anmelden')+'</button>':'<p>'+message('Administrator accounts have not been activated yet.','Verwaltungskonten sind noch nicht aktiviert.')+'</p>')+' <button type="button">'+message('Close','Schließen')+'</button></form>';
    document.body.append(dlg);dlg.showModal();dlg.querySelector('[type=button]').onclick=()=>dlg.close();dlg.onclose=()=>dlg.remove();
    dlg.querySelector('form').onsubmit=async e=>{
      e.preventDefault();if(!configured)return;
      const email=dlg.querySelector('[type=email]').value.trim(),password=dlg.querySelector('[type=password]').value;
      dlg.close();
      try{
        const session=await api('/auth/v1/token?grant_type=password','POST',{email,password});
        token=session.access_token;
        manager=false;
        try{manager=(await api('/rest/v1/rpc/station_team','POST',{action:'claim'})).manager===true;}catch{}
        const access=await api('/rest/v1/station_editors?select=id&id=eq.'+encodeURIComponent(session.user.id));
        if(!access.length)throw Error(message('This account cannot publish.','Dieses Konto darf nicht veröffentlichen.'));
        const [row]=await api('/rest/v1/station_publication?id=eq.1&select=content,revision');
        revision=row.revision;original=row.content || await (await fetch('station-content.json',{cache:'no-cache'})).json();
        draft=structuredClone(original);
        bar.hidden=false;editing=true;refresh();tell(message('Open a station and click the outlined text.','Öffne eine Station und klicke auf den umrandeten Text.'));
      }catch(err){token='';alert(err.message);}
    };
  }
  function decorate(){
    const id=stationId(),locale=langKey(),entry=draft?.[locale]?.[id];
    const video=document.querySelector('#detail:not([hidden]) .story-video video');
    const stored=(draft||window.stationPublishedContent)?.media?.[id];
    if(video && (videos.has(id)||/^assets\/managed\/[a-zA-Z0-9-]+\.mp4$/.test(stored||''))){
      video.src=videos.get(id)?.url||(configured && stored.startsWith('assets/managed/cloud-')?cfg.url+'/storage/v1/object/public/station-films/'+stored.split('/').pop():stored);
    }
    article(id,locale,entry);
    if(!entry||!editing)return;
    if(builtInQuestions[id]){
      document.querySelector('[data-station-quiz="'+id+'"]')?.before(button(message('Edit Lumi questions','Lumis Fragen bearbeiten'),()=>editBank(id,locale)));
    }
    if(video){
      const label=document.createElement('label');label.className='manage-file';label.textContent=message('Replace video (MP4) ','Video ersetzen (MP4) ');
      const input=document.createElement('input');input.type='file';input.accept='video/mp4,.mp4';label.append(input);video.parentElement.after(label);
      input.onchange=()=>{const file=input.files[0];if(!file)return;
        if(!/\.mp4$/i.test(file.name)||file.size>25*1024*1024){tell('Choose an MP4 up to 25 MB.');return;}
        if(videos.has(id))URL.revokeObjectURL(videos.get(id).url);
        const url=URL.createObjectURL(file);videos.set(id,{file,url,path:'assets/managed/cloud-'+id+'-'+crypto.randomUUID()+'.mp4'});video.src=url;tell(message('Preview the film and check subtitle timing before publishing.','Prüfe Film und Untertitel vor dem Veröffentlichen.'));
      };
    }
  }
  async function publish(){
    if(!dirty()){tell(message('No changes to publish.','Keine Änderungen vorhanden.'));return;}
    for(const locale of ['en','de'])for(const station of Object.values(draft[locale]))if(fields.some(key=>!station[key]?.trim())){tell(message('Complete every text field before publishing.','Fülle alle Textfelder vor dem Veröffentlichen aus.'));return;}
    if(!confirm(message('Publish these edits to the student site?','Änderungen auf der Lernseite veröffentlichen?')))return;
    busy=true;editing=false;refresh();tell(message('Publishing…','Wird veröffentlicht…'));
    try{
      const next=structuredClone(draft);
      for(const [id,v] of videos){
        if(!v.uploaded){await api('/storage/v1/object/station-films/'+v.path.split('/').pop(),'POST',v.file);v.uploaded=true;}
        (next.media??={})[id]=v.path;
      }
      const rows=await api('/rest/v1/station_publication?id=eq.1&revision=eq.'+revision,'PATCH',{content:next,revision:revision+1},{Prefer:'return=representation'});
      if(!rows.length)throw Error(message('Another editor published first. Reload before editing again.','Eine neue Version ist verfügbar. Bitte neu laden.'));
      revision++;draft=next;original=structuredClone(next);window.stationPublishedContent=next;cleanup();tell(message('Published.','Veröffentlicht.'));
    }catch(err){tell(err.message);}
    finally{busy=false;bar.querySelectorAll('button').forEach(b=>b.disabled=false);}
  }
  window.decorateStationEditor=decorate;
  {bar=document.createElement('aside');bar.className='manage-bar';document.body.append(bar);bar.hidden=true;document.querySelector('#station-admin').onclick=()=>{if(!draft)login();else bar.hidden=!bar.hidden;};buttons();}
  syncQuiz(window.stationPublishedContent);
  decorate();
  if(new URLSearchParams(location.search).get('invite')==='1')invite();
})();
