const table = document.getElementById("userTable");

users.forEach(u => {
  table.innerHTML += `
    <tr class="border-b border-gray-700 hover:bg-gray-800">
      <td class="p-3">${u.pseudo}</td>
      <td class="p-3">${u.msgDeleted}</td>
      <td class="p-3">${u.timeouts}</td>
      <td class="p-3">${u.banDef ? "Oui" : "Non"}</td>
      <td class="p-3">
        <a href="user.html?id=${u.id}" class="text-blue-400 hover:underline">Voir</a>
      </td>
    </tr>
  `;
});
