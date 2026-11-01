// smAisle games list: one file that feeds smAisle Daily and every "More from smAisle" page.
// Load it with a script tag pointing at https://smaisle.github.io/daily/games.js, then use window.SMAISLE.
//
// "Finished today" is shared through this site's browser storage (every game lives on smaisle.github.io):
//   - A game can call SMAISLE.markDone('d15') when today's game is finished. That writes
//     localStorage 'smaisle_done' = {"YYYY-MM-DD": ["d15", ...]} (last 60 days kept).
// archive:true marks games that have their own Archive of past days.
//   - Until each game does that, SMAISLE.isDone() also reads the games' own saved results.
// Days use the device's own date, the same as the games do.
(function(){
  var BASE='https://smaisle.github.io/';
  var ICONS=BASE+'daily/icons/';
  var GAMES=[
    // Today's Games (daily)
    {id:'d15',name:'The Daily 15',daily:true,archive:true,icon:ICONS+'daily-15.png',sub:'Word grid · new puzzle daily',tag:'Daily word puzzle',
     desc:'Fit 15 words into a crossword-style grid. A new puzzle every day, the same for everyone, with stars and streaks.',url:BASE+'DailyGrid/'},
    {id:'abc',name:'A, B, C, Deal',daily:true,archive:true,icon:ICONS+'abc-deal.png',sub:"Beat the dealer's word · 5 hands",tag:'Daily card game',
     desc:'Played like blackjack with letter cards. Make a better word than the dealer across five hands a day.',url:BASE+'abcdeal/'},
    {id:'gr',name:'Gramble',daily:true,icon:ICONS+'gramble.png',sub:'Clear 10 words with $5',tag:'Daily card game',
     desc:'Hold and hit letter cards to clear 10 words with $5, then cash out or let it ride. Play money only.',url:BASE+'gramble/'},
    // Apps on the App Store (appStore is filled in once each app is live)
    {id:'sd',name:'Straight Down',store:true,appStore:'',icon:ICONS+'straight-down.png',tag:'Arcade',sub:'Falling-card poker game',
     desc:'Falling-card poker game. Steer the cards and build the best hands.',url:BASE+'StraightDown/'},
    {id:'sb',name:'Shuffle Blast',store:true,appStore:'',icon:ICONS+'shuffle-blast.png',tag:'Puzzle',sub:'Block puzzle with bombs',
     desc:'Block puzzle with bombs, rubble and shuffles.',url:BASE+'ShuffleBlast/'},
    // Play on the web
    {id:'br',name:'Bullseye Roulette',icon:ICONS+'bullseye-roulette.png',tag:'Darts',sub:'Darts plus roulette',
     desc:'Darts plus roulette, with a vs Computer mode.',url:BASE+'BullseyeRoulette/'},
    {id:'cn',name:'Connello',icon:ICONS+'connello.png',tag:'Strategy',sub:'Drop-four game with flips',
     desc:'Drop-four game with flips, in Classic and Bank modes.',url:BASE+'Connello/'}
  ];
  var HUB={id:'daily',name:'smAisle Daily',icon:ICONS+'smaisle-daily.png',url:BASE+'daily/',
    sub:'The Daily 15, A, B, C, Deal and Gramble in one place'};

  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function json(k){ try{ return JSON.parse(get(k)||'null'); }catch(e){ return null; } }
  function pad(n){ return (n<10?'0':'')+n; }
  function dayKey(d){ d=d||new Date(); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function shared(){ var s=json('smaisle_done'); return s&&typeof s==='object'?s:{}; }

  // Each game's own saved result for a day, read straight from its storage.
  var OWN={
    d15:function(day){ return !!get('cb_day2_'+day); },
    gr:function(day){ return !!get('rw_day_'+day); },
    // Classic (abc-) or Deal 'Em (abch-): either one finished counts.
    abc:function(day){
      return ['abc-','abch-'].some(function(p){
        var h=json(p+'hist'); if(h&&h[day]&&String(h[day].r||'').length>=5) return true;
        var k=json(p+'day8'); return !!k&&k.date===day&&(k.hands||[]).filter(function(x){return x&&x.done;}).length>=5;
      });
    }
  };
  // Other ids a game may write to smaisle_done that count as the same game (A, B, C, Deal 'Em).
  var ALSO={abc:'abch'};
  var STARTED={
    d15:function(day){ return !!get('cb_prog_'+day); },
    gr:function(day){ return !!get('rw_prog_'+day); },
    abc:function(day){ return ['abc-','abch-'].some(function(p){ var k=json(p+'day8'); return !!k&&k.date===day&&(k.hands||[]).some(function(x){return x&&x.done;}); }); }
  };

  window.SMAISLE={
    games:GAMES, hub:HUB, dayKey:dayKey,
    game:function(id){ for(var i=0;i<GAMES.length;i++) if(GAMES[i].id===id) return GAMES[i]; return null; },
    isDone:function(id,day){
      day=day||dayKey(); var s=shared()[day];
      if(s&&(s.indexOf(id)>=0||(ALSO[id]&&s.indexOf(ALSO[id])>=0))) return true;
      try{ return OWN[id]?OWN[id](day):false; }catch(e){ return false; }
    },
    isStarted:function(id,day){ day=day||dayKey(); try{ return STARTED[id]?STARTED[id](day):false; }catch(e){ return false; } },
    markDone:function(id,day){
      day=day||dayKey(); var s=shared(); s[day]=s[day]||[];
      if(s[day].indexOf(id)<0) s[day].push(id);
      var keys=Object.keys(s).sort(); while(keys.length>60) delete s[keys.shift()];
      try{ localStorage.setItem('smaisle_done',JSON.stringify(s)); }catch(e){}
    }
  };
})();
