# smaisle.app

The whole smAisle website, served by GitHub Pages at https://smaisle.app (CNAME in this repo).

- Root: the home page (Games, The details, Invite only, privacy, support), formerly the SmAisle/home repo (moved here Nov 1, 2026).
- `daily/`: smAisle Daily, the daily-games hub. `daily/games.js` is the shared games list.
- `gate.js`: the shared invite screen for games in testing.
- `stats.html`: the all-games usage page (owner only).

Because this is the SmAisle user site with a custom domain, every other SmAisle Pages repo is served under it too:
smaisle.app/DailyGrid/, /abcdeal/, /gramble/, /ShuffleBlast/, /StraightDown/, /Connello/, /BullseyeRoulette/.
Old smaisle.github.io links forward to smaisle.app automatically.
