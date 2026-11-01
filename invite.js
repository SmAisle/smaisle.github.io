// Invite-only games on smaisle.app. Family&Friends opens invite.html; each game has its own codes,
// kept in Firestore (invite_codes/{CODE} -> {game}) and made on the stats page. A code's game can be one key, several joined by commas, or 'all'.
// This only hides links: anyone with a game's URL can still play it.
var Invite=(function(){
  var FAMILY=['FAMILY&FRIENDS','FAMILYANDFRIENDS','FAMILY+FRIENDS'], KEY='d15_unlocked', GKEY='smaisle_games', CKEY='smaisle_codes';
  var DOC='https://firestore.googleapis.com/v1/projects/aislerun-88e79/databases/(default)/documents/invite_codes/';
  var API='AIzaSyAlbSCTpAiK-1tojkyWrY3QuJsSzILHSfs';
  var URLS={daily15:'/DailyGrid/',shuffleblast:'/ShuffleBlast/',abcdeal:'/abcdeal/',gramble:'/gramble/',sdblast:'/StraightDown/blast.html'};
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  var last='';
  // Counts one use of the code on the stats page (Firestore invite_uses). Fire and forget.
  function logUse(c,where){ try{ fetch(DOC.replace('invite_codes/','invite_uses')+'?key='+API,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{code:{stringValue:c},where:{stringValue:where},t:{integerValue:String(Date.now())}}})}).catch(function(){}); }catch(e){} }

  function owned(){ try{ return JSON.parse(get(GKEY)||'[]'); }catch(e){ return []; } }
  function codes(){ try{ return JSON.parse(get(CKEY)||'{}'); }catch(e){ return {}; } }
  function own(g,code){
    var list=owned(); if(list.indexOf(g)<0){ list.push(g); set(GKEY,JSON.stringify(list)); }
    var c=codes(); c[g]=code; set(CKEY,JSON.stringify(c));
  }
  // Each game's own code screen opens straight away when its code rides along.
  function url(g){ var c=codes()[g]; return URLS[g]+(c?'?code='+encodeURIComponent(c):''); }
  return {
    owned:owned,
    family:function(){ return get(KEY)==='1'; },
    // Resolves to 'family', 'all' (every game now unlocked), 'some' (several unlocked), a game key, or null.
    check:function(raw){
      var code=String(raw||'').replace(/\s+/g,'').toUpperCase(); last=code;
      if(FAMILY.indexOf(code)>=0){ set(KEY,'1'); return Promise.resolve('family'); }
      if(!/^[A-Z0-9]{3,20}$/.test(code)) return Promise.resolve(null);
      return fetch(DOC+code+'?key='+API).then(function(r){ return r.ok?r.json():null; })
        .then(function(d){
          var g=d&&d.fields&&d.fields.game?d.fields.game.stringValue:null;
          if(g) logUse(code,'smaisle.app');
          if(g==='all'){ set(KEY,'1'); for(var k in URLS) own(k,code); return 'all'; }
          var l=String(g||'').split(',').filter(function(k){ return URLS[k]; });
          if(l.length>1){ l.forEach(function(k){ own(k,code); }); return 'some'; }
          return l[0]||null;
        })
        .catch(function(){ return null; });
    },
    // Remembers the game (and the code just checked) on this device and opens it.
    go:function(g){ own(g,last); location.href=url(g); },
    show:function(card){
      var a=card.querySelector('.play'); a.href=url(card.getAttribute('data-game')); a.hidden=false;
      card.querySelector('.gunlock').hidden=true; card.querySelector('.gbad').hidden=true; var lb=card.querySelector('.lockbtn'); if(lb) lb.hidden=true;
    }
  };
})();
