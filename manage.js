(() => {
  const repository = 'anil44c/hiwi-medical-robotics';
  const apiRoot = 'https://api.github.com/repos/' + repository;
  const enabled = new URLSearchParams(location.search).has('manage');
  const fields = ['name','tag','desc','why','setup','reflect'];
  const esc = text => text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const message = (en,de) => lang==='de'?de:en;
  let token='', base='', tree='', draft, original, editing=false, busy=false;
  const videos=new Map();
  const style=document.createElement('style');
  style.textContent='.manage-bar{position:sticky;top:0;z-index:1000;background:#163e38;color:white;padding:10px 4vw;display:flex;align-items:center;gap:9px;flex-wrap:wrap;font:15px system-ui}.manage-bar button,.manage-dialog button,.manage-file{background:white;color:#173f39;padding:7px 12px;border:1px solid #69988a;border-radius:8px;cursor:pointer;font:inherit}.manage-dialog{max-width:min(450px,90vw);border:1px solid #aac6b9;border-radius:14px;padding:24px}.manage-dialog input{width:100%;margin:12px 0;padding:8px}.manage-dialog::backdrop{background:#10282288}[data-edit-field][contenteditable=true]{outline:1.5px dashed #408f80;outline-offset:3px;cursor:text}.manage-file{display:inline-block;margin:8px}.manage-bar [role=status]{font-size:13px}';
  document.head.append(style);
  async function api(path,method='GET',body){
    const res=await fetch(apiRoot+path,{method,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:body&&JSON.stringify(body),cache:'no-store'});
    if(!res.ok)throw Error(res.status===401||res.status===403?'GitHub denied access. Check the repository and Contents write permission.':res.status===422?'Publication conflict. The repository changed or branch rules prevented publication.':'GitHub request failed ('+res.status+').');
    return res.json();
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
    dlg.innerHTML='<form><h2>'+message('Administrator sign in','Verwaltung anmelden')+'</h2><label>'+message('GitHub access token','GitHub-Zugriffstoken')+'<input type="password" autocomplete="off" required></label><p>'+message('Use a fine-grained token for this repository with Contents read and write permission. It stays in memory until you leave.','Nutze ein Fine-grained Token für dieses Repository mit Lese- und Schreibrechten für Contents. Es bleibt nur im Arbeitsspeicher.')+'</p><button>'+message('Sign in','Anmelden')+'</button> <button type="button">'+message('Cancel','Abbrechen')+'</button></form>';
    document.body.append(dlg);dlg.showModal();dlg.querySelector('[type=button]').onclick=()=>dlg.close();dlg.onclose=()=>dlg.remove();
    dlg.querySelector('form').onsubmit=async e=>{
      e.preventDefault();token=dlg.querySelector('input').value.trim();dlg.close();
      try{
        const meta=await api('');if(!(meta.permissions?.push||meta.permissions?.admin))throw Error('This account needs write access to the repository.');
        const commit=await api('/commits/main');base=commit.sha;tree=commit.commit.tree.sha;
        const file=await api('/contents/station-content.json?ref='+base);
        const bytes=Uint8Array.from(atob(file.content),c=>c.charCodeAt(0));
        original=JSON.parse(new TextDecoder().decode(bytes));draft=structuredClone(original);
        editing=true;refresh();tell(message('Open a station and click the outlined text.','Öffne eine Station und klicke auf den umrandeten Text.'));
      }catch(err){token='';tell(err.message);}
    };
  }
  function decorate(){
    const footer=document.querySelector('footer');
    if(footer&&!footer.querySelector('[data-manage-link]')){
      const a=document.createElement('a');a.dataset.manageLink='';a.href='?manage=1'+location.hash;a.textContent=message('Administration','Verwaltung');footer.append(' · ',a);
    }
    const id=stationId(),locale=langKey(),entry=draft?.[locale]?.[id];
    const video=document.querySelector('#detail:not([hidden]) .story-video video');
    const stored=(draft||window.stationPublishedContent)?.media?.[id];
    if(video && (videos.has(id)||/^assets\/managed\/[a-zA-Z0-9-]+\.mp4$/.test(stored||''))){
      video.src=videos.get(id)?.url||stored;
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
        const url=URL.createObjectURL(file);videos.set(id,{file,url,path:'assets/managed/'+id+'-'+crypto.randomUUID()+'.mp4'});video.src=url;tell(message('Preview the film and check subtitle timing before publishing.','Prüfe Film und Untertitel vor dem Veröffentlichen.'));
      };
    }
  }
  async function publish(){
    if(!dirty()){tell(message('No changes to publish.','Keine Änderungen vorhanden.'));return;}
    for(const locale of ['en','de'])for(const station of Object.values(draft[locale]))if(fields.some(key=>!station[key]?.trim())){tell(message('Complete every text field before publishing.','Fülle alle Textfelder vor dem Veröffentlichen aus.'));return;}
    if(!confirm(message('Publish these edits to the student site?','Änderungen auf der Lernseite veröffentlichen?')))return;
    busy=true;editing=false;refresh();tell(message('Publishing…','Wird veröffentlicht…'));
    try{
      if((await api('/commits/main')).sha!==base)throw Error('The site changed since sign-in. Reload and reapply your edits to the latest version.');
      const next=structuredClone(draft),entries=[];
      for(const [id,v] of videos){
        const content=await new Promise((ok,fail)=>{const reader=new FileReader();reader.onload=()=>ok(reader.result.split(',')[1]);reader.onerror=fail;reader.readAsDataURL(v.file);});
        const blob=await api('/git/blobs','POST',{encoding:'base64',content});
        entries.push({path:v.path,mode:'100644',type:'blob',sha:blob.sha});(next.media??={})[id]=v.path;
      }
      entries.push({path:'station-content.json',mode:'100644',type:'blob',content:JSON.stringify(next,null,2)+'\n'});
      const updated=await api('/git/trees','POST',{base_tree:tree,tree:entries});
      const commit=await api('/git/commits','POST',{message:'Update station content from the site',tree:updated.sha,parents:[base]});
      await api('/git/refs/heads/main','PATCH',{sha:commit.sha,force:false});
      base=commit.sha;tree=updated.sha;draft=next;original=structuredClone(next);cleanup();tell(message('Published to GitHub. Pages is deploying the update.','Auf GitHub veröffentlicht. Pages aktualisiert die Website.'));
    }catch(err){tell(err.message);}
    finally{busy=false;bar.querySelectorAll('button').forEach(b=>b.disabled=false);}
  }
  window.decorateStationEditor=decorate;
  if(enabled){bar=document.createElement('aside');bar.className='manage-bar';document.body.prepend(bar);buttons();}
  decorate();
})();
