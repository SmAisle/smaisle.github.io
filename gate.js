// Invite gate for smAisle's test games on smaisle.github.io. Add it at the top of <head>:
//   <script src="https://smaisle.github.io/gate.js" data-game="shuffleblast" data-name="Shuffle Blast"></script>
// Accepts a code made on stats.html that includes this game (game: 'shuffleblast', 'daily15,gramble', or 'all').
// Remembered per browser in smaisle_inv, shared by every game on this site. A soft lock only.
(function(){
  var me=document.currentScript, GAME=me.getAttribute('data-game'), NAME=me.getAttribute('data-name')||'This game';
  if(!/github\.io$/.test(location.hostname)) return;
  var KEY='smaisle_inv', DOC='https://firestore.googleapis.com/v1/projects/aislerun-88e79/databases/(default)/documents/invite_codes/';
  var API='AIzaSyAlbSCTpAiK-1tojkyWrY3QuJsSzILHSfs';
  function list(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ return []; } }
  function ok(){ var l=list(); return l.indexOf(GAME)>=0||l.indexOf('all')>=0; }
  function keep(g){ var l=list(); if(l.indexOf(g)<0){ l.push(g); try{ localStorage.setItem(KEY,JSON.stringify(l)); }catch(e){} } }
  // Resolves to the code's game when it opens this one, else null.
  function check(raw){
    var c=String(raw||'').replace(/\s+/g,'').toUpperCase();
    if(!/^[A-Z0-9]{3,20}$/.test(c)) return Promise.resolve(null);
    return fetch(DOC+c+'?key='+API).then(function(r){ return r.ok?r.json():null; })
      .then(function(d){ var g=d&&d.fields&&d.fields.game?d.fields.game.stringValue:null; var l=String(g||'').split(','); return l.indexOf(GAME)>=0||g==='all'?(g==='all'?'all':GAME):null; })
      .catch(function(){ return null; });
  }
  // Counts one use of the code on the stats page (Firestore invite_uses). Fire and forget.
  function logUse(c,where){ try{ fetch(DOC.replace('invite_codes/','invite_uses')+'?key='+API,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{code:{stringValue:c},where:{stringValue:where},t:{integerValue:String(Date.now())}}})}).catch(function(){}); }catch(e){} }
  if(ok()){ if(/[?&]code=/.test(location.search)) history.replaceState(null,'',location.pathname+location.hash); return; }
  var st=document.createElement('style');
  st.textContent='body>*:not(#smGate){display:none!important}#smGate{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#111;color:#fff;font:17px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:24px;z-index:99999}#smGate form{max-width:360px;width:100%;text-align:center}#smGate h1{font-size:28px;margin:0 0 8px}#smGate input{width:100%;box-sizing:border-box;font:inherit;letter-spacing:.08em;text-transform:uppercase;padding:12px;border:0;border-radius:12px;background:#fff;color:#111;margin:14px 0 10px}#smGate button{font:inherit;font-weight:700;padding:12px 26px;border:0;border-radius:12px;background:#ffd23f;color:#111;cursor:pointer}#smGate p{margin:0;opacity:.85}#smGate .bad{color:#ff8a80;opacity:1;margin-top:12px}';
  document.head.appendChild(st);
  function show(){
    var g=document.createElement('div'); g.id='smGate';
    g.innerHTML='<form autocomplete="off"><h1></h1><p>This game is in testing. Enter your invite code to play.</p><input aria-label="Invite code" placeholder="Invite code" autocapitalize="characters" spellcheck="false"><button type="submit">Play</button><p class="bad" hidden>That code didn\'t work. Check it and try again.</p></form>';
    g.querySelector('h1').textContent=NAME;
    document.body.appendChild(g);
    var f=g.querySelector('form');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var typed=f.querySelector('input').value.replace(/\s+/g,'').toUpperCase();
      check(typed).then(function(y){ if(y){ keep(y); logUse(typed,GAME); location.reload(); } else f.querySelector('.bad').hidden=false; });
    });
  }
  // Arriving from smaisle.app with ?code=...: check it, then drop it from the address bar.
  var m=/[?&]code=([^&#]+)/.exec(location.search);
  if(m){
    var url=location.pathname+location.hash;
    check(decodeURIComponent(m[1])).then(function(y){
      if(y){ keep(y); location.replace(url); }
      else { history.replaceState(null,'',url); if(document.body) show(); else document.addEventListener('DOMContentLoaded',show); }
    });
    return;
  }
  if(document.body) show(); else document.addEventListener('DOMContentLoaded',show);
})();
