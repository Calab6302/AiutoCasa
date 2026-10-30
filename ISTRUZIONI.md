# Come mettere online AiutoCasa — guida completa

Dominio: **aiutocasamilano.it** (già comprato su Aruba)
Obiettivo: sito con AI funzionante, collegato al tuo dominio.

Segui i passi **nell'ordine**. Non serve saper programmare.
Se ti blocchi a un passo, torna da Claude e di' a che punto sei e cosa vedi.

---

## COSA TI SERVE (prima di iniziare)
1. Account **Vercel** (gratuito) → vercel.com
2. La tua **chiave API di Claude** → da console.anthropic.com → sezione "API Keys"
   ⚠️ Si paga a consumo, ma pochissimo (frazioni di centesimo a diagnosi). Per i test è trascurabile.
3. Il tuo accesso ad **Aruba** (dove hai comprato il dominio)
4. Il numero **WhatsApp** dedicato (quando ce l'hai — per ora si pubblica con un segnaposto)

---

## PASSO 1 — Carica la cartella su GitHub (il modo che Vercel preferisce)
È il metodo più stabile. Se non hai GitHub, crea un account gratis su github.com.

1. Su github.com: in alto a destra "+" → "New repository".
2. Nome: `aiutocasa` · lascia "Public" o "Private" (indifferente) · "Create repository".
3. Nella pagina del repo vuoto, clicca "uploading an existing file".
4. Trascina TUTTO il contenuto della cartella `aiutocasa-sito`
   (i file `index.html`, `package.json`, e la cartella `api` con dentro `diagnosi.js`).
5. In basso "Commit changes".

---

## PASSO 2 — Collega Vercel al repository
1. Vai su **vercel.com** → accedi (puoi usare "Continue with GitHub").
2. "Add New..." → "Project".
3. Trovi il repo `aiutocasa` → "Import".
4. Lascia tutto come propone Vercel → "Deploy".
5. Aspetta 1 minuto. Vercel ti dà un link tipo `aiutocasa-xxx.vercel.app`.
   (Non funziona ancora l'AI: manca la chiave. Passo 3.)

---

## PASSO 3 — Inserisci la chiave API (fondamentale per la sicurezza)
1. Nel progetto su Vercel: **Settings** → **Environment Variables**.
2. Aggiungi:
   - Name: `ANTHROPIC_API_KEY`
   - Value: la tua chiave (incollala qui, SOLO qui)
3. "Save".
4. Vai su **Deployments** → sul deploy più recente, menu "..." → **Redeploy**.

⚠️ La chiave va SOLO nel pannello di Vercel, MAI dentro il codice o in chat. Così resta segreta.

Ora prova il link `.vercel.app`: scrivi un problema nella diagnosi. Se risponde l'AI, funziona.

---

## PASSO 4 — Collega il dominio aiutocasamilano.it
### 4a. Aggiungi il dominio su Vercel
1. Nel progetto Vercel: **Settings** → **Domains**.
2. Scrivi `aiutocasamilano.it` → "Add".
3. Vercel ti mostra dei valori DNS da copiare. Di solito:
   - un record di tipo **A** per `aiutocasamilano.it` che punta a un indirizzo IP (es. `76.76.21.21`)
   - un record **CNAME** per `www` che punta a `cname.vercel-dns.com`
   (Vercel ti dà i valori esatti: usa quelli che vedi sullo schermo, non questi di esempio.)

### 4b. Inserisci i valori su Aruba
1. Entra in **Aruba** → area clienti → il tuo dominio `aiutocasamilano.it`.
2. Cerca "Gestione DNS" / "Record DNS" / "DNS e Nameserver".
3. Inserisci i record che Vercel ti ha dato (il record A e il CNAME www).
   - Se Aruba ha già record A preimpostati verso il parcheggio Aruba, sostituiscili con quelli di Vercel.
4. Salva.

### 4c. Aspetta
La propagazione DNS può volere da pochi minuti a qualche ora (a volte fino a 24-48h, ma di solito molto meno).
Quando è pronta, Vercel in Settings → Domains segna il dominio con la spunta verde, e
`https://aiutocasamilano.it` mostra il tuo sito con l'AI.

---

## PASSO 5 — Metti il numero WhatsApp (quando ce l'hai)
Per ora il sito è pubblicato con un segnaposto. Quando hai il numero dedicato:
1. Apri `index.html` (su GitHub: clicca il file → l'icona matita "Edit").
2. Cerca `39XXXXXXXXXX` e sostituiscila col tuo numero in formato internazionale senza il "+".
   Esempio: numero 333 123 4567 → scrivi `393331234567`.
3. "Commit changes". Vercel rifà il deploy da solo in automatico.

---

## NOTA SUI COSTI
Ogni diagnosi = una chiamata all'AI = frazioni di centesimo. Per i test è trascurabile.
Quando avrai volume vero, si può mettere un limite o valutare i costi — ne parliamo quando serve.

## SE TI BLOCCHI
Torna da Claude, di' esattamente a che passo sei (1, 2, 3, 4a...) e cosa vedi sullo schermo.
Ti sblocco passo per passo.
