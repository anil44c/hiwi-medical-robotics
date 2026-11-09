(() => {
  const cfg=window.stationAuth;
  const configured=Boolean(cfg?.url && cfg?.publicKey);
  const fields = ['name','tag','desc','why','setup','reflect'];
  const esc = text => text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const message = (en,de) => lang==='de'?de:en;
  let token='', revision=0, draft, original, editing=false, busy=false;
  const videos=new Map();
  const style=document.createElement('style');
  style.textContent='.manage-bar{position:sticky;top:0;z-index:1000;background:#163e38;color:white;padding:10px 4vw;display:flex;align-items:center;gap:9px;flex-wrap:wrap;font:15px system-ui}.manage-bar button,.manage-dialog button,.manage-file{background:white;color:#173f39;padding:7px 12px;border:1px solid #69988a;border-radius:8px;cursor:pointer;font:inherit}.manage-dialog{max-width:min(450px,90vw);border:1px solid #aac6b9;border-radius:14px;padding:24px}.manage-dialog input{width:100%;margin:12px 0;padding:8px}.manage-dialog::backdrop{background:#10282288}[data-edit-field][contenteditable=true]{outline:1.5px dashed #408f80;outline-offset:3px;cursor:text}.manage-file{display:inline-block;margin:8px}.manage-bar [role=status]{font-size:13px}';
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
  let bar,status;
  function tell(text){status.textContent=text;}
  function dirty(){return original && (JSON.stringify(original)!==JSON.stringify(draft)||videos.size);}
  function cleanup(){for(const video of videos.values()) URL.revokeObjectURL(video.url);videos.clear();}
  addEventListener('beforeunload',event=>{if(dirty()){event.preventDefault();event.returnValue='';}});
  function buttons(){
    bar.replaceChildren();
    const add=(label,action)=>{const b=document.createElement('button');b.textContent=label;b.disabled=busy;b.onclick=action;bar.append(b);};
    if(!draft)add(message('Administrator sign in','Verwaltung anmelden'),login);
    else {
      add(editing?message('Preview','Vorschau'):message('Edit page','Seite bearbeiten'),()=>{editing=!editing;refresh();});
      add(message('Publish','Veröffentlichen'),publish);
      add(message('Sign out','Abmelden'),()=>{if(dirty()&&!confirm(message('Discard unpublished changes?','Unveröffentlichte Änderungen verwerfen?')))return;cleanup();token='';original=draft=null;location.replace(location.pathname+location.hash);});
    }
    status=document.createElement('span');status.setAttribute('role','status');bar.append(status);
  }
  function refresh(){apply(draft);renderHome();route(false);buttons();}
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
        const access=await api('/rest/v1/station_editors?select=id&id=eq.'+encodeURIComponent(session.user.id));
        if(!access.length)throw Error(message('This account cannot publish.','Dieses Konto darf nicht veröffentlichen.'));
        const [row]=await api('/rest/v1/station_publication?id=eq.1&select=content,revision');
        revision=row.revision;original=row.content || await (await fetch('station-content.json',{cache:'no-cache'})).json();
        draft=structuredClone(original);
        editing=true;refresh();tell(message('Open a station and click the outlined text.','Öffne eine Station und klicke auf den umrandeten Text.'));
      }catch(err){token='';tell(err.message);}
    };
  }
  function decorate(){
    const id=stationId(),locale=langKey(),entry=draft?.[locale]?.[id];
    const video=document.querySelector('#detail:not([hidden]) .story-video video');
    const stored=(draft||window.stationPublishedContent)?.media?.[id];
    if(video && (videos.has(id)||/^assets\/managed\/[a-zA-Z0-9-]+\.mp4$/.test(stored||''))){
      video.src=videos.get(id)?.url||(configured && stored.startsWith('assets/managed/cloud-')?cfg.url+'/storage/v1/object/public/station-films/'+stored.split('/').pop():stored);
    }
    if(!entry||!editing)return;
    for(const node of document.querySelectorAll('#detail [data-edit-field]')){
      const key=node.dataset.editField;node.contentEditable='plaintext-only';
      node.oninput=()=>{entry[key]=node.textContent.trim();};
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
  {bar=document.createElement('aside');bar.className='manage-bar';document.body.prepend(bar);bar.hidden=true;bar.style.display='none';document.querySelector('#station-admin').onclick=()=>{bar.hidden=false;bar.style.display='flex';buttons();if(!draft)login();};buttons();}
  decorate();
})();
