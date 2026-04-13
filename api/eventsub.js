export default async function handler(req, res) {
  // Vérification EventSub (Twitch challenge)
  if (req.headers["twitch-eventsub-message-type"] === "webhook_callback_verification") {
    return res.status(200).send(req.body.challenge);
  }

  const event = req.body.event;

  // Envoi dans Supabase
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/moderation_logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.SUPABASE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_KEY}`
    },
    body: JSON.stringify({
      user_id: event.user_id,
      username: event.user_name,
      type: event.type,
      content: event.message || null,
      duration: event.duration || null,
      reason: event.reason || null
    })
  });

  res.status(200).json({ ok: true });
}
