// Invite gate for smAisle's test games on smaisle.github.io. Add it at the top of <head>:
//   <script src="https://smaisle.github.io/gate.js" data-game="shuffleblast" data-name="Shuffle Blast"></script>
// Accepts a code made on stats.html that includes this game (game: 'shuffleblast', 'daily15,gramble', or 'all').
// Remembered per browser in smaisle_inv, shared by every game on this site. A soft lock only.
(function(){
  var me=document.currentScript, GAME=me.getAttribute('data-game'), NAME=me.getAttribute('data-name')||'This game';
  // data-any lets a page open with a code for any of the games listed (smAisle Daily: any daily game's code).
  var OPEN=[GAME].concat((me.getAttribute('data-any')||'').split(',').filter(Boolean));
  // Each game's icon on its invite screen (same icons as smAisle Daily and smaisle.app).
  var ICON={daily:'smaisle-daily',daily15:'daily-15',abcdeal:'abc-deal',gramble:'gramble',shuffleblast:'shuffle-blast',sdblast:'straight-down'}[GAME];
  if(!/github\.io$|smaisle\.app$/.test(location.hostname)) return;
  var KEY='smaisle_inv', DOC='https://firestore.googleapis.com/v1/projects/aislerun-88e79/databases/(default)/documents/invite_codes/';
  var API='AIzaSyAlbSCTpAiK-1tojkyWrY3QuJsSzILHSfs';
  function list(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ return []; } }
  function ok(){ var l=list(); return l.indexOf('all')>=0||OPEN.some(function(g){ return l.indexOf(g)>=0; }); }
  function keep(g){ var l=list(); if(l.indexOf(g)<0){ l.push(g); try{ localStorage.setItem(KEY,JSON.stringify(l)); }catch(e){} } }
  // Resolves to the code's game when it opens this one, else null.
  function check(raw){
    var c=String(raw||'').replace(/\s+/g,'').toUpperCase();
    if(!/^[A-Z0-9]{3,20}$/.test(c)) return Promise.resolve(null);
    return fetch(DOC+c+'?key='+API).then(function(r){ return r.ok?r.json():null; })
      .then(function(d){ var g=d&&d.fields&&d.fields.game?d.fields.game.stringValue:null; var l=String(g||'').split(','); if(g==='all') return 'all'; for(var i=0;i<OPEN.length;i++) if(l.indexOf(OPEN[i])>=0) return OPEN[i]; return null; })
      .catch(function(){ return null; });
  }
  // Counts one use of the code on the stats page (Firestore invite_uses). Fire and forget.
  function logUse(c,where){ try{ fetch(DOC.replace('invite_codes/','invite_uses')+'?key='+API,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{code:{stringValue:c},where:{stringValue:where},t:{integerValue:String(Date.now())}}})}).catch(function(){}); }catch(e){} }
  // Which code this device used (for the "By code" table on stats.html). smaisle.app's Invite only page
  // keeps smaisle_codes = {game: code}; this screen keeps the last code typed here in smaisle_code.
  function codeFor(){ var c=''; try{ c=(JSON.parse(localStorage.getItem('smaisle_codes')||'{}')||{})[GAME]||localStorage.getItem('smaisle_code')||''; }catch(e){}
    if(!c){ try{ if(localStorage.getItem('d15_unlocked')==='1'||localStorage.getItem('dg_invite')==='1') c='FAMILY&FRIENDS'; }catch(e){} } return c||'unknown'; }
  // Anonymous check-in per device: its code and which testing games it opened (inv_devices). Website only.
  function seen(){ try{
    var pad=function(n){return (n<10?'0':'')+n}, d=new Date(), day=d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
    var dev=localStorage.getItem('smaisle_dev'); if(!dev){ dev=Array.from(crypto.getRandomValues(new Uint8Array(12)),function(b){return 'abcdefghijklmnopqrstuvwxyz0123456789'[b%36];}).join(''); localStorage.setItem('smaisle_dev',dev); }
    var u=JSON.parse(localStorage.getItem('smaisle_seen')||'null')||{first:day,o:{},d:{}};
    u.o[GAME]=(u.o[GAME]||0)+1; u.d[GAME]=day; u.tm=u.tm||{}; u.tm[GAME]=Date.now(); localStorage.setItem('smaisle_seen',JSON.stringify(u));
    var I=function(n){return {integerValue:String(n)}}, T=function(v){return {stringValue:String(v)}}, M=function(m,f){var o={};for(var k in m)o[k.replace(/[^A-Za-z0-9_]/g,'_')]=f(m[k]);return {mapValue:{fields:o}}};
    var body={fields:{code:T(codeFor()),first:T(u.first),last:T(day),o:M(u.o,I),d:M(u.d,T),tm:M(u.tm,I),desk:{booleanValue:innerWidth>=820},t:I(Date.now())}};
    fetch(DOC.replace('invite_codes/','inv_devices/')+dev+'?key='+API,{method:'PATCH',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).catch(function(){});
  }catch(e){} }
  if(ok()){ if(/[?&]code=/.test(location.search)) history.replaceState(null,'',location.pathname+location.hash); seen(); return; }
  // iPhone zooms in on a focused text box when the page can still zoom. Make sure it can't, even when this
  // script runs before the game's own viewport tag, and keep the box at 17px (iOS zooms on anything under 16).
  if(!document.querySelector('meta[name=viewport]')){ var vm=document.createElement('meta'); vm.name='viewport'; vm.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'; document.head.appendChild(vm); }
  var st=document.createElement('style');
  // Same cream newspaper look as The Daily 15's own invite screen and smAisle Daily, so every game's invite screen matches.
  st.textContent='body>*:not(#smGate){display:none!important}#smGate{touch-action:manipulation;position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#f4efe3;color:#1a1a1a;font:17px/1.5 Georgia,serif;padding:24px;z-index:99999}#smGate form{max-width:360px;width:100%;text-align:center}#smGate h1{font-size:28px;margin:0 0 8px}#smGate input{width:100%;box-sizing:border-box;font:inherit;font-size:17px;letter-spacing:.08em;text-transform:uppercase;padding:10px 12px;border:2px solid #1a1a1a;border-radius:0;background:#fff;color:#1a1a1a;margin:12px 0 8px;-webkit-appearance:none}#smGate button{font:inherit;font-weight:bold;padding:10px 22px;border:2px solid #1a1a1a;border-radius:0;background:#1a1a1a;color:#f4efe3;cursor:pointer}#smGate p{margin:0}#smGate .bad{color:#b3261e;margin-top:10px}#smGate .gic{width:72px;height:72px;border-radius:17px;border:1px solid rgba(0,0,0,.15);display:block;margin:0 auto 12px}#smGate .gx{font-size:13px;color:#6b6457;margin-top:14px}#smGate .gm{position:fixed;left:0;right:0;bottom:calc(18px + env(safe-area-inset-bottom));text-align:center;font:bold 15px Georgia,serif}#smGate .gm span{font:800 11px -apple-system,sans-serif;background:#ffd43b;border:1.5px solid #1a1a1a;padding:1px 5px;margin-right:4px}';
  document.head.appendChild(st);
  function show(){
    var g=document.createElement('div'); g.id='smGate';
    g.innerHTML='<form autocomplete="off">'+(ICON?'<img class="gic" alt="" src="https://smaisle.github.io/daily/icons/'+ICON+'.png">':'')+'<h1></h1><p><span class="gn"></span> is in testing. Enter your invite code to play.</p><input aria-label="Invite code" placeholder="Invite code" autocapitalize="characters" spellcheck="false"><button type="submit">Play</button><p class="bad" hidden>That code didn\'t work. Check it and try again.</p><p class="gx">Enter it once. This device remembers it for every smAisle game it unlocks.</p></form>'+(/^(daily15|abcdeal|gramble)$/.test(GAME)?'<div class="gm"><span>smAisle</span>Daily</div>':'<div class="gm"><span>smAisle</span></div>');
    g.querySelector('h1').textContent=NAME; g.querySelector('.gn').textContent=NAME;
    document.body.appendChild(g);
    var f=g.querySelector('form');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var typed=f.querySelector('input').value.replace(/\s+/g,'').toUpperCase();
      check(typed).then(function(y){ if(y){ keep(y); try{ localStorage.setItem('smaisle_code',typed); }catch(e){} logUse(typed,GAME); f.querySelector('input').blur(); location.reload(); } else f.querySelector('.bad').hidden=false; });
    });
  }
  // Arriving from smaisle.app with ?code=...: check it, then drop it from the address bar.
  var m=/[?&]code=([^&#]+)/.exec(location.search);
  if(m){
    var url=location.pathname+location.hash;
    check(decodeURIComponent(m[1])).then(function(y){
      if(y){ keep(y); try{ localStorage.setItem('smaisle_code',decodeURIComponent(m[1]).replace(/\s+/g,'').toUpperCase()); }catch(e){} location.replace(url); }
      else { history.replaceState(null,'',url); if(document.body) show(); else document.addEventListener('DOMContentLoaded',show); }
    });
    return;
  }
  if(document.body) show(); else document.addEventListener('DOMContentLoaded',show);
})();
