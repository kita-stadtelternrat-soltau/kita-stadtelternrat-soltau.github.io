# Webseite Kita-Stadtelternrat Soltau

Reines HTML, CSS und JavaScript. Kein Baukasten, kein Bauschritt, keine
fremden Dienste: Schriften und Bilder liegen hier im Ordner, es gibt keine
Cookies und kein Tracking.

```
index.html                    Startseite (alle Bereiche auf einer Seite)
neuigkeiten/index.html        Alle Beiträge, nach Jahren
neuigkeiten/*.html            die Beiträge
impressum.html, datenschutz.html
404.html                      Fehlerseite, leitet alte Wix-Adressen weiter
css/stil.css                  Aussehen und Bewegung
js/bewegung.js                was sich beim Scrollen und mit der Maus bewegt
schriften/, bilder/
.nojekyll                     sagt GitHub, dass es die Dateien so lassen soll
robots.txt                    hält Suchmaschinen fern, solange nur die Testadresse läuft
```

Lokal ansehen:

```bash
python -m http.server 4320 --directory webseite
```

Dann <http://localhost:4320> öffnen.

---

## Der Umzug von Wix, Schritt für Schritt

Stand Oktober 2026: Die Seite liegt bei Wix, die Domain auch (die Nameserver
sind `ns4.wixdns.net` und `ns5.wixdns.net`). E-Mail läuft über Gmail und hat
mit der Domain nichts zu tun, es gibt keine Mail-Einträge auf der Domain.

### 1 · In Wix nachsehen und sichern (sofort)

- **Abos → Premium-Paket:** Welches Paket, bis wann bezahlt? Die
  *automatische Verlängerung ausschalten*, damit nicht noch ein Jahr abgebucht wird.
- **Domains:** Bis wann läuft die Domain, und an welche E-Mail-Adresse gehen
  die Mails zur Domain? Dorthin kommt später der Code für den Umzug.
  **Die Verlängerung der Domain anlassen**, bis der Umzug durch ist: Eine .de-Domain
  hat bei Wix keine Nachfrist. Läuft sie ab, ist sie weg.
- **Daten sichern und dann löschen:** die Gästeliste der Veranstaltung
  „Vollversammlung 2026“ und die Nachrichten aus dem Kontaktformular, falls ihr
  davon noch etwas braucht. Danach bei Wix löschen.

### 2 · Die neue Seite auf GitHub (vor dem Domain-Umzug)

GitHub Pages ist kostenlos. Alles im Repository ist **öffentlich sichtbar**.
Darum nur den Inhalt dieses Ordners `webseite` hochladen, nie den ganzen Ordner
`elternrat`: Da liegen Anwesenheitslisten und Namen drin.

1. **Ein GitHub-Konto für den Stadtelternrat anlegen**, mit
   kita.ster.soltau@gmail.com und Zwei-Faktor-Anmeldung. Nicht mit einem privaten
   Konto, damit die Seite nicht an einer Person hängt.
2. **Neues öffentliches Repository** mit dem Namen `kita-stadtelternrat-soltau.github.io`
   (vorne steht der Name des Kontos). Mit genau diesem Namen liegt die Seite
   gleich ganz oben in der Adresse, und alle Pfade stimmen.
3. **Den Inhalt dieses Ordners hochladen**: im Repository auf *Add file →
   Upload files*, alle Dateien und Ordner hineinziehen, *Commit changes*.
4. **Settings → Pages**: *Deploy from a branch*, Branch `main`, Ordner `/ (root)`.
   Nach ein, zwei Minuten läuft die Seite unter `https://kita-stadtelternrat-soltau.github.io`.

### 3 · Die Domain zu einem neuen Anbieter umziehen

GitHub verkauft keine Domains. Die Domain liegt bei einem Domainanbieter,
GitHub zeigt nur die Seite an.

1. **Anbieter wählen.** Eine .de-Domain kostet bei günstigen Anbietern wie INWX
   um 5 Euro im Jahr, bei Strato, IONOS oder OVH nach dem ersten Jahr 12 bis 16 Euro.
   Ein Webhosting-Paket braucht ihr nicht, nur die Domain mit DNS-Verwaltung.
   Inhaber und Rechnung vorher mit der Stadt klären.
2. **Bei Wix den Code holen:** *Domains → Domain-Aktionen (⋯) → Von Wix
   wegtransferieren → Domain transferieren*. Wix schickt den Code an die
   Kontakt-Adresse der Domain.
3. **Beim neuen Anbieter den Umzug bestellen** und den Code eingeben. Bei .de
   geht das meist in Stunden, Wix nennt bis zu 7 Tage. Ab dann zeigt die Domain
   nicht mehr auf die Wix-Seite.

### 4 · Die Domain mit GitHub verbinden

GitHub empfiehlt diese Reihenfolge, damit niemand anderes die Domain für seine
Seite benutzen kann:

1. **Domain bestätigen:** Im Konto unter *Settings → Pages → Add a domain*
   eintragen. GitHub nennt einen TXT-Eintrag, den beim neuen Anbieter setzen,
   dann *Verify*.
2. **Im Repository unter Settings → Pages → Custom domain**
   `kita-stadtelternrat-soltau.de` eintragen.
3. **Beim neuen Anbieter die DNS-Einträge setzen** (keine Einträge mit `*`):

   | Typ | Name | Wert |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |
   | CNAME | www | kita-stadtelternrat-soltau.github.io |

4. **Enforce HTTPS** anhaken, sobald GitHub es anbietet. Das Zertifikat ist
   kostenlos und kommt von allein, das kann ein paar Stunden dauern.
5. **`robots.txt` löschen**, damit Google die Seite unter der Domain findet.

### 5 · Wix auslaufen lassen

Erst wenn die Seite unter der Domain läuft. Das Wix-Konto selbst nicht vor dem
Umzug der Domain löschen.

---

## Alte Adressen

Links auf die alte Seite (`/ueber-uns`, `/kontakt`, `/team-2-1`, die beiden
Beiträge unter `/post/…`) landen auf der Fehlerseite. Die leitet sofort an die
passende Stelle weiter. Die Liste steht oben in `404.html`.

## Noch offen

- **Datenschutzerklärung** ist neu geschrieben, passend zu GitHub Pages. Bitte
  von jemandem prüfen lassen, der sich damit auskennt.
- **Kontaktformular** gibt es nicht mehr, nur E-Mail und Telefon. Ein
  Formular ginge über einen fremden Dienst, der dann in den Datenschutz müsste.
- **Neue Beiträge**: Im Moment eine Beitragsseite kopieren und den Text
  tauschen. Dazu oben auf `neuigkeiten/index.html` einen Eintrag und auf der
  Startseite eine Karte, dort stehen immer die drei neuesten. Das lässt sich so umbauen,
  dass ein neuer Beitrag eine einfache Textdatei ist, die man direkt auf
  GitHub schreibt, auch vom Handy.
- **Termine** stehen fest in `index.html` (Abschnitt `termine`). Der Zähler
  „Tage noch“ rechnet selbst und verschwindet, wenn der Termin vorbei ist.
- **Kita-Liste** (Abschnitt `kitas`): Telefon und E-Mail so, wie die Stadt sie
  auf soltau.de zeigt. Ändert sich etwas, in `bau/webseite-probe/kitas.py`
  eintragen und `python kitas.py` laufen lassen. Bei der Luther-Kita nennt die
  Stadt dieselbe E-Mail-Adresse wie bei St. Johannis.
