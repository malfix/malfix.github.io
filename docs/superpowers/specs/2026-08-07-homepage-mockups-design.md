# Homepage malfix.github.io — dieci direzioni di design

Data: 2026-08-07
Stato: mockup da valutare, `index.html` non ancora toccato

## Problema

`index.html` è una pagina statica di 28 righe che elenca un solo progetto in testo
semplice. Esiste per servire `app-ads.txt` alla radice del dominio (requisito del
crawler AdMob). Va trasformata in una homepage di forte impatto visivo che presenti
Emanuele Malfarà e i suoi progetti — oggi uno solo, domani più di uno.

## Decisioni prese

| Ambito | Decisione |
|---|---|
| Taglio | Personal brand: il protagonista è la persona, i progetti sono la prova |
| Contenuto | Nome, una frase, elenco progetti, contatti. Niente CV, niente manifesto lungo |
| Scalabilità | La lista deve funzionare identica con 1 o con 20 progetti, senza rilavorazione |
| Lingua | Bilingue IT/EN con interruttore |
| Tecnica | Nessun vincolo: JS vanilla, canvas e WebGL ammessi |
| Deliverable | Un unico file con selettore fra le dieci varianti |

## Vincoli invarianti

- `app-ads.txt` resta alla radice e non va toccato: è la ragione d'essere del sito.
- Le pagine legali restano nel repo separato `tattooo-legal`; la homepage vi rimanda.
- Nessuna dipendenza esterna: font di sistema, zero CDN, zero build step.
- Nessun overflow orizzontale a 390 px di larghezza.

## Identità visiva

Ricavata dagli asset reali dell'app anziché inventata:

- Ink `#0e0d10`, lime `#d6f92b`, magenta `#ff2e77` (dall'icona e dagli screenshot)
- Wordmark in corsivo grassetto con evidenziazione lime su una parte del nome,
  eco diretta del logo `tattooo` dell'app
- Ombre nette con offset, senza sfocatura, sul modello dei pulsanti dell'app
- Etichette in monospace maiuscolo con crenatura larga

## Modello dati condiviso

Tutte e dieci le varianti leggono dagli stessi tre oggetti in cima al file:
`COPY` (testi bilingui), `LINKS` (contatti), `TATTOOO` (il progetto, con
screenshot, icona, link App Store, privacy e supporto). Cambiare variante non
comporta riscrivere contenuti; aggiungere un progetto è aggiungere un oggetto.

`FILLER` contiene quattro progetti fittizi, mostrati solo con l'interruttore `×5`,
usati per verificare che ogni layout regga la crescita della lista. Sono
deliberatamente privi di screenshot per collaudare anche il caso "asset mancante".

## Le dieci varianti

### Famiglia raw / neubrutalist

1. **Terminal Roster** — la pagina è un prompt monospace; i progetti sono l'output
   di `ls projects/`, i contatti di `cat contact.txt`, il cambio lingua un comando.
   Scalabile per costruzione: un progetto è una riga.
2. **Flash Sheet** — la pagina è un foglio di flash tattoo, come l'icona dell'app:
   card storte, bordo nero spesso, riempimento lime, ombra magenta. Con un solo
   progetto la card diventa un hero orizzontale che ospita i link reali; da due in
   su torna una griglia di flash.
3. **Console finestrata** — piccolo desktop: ogni progetto è una finestra
   trascinabile con barra del titolo, più una finestra `about.txt`. Un dock in
   basso riapre le finestre chiuse.

### Famiglia editoriale / tipografica

4. **Index di rivista** — sommario editoriale su carta chiara: titolo serif
   oversize, righe numerate, e allo hover lo screenshot che insegue il cursore.
   L'unica variante in chiaro, utile come contrasto.
5. **Departure Board** — tabellone split-flap: le lettere girano all'ingresso e a
   ogni cambio lingua, trasformando l'interruttore IT/EN in un'animazione.
   Colonne №, progetto, piattaforma, anno, stato; su mobile la riga si impila.
6. **Marquee Manifesto** — bande di testo che scorrono a velocità e direzioni
   alternate; le bande progetto sono link e si invertono allo hover. Non richiede
   alcuna immagine.

### Famiglia dark cinematic

7. **Spotlight** — nero profondo, una sola sorgente di luce che insegue il puntatore
   con inerzia e deriva da sola quando nessuno muove il mouse, grana da pellicola,
   tipografia leggera. La più sobria delle dieci.
8. **Stack di carte** — mazzo 3D sfogliabile con trascinamento, rotellina o frecce.
   Con un progetto è una carta sola centrata, che legge come scelta e non come vuoto.

### Famiglia interattiva

9. **Ink Bleed** — shader WebGL a ping-pong su due framebuffer: il puntatore inietta
   inchiostro, che diffonde, si deforma con fBm e sbiadisce. Colori del brand.
   Degrada a un gradiente CSS se WebGL manca o gli shader non compilano.
10. **Skin Reveal** — canvas 2D: il cursore è uno stencil che scopre gli screenshot
    sotto una superficie nera, che si richiude lentamente. È il gesto stesso
    dell'app portato sul sito.

## Architettura del file di confronto

`mockups.html`, un unico file senza dipendenze.

- `#stage` è un contenitore a piena finestra; `#vcss` è l'unico foglio di stile
  delle varianti, sostituito interamente a ogni cambio. Nessuna necessità di
  prefissare i selettori: una sola variante è montata alla volta.
- Ogni variante è un oggetto `{ id, label, fam, css, mount(root, bag) }`.
- `bag()` raccoglie listener, `requestAnimationFrame` e `setInterval` di ciascuna
  variante e li smonta al cambio, così i loop WebGL e canvas non si accumulano.
- Barra in basso: selettore numerato, interruttore lingua, interruttore `×5`,
  pulsante per nascondere la barra. Tastiera: `←` `→` varianti, `1`–`0` diretta,
  `L` lingua, `H` barra.
- Deep link via hash: `#flash/en/x5`.

## Verifica eseguita

Rendering headless in Chrome di tutte e dieci le varianti a 1440×900 e di quattro a
390×844, con movimento del puntatore simulato.

- Nessun errore JavaScript, nessun `pageerror`.
- Nessun overflow orizzontale in nessuna variante, né desktop né mobile.
- Lo shader WebGL compila e disegna anche su SwiftShader (senza GPU).
- `×5` verificato su Flash Sheet, Departure Board, Stack e Index.

## Esito: variante 1 promossa a index.html

Scelta la **1, Terminal Roster**. `index.html` la implementa, con tre scostamenti
deliberati rispetto al mockup:

- **Contenuto statico anziché generato da JavaScript.** Nel file di confronto tutte
  le varianti erano costruite a runtime; la pagina pubblica ha il testo direttamente
  nel markup, con le due lingue negli attributi `data-it` / `data-en`. Funziona a
  JavaScript spento, è indicizzabile e non mostra un istante di pagina vuota.
  Aggiungere un progetto resta banale: si copia il blocco `.row` più le due righe
  che lo seguono.
- **Lingua persistente.** All'apertura vince il parametro `?lang=`, poi la scelta
  salvata in `localStorage`, poi la lingua del browser. Il cambio aggiorna
  `<html lang>`, il titolo e la meta description senza ricaricare.
- **Animazione additiva.** Le tre righe di comando si scrivono da sinistra a destra
  via `clip-path` — non via `width` in `ch`, perché il glifo `➜` non occupa
  esattamente un carattere e troncava la fine dei comandi. Tutto è già nello stato
  finale se l'utente ha `prefers-reduced-motion` o se JavaScript non parte.

Aggiunti inoltre: LinkedIn fra i contatti, favicon SVG inline, tag Open Graph e
`assets/og.png` (1200×630, generata dalla pagina stessa), canonical. I link a
privacy e supporto della vecchia pagina sono conservati sotto il progetto.

Verifica: desktop e mobile, italiano e inglese, con e senza JavaScript — nessun
errore in console, nessun overflow orizzontale, tutti e sette i link presenti,
il toggle cambia lingua, URL e metadati.

## Cosa resta aperto

- Frase di posizionamento e headline sono una prima stesura, da rivedere con calma.
- `mockups.html` resta nel repo come riferimento: è `noindex`, ma può essere
  eliminato una volta che la direzione è consolidata.
- Gli screenshot provengono dalla scheda App Store (900×1948) e sono salvati in
  `assets/tattooo/`; li usa solo `mockups.html`, non la homepage.
