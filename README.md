# Miljonimäng — Kriit 306

Staatiline eestikeelne teadmistekontroll ülesande lähtekoodi kohta. Valitakse 15 küsimust: viis lihtsat, viis keskmist ja viis rasket. Vastuse järel näidatakse iga valiku selgitust. Kolm ühekordset õlekõrt: 50:50, vihje ja simuleeritud publik. Teenitud summa erineb järgmise küsimuse väärtusest; eksimisel jääb viimane saavutatud turvatase.

## Käivitamine

Node.js on vajalik manifesti koostamiseks ja testideks; Python 3 kohalikuks failiserveriks.

```sh
npm run build
npm test
npm start
```

Ava http://localhost:8080. Otse file:// avamine ei tööta, sest rakendus laadib faile fetch-iga. GitHub Pages sobib pärast avaldamist staatiliseks majutuseks; avaldamist pole selles sessioonis tehtud.

## Ülesannete lisamine ja küsimuste allikas

Lisa numbriline alamkaust `input/` alla, sinna `assignment.md` ja vähemalt üks lahendusfail. `npm run build` leiab ka lünkadega nummerduse ning kirjutab manifesti. Manifest hõlmab lahenduse tekstifaile; binaarfailid, sõltuvused, sümbollingid ja liiga suured failid jäetakse välja või lükatakse tagasi. Seejärel lisa vastav kontrollitud küsimustepank `questions/ID.json` alla.

`js/provider.js` on selgelt märgistatud simulatsioon. Selle sisend sisaldab ülesande kirjeldust JA manifestis olevaid lahendusfaile ning kontrollitud küsimustepanka. See ei saada päringuid päris keelemudelile ega väida, et loob uusi küsimusi. Mudeli ühendamise leping ja viip on failis `prompts/question-generation.md`. Staatiline majutus ei keela iseenesest AI kasutamist, kuid salajast teenusevõtit ei tohi avalikku brauserikoodi panna.

## Tööjärg ja valmiskriteerium

[Kanban ja kasutajalood](planning.html) sisaldavad vastuvõtukriteeriume ning punkte. Oleku muutmine salvestub selle brauseri localStorage'i. See on kohalik töölaud, mitte tõend varasemast meeskonnatööst ega avalik koostöökeskkond.

Lugu on valmis, kui vastuvõtukriteeriumid on täidetud, asjakohased testid läbivad, kood on üle vaadatud ning kasutaja töövoog brauseris läbi proovitud. Seni jäävad brauserikontrolli vajavad lood ülevaatusse.

## Kontroll 16.11.2026

`npm run build`: kolm näidisülesannet. `npm test`: viis regressioonitesti (raskusjaotus, skoor, publikuprotsendid, kontekstifailid, küsimuste valideerimine). JavaScripti süntaks kontrollitud. Täielik brauserimäng, heli ja mobiilipaigutus vajavad veel tegelikku läbimängu. Taastatud algfailide esimene commit on ausalt märgistatud snapshot'ina; see ei taasta puuduvat varasemat arenduslugu.
