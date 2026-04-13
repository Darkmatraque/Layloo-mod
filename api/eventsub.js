export default async function handler(req, res) {
  try {
    // Vérification EventSub (challenge Twitch)
    if (req.headers["twitch-eventsub-message-type"] === "webhook_callback_verification") {
      return res.status(200).send(req.body.challenge);
    }

    // Si Twitch envoie un event normal
    const event = req.body.event;

    // Protection : si pas d'event → éviter crash
    if (!event) {
      return res.status(200).json({ ok: true, info: "No event received" });
    }

    // Envoi dans Supabase
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/moderation_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_KEY}`
      },
      body: JSON.stringify({
        user_id: event.user_id || null,
        username: event.user_name || null,
        type: event.type || "unknown",
        content: event.message || null,
        duration: event.duration || null,
        reason: event.reason || null
      })
    });

    // Vérifier si Supabase a accepté
    if (!response.ok) {
      const error = await response.text();
      console.error("Supabase error:", error);
      return res.status(500).json({ ok: false, error });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
