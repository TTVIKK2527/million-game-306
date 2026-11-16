# Miljonimäng — Kriit 306

Staatiline eestikeelne teadmistekontroll ülesande lähtekoodi kohta. Valitakse 15 küsimust: viis lihtsat, viis keskmist ja viis rasket. Vastuse järel näidatakse iga valiku selgitust. Kolm ühekordset õlekõrt: 50:50, vihje ja simuleeritud publik. Teenitud summa erineb järgmise küsimuse väärtusest; eksimisel jääb viimane saavutatud turvatase.

## Käivitamine

Node.js on vajalik manifesti koostamiseks ja testideks; Python 3 kohalikuks failiserveriks.

```sh
npm run build
npm test
npm start
```

Ava http://localhost:8080. Otse file:// avamine ei tööta, sest rakendus laadib faile fetch-iga. Avalik repositoorium: https://github.com/TTVIKK2527/million-game-306.
Avalik mäng: https://ttvikk2527.github.io/million-game-306/.
Avalik [Kanban-töölaud](https://ttvikk2527.github.io/million-game-306/planning.html).
16.11.2026 eemaldati konto `toivotulp.me` domeenisuunamine; GitHubi aadress
vastab HTTP 200 ning ülesannete valik on päris brauseris kontrollitud.


## Ülesannete lisamine ja küsimuste allikas

Lisa numbriline alamkaust `input/` alla, sinna `assignment.md` ja vähemalt üks lahendusfail. `npm run build` leiab ka lünkadega nummerduse ning kirjutab manifesti. Manifest hõlmab lahenduse tekstifaile; binaarfailid, sõltuvused, sümbollingid ja liiga suured failid jäetakse välja või lükatakse tagasi. Seejärel lisa vastav kontrollitud küsimustepank `questions/ID.json` alla.

`js/provider.js` simuleerib küsimuste pakkujat. Selle sisend sisaldab ülesande kirjeldust JA manifestis olevaid lahendusfaile ning kontrollitud küsimustepanka. Küsimused tulevad kohalikust pangast; keelemudelit ei kutsuta. Mudeli ühendamise leping ja viip on failis `prompts/question-generation.md`. Staatiline majutus ei keela iseenesest AI kasutamist, kuid salajast teenusevõtit ei tohi avalikku brauserikoodi panna.

## Tööjärg ja valmiskriteerium

[Kanban ja kasutajalood](planning.html) sisaldavad vastuvõtukriteeriume ning punkte. Oleku muutmine salvestub selle brauseri localStorage'i. Töölaua andmeid teiste kasutajatega ei jagata.

Lugu on valmis, kui vastuvõtukriteeriumid on täidetud, asjakohased testid läbivad, kood on üle vaadatud ning kasutaja töövoog brauseris läbi proovitud. Seni jäävad brauserikontrolli vajavad lood ülevaatusse.

## Kontroll 16.11.2026

`npm run build`: kolm näidisülesannet. `npm test`: viis regressioonitesti (raskusjaotus, skoor, publikuprotsendid, kontekstifailid, küsimuste valideerimine). JavaScripti süntaks kontrollitud. Jätkutöös kontrolliti päris brauseris ülesande valikut, õiget vastust,
selgitusi, skoori 0 → 100, valet vastust ja mängu lõppu ning kõiki kolme õlekõrt.
390 px telefonivaate kontroll leidis ja parandas küsimust varjanud pika rahaastmete
loendi ning päise kattumise. Taustamuusika on eemaldatud. Lõpuküsimuse teemalugu on vaikimisi lubatud ja seda saab vaigistada; tegelikku
kõlaritest kostvat heli ja päris telefoni puutežeste ei ole kinnitatud. Taastatud algfailide esimene commit on ausalt märgistatud snapshot'ina; see ei taasta puuduvat varasemat arenduslugu.


## Tehnoloogiad ja piirangud

HTML, CSS ja raamistikuvaba JavaScript brauseris; Node.js standardteek manifesti
koostamiseks ning testimiseks. Küsimuste simulatsioon valib olemasolevast pangast
uue segatud komplekti, mitte ei loo piiramatult uut sisu. Ajapiirang on küsimuse
raskuse järgi 30/45/60 sekundit. Avalik versioon ei saada lähtekoodi välisele AI-le.

## Demo ja kontrolli tõendid

[Arvutivaade](evidence/game.jpg) · [390 px telefonivaate tagasiside](evidence/mobile.jpg).

Demo: vali ülesanne 001, kasuta vihjet või publikut, vasta ühe küsimuse õigesti,
vaata kõigi valikute selgitust ning jätka järgmise küsimuseni (100 punkti).
Vale vastus lõpetab mängu ja näitab saavutatud turvataset; menüüst saab valida
teise ülesande. 50:50 eemaldab kaks valet varianti ja iga õlekõrs töötab üks kord.
Viis regressioonitesti kontrollivad ka 5+5+5 raskusjaotust ja kõigi kontekstifailide lugemist.

## Edasiarendus ja tehniline tagasivaade

Jätkutöö lahendas skoori ning publikuprotsentide vead, eraldas küsimuste pakkuja,
lisas failimanifesti ning parandas tegelikus telefonilaiuse kontrollis leitud paigutuse.
Järgmises iteratsioonis saab lisada serveripoolse AI-pakkuja, tulemuste ajaloo ja
heliga läbimängu päris telefonis. Õppija isiklik tagasivaade ja individuaalne selgitus on veel tegemata.
