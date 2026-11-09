(async function () {
  const el = id => document.getElementById(id);
  const key = 'hiwi-station-draft-v1';
  const labels = {name:'Station title',tag:'Topic',desc:'Short introduction',why:'The idea',setup:'Meet the setup',reflect:'Reflection question'};
  const serialize = value => JSON.stringify(value,null,2)+'\n';
  try {
    const response = await fetch('../station-content.json',{cache:'no-store'});
    if (!response.ok) throw Error();
    const live = await response.json();
    const baseline = serialize(live);
    let draft = structuredClone(live);
    const saved = JSON.parse(localStorage.getItem(key)||'null');
    if (saved && saved.base===baseline) draft=saved.content;
    if (saved && saved.base!==baseline) el('status').textContent='Published content changed. This editor has loaded the latest version.';
    for (const [id,station] of Object.entries(live.en)) el('station').add(new Option(station.name,id));
    function fields(){
      const station=draft[el('language').value][el('station').value];
      el('fields').replaceChildren();
      for(const [keyName,label] of Object.entries(labels)){
        const wrapper=document.createElement('label'), input=document.createElement('textarea');
        wrapper.textContent=label;
        input.rows=['name','tag'].includes(keyName)?1:3;
        input.value=station[keyName];
        input.oninput=()=>{station[keyName]=input.value; persist();};
        wrapper.append(input);el('fields').append(wrapper);
      }
    }
    function persist(){
      localStorage.setItem(key,JSON.stringify({base:baseline,content:draft}));
      el('status').textContent='Draft saved in this browser.';
    }
    function valid(){
      for(const language of ['en','de']) for(const [id,station] of Object.entries(draft[language]))
        for(const field of Object.keys(labels)) if(!station[field].trim()){
          el('status').textContent='Please complete '+labels[field]+' for '+id+' ('+language+').';return false;
        }
      return true;
    }
    el('station').onchange=el('language').onchange=fields;
    el('preview').onclick=()=>{
      if(!valid())return;
      persist();window.open('../?editor-preview='+el('language').value+'#station/'+el('station').value,'_blank','noopener');
    };
    el('discard').onclick=()=>{
      if(!confirm('Discard all unpublished text edits in this browser?'))return;
      localStorage.removeItem(key);draft=structuredClone(live);fields();el('status').textContent='Published text restored.';
    };
    el('copy').onclick=async()=>{
      if(!valid())return;
      try{
        const latest=await fetch('../station-content.json',{cache:'no-store'});
        if(!latest.ok || serialize(await latest.json())!==baseline){el('status').textContent='The published version changed. Review it before replacing the file.';return;}
        await navigator.clipboard.writeText(serialize(draft));el('status').textContent='Content copied. Continue in GitHub.';
      }catch{el('status').textContent='Copy failed. Check your connection and clipboard permission.';}
    };
    fields();
    for(const id of ['copy','preview','discard'])el(id).disabled=false;
  } catch {el('status').textContent='Could not open the editor. Check your connection and allow browser storage, then reload.';}
})();
