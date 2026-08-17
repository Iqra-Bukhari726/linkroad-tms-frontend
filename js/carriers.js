let carriersList = [];

async function fetchCarriers() {
  try {
    carriersList = await api.get('/api/carriers');
    renderCarriers();
    updateDashboardKPIs(loadsList, customersList.length, carriersList.length);
  } catch (err) {
    console.error('Error fetching carriers:', err);
  }
}

function renderCarriers() {
  const q = (document.getElementById('carrierSearchInput')?.value || '').toLowerCase();
  const filtered = carriersList.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.mc_number.toLowerCase().includes(q)
  );
  const tbody = document.getElementById('carriers-table-body');
  if (!tbody) return;

  const today = new Date().toISOString().split('T')[0];

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">No carriers registered.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const isExpired = c.insurance_expiry < today;
    const expiryBadge = isExpired
      ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">Expired (${c.insurance_expiry})</span>`
      : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">${c.insurance_expiry}</span>`;

    return `
      <tr class="border-b hover:bg-slate-50 transition">
        <td class="px-4 py-3 font-bold text-slate-900">${c.name}</td>
        <td class="py-3 font-mono text-slate-700">${c.mc_number} ${c.dot_number ? '/ ' + c.dot_number : ''}</td>
        <td class="py-3 text-slate-700">${c.contact_name || '-'}</td>
        <td class="py-3 text-slate-600">${c.phone || ''} ${c.email ? '<br>' + c.email : ''}</td>
        <td class="py-3">${expiryBadge}</td>
        <td class="py-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">${c.status}</span></td>
        <td class="px-4 py-3 text-right">
          <button onclick="deleteCarrier(${c.id})" class="text-red-500 hover:text-red-700 font-bold">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function handleSaveCarrier(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('carrName').value,
    mc_number: document.getElementById('carrMC').value,
    dot_number: document.getElementById('carrDOT').value,
    contact_name: document.getElementById('carrContact').value,
    phone: document.getElementById('carrPhone').value,
    email: document.getElementById('carrEmail').value,
    insurance_expiry: document.getElementById('carrExpiry').value,
    status: 'Active'
  };

  try {
    await api.post('/api/carriers', payload);
    closeCarrierModal();
    e.target.reset();
    fetchCarriers();
  } catch (err) {
    alert('Error saving carrier: ' + err.message);
  }
}

async function deleteCarrier(id) {
  if (!confirm('Are you sure you want to delete this carrier?')) return;
  try {
    await api.delete(`/api/carriers/${id}`);
    fetchCarriers();
  } catch (err) {
    alert('Error deleting carrier: ' + err.message);
  }
}

function openCarrierModal() {
  const modal = document.getElementById('carrierModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCarrierModal() {
  const modal = document.getElementById('carrierModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}