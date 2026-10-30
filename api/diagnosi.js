// Funzione serverless: fa parlare il sito con l'AI di Claude, tenendo la chiave al sicuro.
// La chiave NON è qui nel codice: va messa nelle "Environment Variables" di Vercel/Netlify
// con il nome ANTHROPIC_API_KEY. Così resta segreta e nessuno può vederla.

export default async function handler(req, res) {
  // Accetta solo richieste POST
  if (req.method !== "POST") {
    return res.status(405).json({ errore: "Metodo non consentito" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ errore: "Chiave API non configurata sul server." });
  }

  try {
    const { messaggi } = req.body;
    if (!messaggi || !Array.isArray(messaggi)) {
      return res.status(400).json({ errore: "Richiesta non valida." });
    }

    const sistema = `Sei il cuore diagnostico di "AiutoCasa", servizio milanese che aiuta le persone con i problemi di casa. Ti comporti come un tecnico esperto e gentile: PRIMA capisci, POI concludi. Non smisti mai al volo.

## REGOLA DEL PRIMO TURNO
Se l'ultimo messaggio contiene "[PRIMO TURNO]", NON puoi rispondere con tipo "pro" a meno che non sia un'emergenza chiara e immediata (odore di gas, allagamento in corso, fumo/bruciato, scossa). Per tutto il resto al primo turno DEVI fare una domanda diagnostica ("chiarimento") oppure, se è palesemente un piccolo problema sicuro, dare il "diy".

## COME CONDURRE LA DIAGNOSI
Fai UNA domanda alla volta, con 2-4 opzioni brevi. Puoi farne diverse di seguito finché non hai capito causa e gravità. Dopo 1-3 domande concludi:
- se c'è una soluzione semplice e sicura da fare da soli -> "diy" con i passi;
- se serve competenza, attrezzi o c'è rischio -> "pro".

## TONO
Caldo, rassicurante, dai del tu. Non far mai sentire stupida la persona. Incoraggia se può farcela ("ce la puoi fare benissimo"). Parole semplici.

## MESTIERI (usa ESATTAMENTE una etichetta)
"idraulico","elettricista","imbianchino","impresa di pulizie","impresa di lavanderia","ditta traslochi / sgombero","fabbro / serramenti","generico".
Caldaia/acqua calda/gas -> "idraulico". Lavaggio/stiro capi -> "impresa di lavanderia".

## FASCE DI PREZZO INDICATIVE a Milano (sempre indicative, da confermare)
idraulico: 60-120€ · elettricista: 50-100€ · imbianchino: dipende dai mq, indicativamente 8-15€/mq · impresa di pulizie: 15-25€/ora · impresa di lavanderia: dipende dai capi · ditta traslochi: 200-600€ · fabbro: 80-150€.

## FORMATO: rispondi SOLO con UN oggetto JSON valido, uno di:
{"tipo":"chiarimento","domanda":"...","opzioni":["...","..."]}
{"tipo":"diy","titolo":"...","mestiere_correlato":"<etichetta>","durata":"...","difficolta":"facile|media","attrezzi":["..."],"passi":["...","..."],"quando_fermarsi":"..."}
{"tipo":"pro","mestiere":"<etichetta>","urgenza":"alta|media|bassa","tempo_intervento":"es. 'in giornata' / 'entro 2-3 giorni'","prezzo_indicativo":"es. '60-90€, confermato dal professionista'","cosa_aspettarsi":"...","perche":"...","sicurezza":"<frase se c'è rischio, altrimenti ''>"}`;

    const risposta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        system: sistema,
        messages: messaggi,
      }),
    });

    const dati = await risposta.json();
    let testo = (dati.content || []).map((b) => b.text || "").join("").trim();
    testo = testo.replace(/```json/gi, "").replace(/```/g, "").trim();

    // estrae il primo blocco JSON bilanciato
    const inizio = testo.indexOf("{");
    if (inizio >= 0) {
      let prof = 0, fine = -1;
      for (let i = inizio; i < testo.length; i++) {
        if (testo[i] === "{") prof++;
        else if (testo[i] === "}") { prof--; if (prof === 0) { fine = i; break; } }
      }
      if (fine > inizio) testo = testo.slice(inizio, fine + 1);
    }

    const esito = JSON.parse(testo);
    return res.status(200).json(esito);
  } catch (e) {
    return res.status(500).json({ errore: "Non sono riuscito a leggere il problema.", dettaglio: String(e) });
  }
}
