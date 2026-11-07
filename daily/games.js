// smAisle games list: one file that feeds smAisle Daily and every "More from smAisle" page.
// Load it with a script tag pointing at https://smaisle.app/daily/games.js, then use window.SMAISLE.
//
// "Finished today" is shared through this site's browser storage (every game lives on smaisle.app):
//   - A game can call SMAISLE.markDone('d15') when today's game is finished. That writes
//     localStorage 'smaisle_done' = {"YYYY-MM-DD": ["d15", ...]} (last 60 days kept).
// archive:true marks games that have their own Archive of past days.
//   - Until each game does that, SMAISLE.isDone() also reads the games' own saved results.
// Days use the device's own date, the same as the games do.
(function(){
  var BASE='https://smaisle.app/';
  var ICONS=BASE+'daily/icons/';
  var GAMES=[
    // Today's Games (daily)
    {id:'d15',name:'The Daily 15',daily:true,archive:true,icon:ICONS+'daily-15.png',sub:'Word grid · new puzzle daily',tag:'Daily word puzzle',
     desc:'Cross 15 words onto a newspaper-style grid. A new puzzle every day, the same for everyone, with stars and streaks.',url:BASE+'DailyGrid/'},
    {id:'abc',name:'A, B, C, Deal',daily:true,archive:true,icon:ICONS+'abc-deal.png',sub:"Beat the dealer's word · 2 modes",tag:'Daily card game',
     desc:"A daily word game played with letter cards. Beat the dealer's word across five hands, in two modes: Classic (5-card poker) and Deal 'Em (Texas hold 'em style).",url:BASE+'abcdeal/'},
    {id:'tk',name:'TRACKulate',daily:true,icon:ICONS+'trackulate.png',sub:'Route the train. Hit the exact count.',tag:'Daily number game',
     desc:'Pick a route through the stops, picking up and dropping off passengers. The crossing only opens for the exact count, and you get three trains.',url:BASE+'Trackulate/'},
    // Plus games: daily games for smAisle Daily Plus members. Everyone can play a free preview (?preview=1).
    // SoliTERMS: website Plus section only for now (Jeff, Nov 7); held back from the app in ios/prepare.py.
    {id:'stm',cat:'word',name:'SoliTERMS',daily:true,plus:true,archive:true,icon:ICONS+'soliterms.png',sub:'Solitaire with words. Clear the table.',tag:'Plus daily game',
     desc:'Seven piles of letter cards, one deal a day, the same for everyone. Spell 4 to 8 letter words from the top cards and the draw pile to clear all seven piles.',url:BASE+'soliterms/'},
    {id:'ld',cat:'word',name:'Ledder',daily:true,plus:true,icon:ICONS+'ledder.png',sub:'Climb the letters. Earn 3 stars.',tag:'Plus daily game',
     desc:'Spell words through eight rows of letters. Each word starts where the last one ended, and reaching the top or bottom sets you free.',url:BASE+'Ledder/word/'},
    {id:'tr',cat:'num',name:'CalcRU-Late',daily:true,plus:true,icon:ICONS+'calcrulate.png',sub:'Set the lever. Arrive on the dot.',tag:'Plus daily game',
     desc:'Five trains a day. Work out the speed or the time you leave, set the lever, and arrive exactly on time.',url:BASE+'Trackulate/timegame/'},
    {id:'mm',cat:'num',name:'GeoCARphy',daily:true,plus:true,archive:true,icon:ICONS+'geocarphy.png',sub:'One road trip a day. Know your map.',tag:'Plus daily game',
     desc:'Pick your roads across the real US map, answer questions in every city, and reach the last stop before your money, gas or time runs out.',url:BASE+'GeoCARphy/'},
    {id:'gr',cat:'word',name:'Gramble',daily:true,plus:true,icon:ICONS+'gramble.png',sub:'Find 10 words with 50 coins',tag:'Plus daily game',
     desc:'A daily word card game. Hold and hit to clear 10 words with 50 coins. Then bank it, or keep going.',url:BASE+'gramble/'},
    {id:'jx',cat:'word',name:'Jexicon',daily:true,plus:true,icon:ICONS+'jexicon.png',sub:'Spell the word from its definition',tag:'Plus daily game',
     desc:'Five definitions on a daily theme. Spell each word one letter at a time. One wrong letter ends the card.',url:BASE+'Jexicon/'},
    {id:'cs',cat:'word',name:'Capital Ship',daily:true,plus:true,icon:ICONS+'capital-ship.png',sub:'Find and capture 5 hidden words',tag:'Plus daily game',
     desc:'Five hidden words on an 8x8 board. Call letters, use sonar and capture every word.',url:BASE+'CapitalShip/'},
    {id:'bw',cat:'word',name:'Blipword',daily:true,plus:true,icon:ICONS+'blipword.png',sub:'A word flashes. Pick its meaning.',tag:'Plus daily game',
     desc:'Ten words a day, each flashing faster than the last. Pick the right definition.',url:BASE+'Blipword/'},
    {id:'md',cat:'brain',name:'Miss Direction',daily:true,plus:true,archive:true,icon:ICONS+'miss-direction.png?v=2',sub:'Watch the arrows. Fill the row.',tag:'Plus daily game',
     desc:'Colored arrows flash one at a time. Remember the color and the direction, then fill the row. Ten rounds a day, and three wrong answers end your game.',url:BASE+'Missdirection/'},
    {id:'rg',cat:'brain',name:'smAisle Run',daily:true,plus:true,icon:ICONS+'smaisle-run.png?v=2',sub:'Remember the list. Route your cart.',tag:'Plus daily game',
     desc:'Study 8 items, then route your cart through the aisles in order. Three rounds, less time to study each round, and two carts a round.',url:BASE+'AisleRunGame/'},
    // Apps on the App Store (appStore is filled in once each app is live)
    {id:'sd',name:'Straight Down',store:true,appStore:'',icon:ICONS+'straight-down.png',tag:'Arcade',sub:'Falling-card poker game',
     desc:'Cards fall one at a time. Line them up in a row or column to make poker hands. An invite code unlocks the full version, with levels, a daily challenge, bombs and wild cards.',url:BASE+'StraightDown/',
     // smAisle Daily is invite only, so the hub opens the full version (Straight Down Blast) and passes this device's invite code.
     fullUrl:BASE+'StraightDown/full.html'},
    {id:'sb',name:'Shuffle Blast',store:true,appStore:'',icon:ICONS+'shuffle-blast.png',tag:'Puzzle',sub:'Block puzzle with endless levels',
     desc:'Drop blocks to clear lines. Play an endless Journey of levels with bombs, rubble and quakes, plus a new daily level every day.',url:BASE+'ShuffleBlast/'},
    // Play on the web
    {id:'br',name:'Bullseye Roulette',icon:ICONS+'bullseye-roulette.png',tag:'Darts',sub:'Darts on a spinning roulette wheel',
     desc:'Bet red or black, spin the wheel, then throw darts to count down from 301. Play solo, against the computer or with a friend, with Normal, Hard, Daily and Blackout modes.',url:BASE+'BullseyeRoulette/'},
    {id:'cn',name:'Connello',icon:ICONS+'connello.png',tag:'Strategy',sub:'Drop-four game with flips',
     desc:"Drop chips to make four in a row, and trap your opponent's chips to flip them to your color. Play Classic or Bank, against the computer or a friend.",url:BASE+'Connello/'}
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
    // A, B, C, Deal's two modes, each finished or not: [Classic, Deal 'Em]. The home screen shows "1 OF 2" when a player who can play both has done one (Jeff, Nov 6).
    modes:function(id,day){
      if(id!=='abc') return null; day=day||dayKey(); var s=shared()[day]||[];
      return ['abc-','abch-'].map(function(p,i){
        if(s.indexOf(i?'abch':'abc')>=0) return true;
        try{ var h=json(p+'hist'); if(h&&h[day]&&String(h[day].r||'').length>=5) return true;
        var k=json(p+'day8'); return !!k&&k.date===day&&(k.hands||[]).filter(function(x){return x&&x.done;}).length>=5; }catch(e){ return false; }
      });
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
