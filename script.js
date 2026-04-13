const SUPABASE_URL = "https://lnyzlvnguzubfkekrvig.supabase.co/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxueXpsdm5ndXp1YmZrZWtydmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjQzMzksImV4cCI6MjA5MTYwMDMzOX0.MH3peF-E5BSLwYHG_AeOV2YAnzy0gy3mScIS364KX7A";

async function loadUsers() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/moderation_logs?select=*`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });

  const logs = await res.json();

  const users = {};

  logs.forEach(log => {
    if (!users[log.user_id]) {
      users[log.user_id] = {
        pseudo: log.username,
        msgDeleted: 0,
        timeouts: 0,
        banDef: false
      };
    }

    if (log.type === "delete") users[log.user_id].msgDeleted++;
    if (log.type === "timeout") users[log.user_id].timeouts++;
    if (log.type === "ban") users[log.user_id].banDef = true;
  });

  const table = document.getElementById("userTable");

  Object.values(users).forEach(u => {
    table.innerHTML += `
      <tr class="border-b border-gray-700 hover:bg-gray-800">
        <td class="p-3">${u.pseudo}</td>
        <td class="p-3">${u.msgDeleted}</td>
        <td class="p-3">${u.timeouts}</td>
        <td class="p-3">${u.banDef ? "Oui" : "Non"}</td>
        <td class="p-3">
          <a href="user.html?pseudo=${u.pseudo}" class="text-blue-400 hover:underline">Voir</a>
        </td>
      </tr>
    `;
  });
}

loadUsers();
