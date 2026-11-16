# Miljonimäng

## Projekti kirjeldus

Miljonimäng on veebirakendus, mis aitab kontrollida kasutaja arusaama ülesande lahendusest. Rakendus jäljendab "Kes tahab saada miljonäriks?" mängu formaati - kasutajale esitatakse 15 valikvastustega küsimust, mille vastamise eest saab punkte.

See on täielikult staatiline rakendus, mis töötab GitHub Pages-is ilma serverita. Kuna tehisintellekti (AI) kasutamine GitHub Pages-is ei ole võimalik, genereeritakse küsimused eelnevalt ja need vahelduvad iga mängu kord.

## Kasutatud tehnoloogiad

- **HTML5** - Struktuur ja sisu
- **CSS3** - Stiilid ja Miljonimängu teema
- **Vanilla JavaScript (ES6+)** - Kogu loogika, mängu juhtimine, küsimuste laadimine
- **LocalStorage** - Mängu oleku hoidmiseks (tulevikus)

## Käivitamise juhend

Kuna tegu on staatilise veebirakendusega, ei ole vaja serverit:

1. Laadi failid GitHub-i repositooriumisse
2. Sea sisse GitHub Pages (Settings → Pages → Source: main branch)
3. Rakendus on kättesaadav aadressil: `https://[kasutajanimi].github.io/[repo-nimi]/`

Kohaliku arenduse jaoks:
1. Ava `index.html` brauseris topelt (kaheklik klikk)
2. Või kasuta kohaliku serverit: `python3 -m http.server 8000`

## Input-kausta struktuur

```
input/
  001/
    assignment.md      # Ülesande püstitus, nõuded, hindamiskriteeriumid
    index.html         # Lahenduse HTML
    style.css           # Lahenduse CSS
    script.js           # Lahenduse JavaScript
  002/
    assignment.md
    index.html
    style.css
    script.js
    data.json
  003/
    assignment.md
    index.html
    style.css
    script.js
```

## AI küsimuste genereerimise loogika

Kuna rakendus töötab GitHub Pages-is (staatiline), kasutatakse eelnevalt genereeritud küsimustepanku.

### Küsimuste struktuur (questions/*.json)

```json
[
  {
    "level": 1,                  // Raskusaste (1-15)
    "question": "Küsimuse tekst",
    "options": ["Vastus A", "Vastus B", "Vastus C", "Vastus D"],
    "correctIndex": 1,           // Õige vastuse indeks (0-3)
    "hint": "Vihje küsiks",      // Lifeline jaoks
    "explanations": [             // Selgitus KÕIGELE valikule
      "Vale: ...",              // Selgitus valikule A
      "Õige: ...",             // Selgitus valikule B (õige)
      "Vale: ...",              // Selgitus valikule C
      "Vale: ..."               // Selgitus valikule D
    ]
  }
]
```

### Küsimuste genereerimise põhimõtted

1. **Mitte flukeerimine**: Valikvastused peavad olema üksteisele väga sarnased, et õige vastus ei selgu loogikaga, vaid nõuab teadmisi
2. **Selgitused**: Iga küsimuse juures on 4 selgitust (iga valiku kohta), mis kuvatakse pärast vastamist
3. **Raskusastmed**:
   - 1-5: Lihtsad (põhimõisted, üldine arusaam)
   - 6-10: Keskmised (sisemine loogika, koodi töö)
   - 11-15: Rasked (sügavam arusaam, turvalisus, arhitektuur)
4. **Vaheldumine**: Iga mängu kord valitakse 15 küsimust 50+ küsimuse pankadest juhuslikult

## Mängu reeglid

### Tulemusskaala
- Küsimus 1: 100 punkti
- Küsimus 2: 200 punkti
- Küsimus 3: 300 punkti
- Küsimus 4: 500 punkti
- Küsimus 5: 1 000 punkti ★ (turvataseme)
- Küsimus 6: 2 000 punkti
- Küsimus 7: 4 000 punkti
- Küsimus 8: 8 000 punkti
- Küsimus 9: 16 000 punkti
- Küsimus 10: 32 000 punkti ★ (turvataseme)
- Küsimus 11: 64 000 punkti
- Küsimus 12: 125 000 punkti
- Küsimus 13: 250 000 punkti
- Küsimus 14: 500 000 punkti
- Küsimus 15: 1 000 000 punkti ★ (JACKPOT!)

### Turvatasemed (Safe Havens)
Kui vastad valesti, langeb tulemus viimase saavutatud turvatasemeni:
- **1 000 punkti** (pärast küsimust 5)
- **32 000 punkti** (pärast küsimust 10)
- **1 000 000 punkti** (mängu võitmine)

### Õlekõred (Lifelines)
1. **50:50** - Eemaldatakse 2 valet vastust
2. **Vihje** - Kuvatakse eelnevalt kirjutatud vihje
3. **Küsi publikult** - Simuleeritud publikuhääletus (ei ole alati 100% õige)

## Teadaolevad piirangud

- **Ei ole AI-d reaalajas**: Küsimused on eelnevalt genereeritud ja staatiliselt salvestatud
- **Ei ole serverit**: Kõik töötab brauseris, ei ole andmebaasi ühendust
- **Ei ole kasutajakontod**: Mäng on täiesti anonymne
- **LocalStorage piirang**: Andmed on piiratud brauseri ja seadmega

## Edasiarenduse võimalused

- **PWA (Progressive Web App)** - Service Workeri lisamine offline töö jaoks
- **TypeScript** - Tüübikindluse parandamiseks
- **React/Vue** - Komponendipõhine lähenemine
- **Serveripoolne versioon** - AI integratsioon reaalajas küsimuste genereerimiseks
- **Mitme keele tugi** - i18n rakendamine
- **Mitme mängija režiim** - Sünkroonne mäng kaaslastega
- **Ühiktestid** - Testimine (Jest, Vitest)

## Projekti struktuur

```
TheMillionGame/
├── index.html              # Peamine HTML fail
├── css/
│   └── style.css           # Miljonimängu stiilid
├── js/
│   ├── app.js             # Põhiloogika ja路由
│   ├── game.js            # Mängu mootor (skoor, lifelines, safe havens)
│   ├── questions.js       # Küsimuste laadimine ja valimine
│   └── tasks.js          # Ülesannete nimekirja lugemine
├── input/
│   ├── 001/              # JavaScripti kalkulaator
│   │   ├── assignment.md
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   ├── 002/              # JSON-andmete kuvamine
│   │   ├── assignment.md
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── data.json
│   └── 003/              # To-do list localStorage'iga
│       ├── assignment.md
│       ├── index.html
│       ├── style.css
│       └── script.js
├── questions/
│   ├── 001.json          # 50+ küsimust kalkulaatori jaoks (Estonian)
│   ├── 002.json          # 50+ küsimust JSON-i jaoks (Estonian)
│   └── 003.json          # 50+ küsimust to-do listi jaoks (Estonian)
├── tasks.json             # Ülesannete manifest
└── README.md
```

## Lisainfo

- **Küsimuste arv**: Iga mängu jaoks on 50+ eelnevalt genereeritud küsimust
- **Keel**: Kõik kasutajaliidese tekstid, küsimused ja selgitused on eesti keeles
- **Result Screen**: Pärast vastamist ei kao ekraan enne, kui kasutaja vajutab "Järgmine küsimus" nuppu
- **Selgitused**: Iga küsimuse puhul kuvatakse selgitus KÕIGELE 4-le valikule (miks iga on õige või vale)
