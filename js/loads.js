let loadsList = [];

async function fetchLoads() {
  try {
    loadsList = await api.get('/api/loads');
    renderLoadBoard(loadsList);
    updateDashboardKPIs(loadsList, customersList.length, carriersList.length);
  } catch (err) {
    console.error('Error fetching loads:', err);
    document.getElementById('loadboard-table-body').innerHTML = `
      <tr><td colspan="8" class="text-center py-6 text-red-500 font-semibold">Error loading loads from backend.</td></tr>`;
  }
}

function renderLoadBoard(items = loadsList) {
  const tbody = document.getElementById('loadboard-table-body');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">No loads found.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(l => `
    <tr class="border-b hover:bg-slate-50 transition">
      <td class="px-4 py-3 font-bold text-blue-600 font-mono">DO-${l.do_number || l.id}</td>
      <td class="py-3 font-medium text-slate-600">${l.assigned_to || '-'}</td>
      <td class="py-3 font-mono font-semibold text-slate-900">${l.container_number || '-'}</td>
      <td class="py-3 uppercase text-[11px] font-semibold text-slate-500">${l.cargo_type || 'IMPORT'}</td>
      <td class="py-3 font-semibold text-slate-800">${l.customer_name || '-'}</td>
      <td class="py-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">${l.status || 'Find Carrier'}</span></td>
      <td class="py-3 font-mono font-bold text-emerald-700">$${Number(l.total_rate || 0).toFixed(2)}</td>
      <td class="px-4 py-3 text-right">
        <button onclick="alert('Viewing DO #' + '${l.do_number || l.id}')" class="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded font-semibold text-slate-700 transition">View</button>
      </td>
    </tr>
  `).join('');
}

function filterLoads() {
  const query = (document.getElementById('loadSearchInput').value || '').toLowerCase();
  const filtered = loadsList.filter(l =>
    (l.container_number && l.container_number.toLowerCase().includes(query)) ||
    (l.customer_name && l.customer_name.toLowerCase().includes(query)) ||
    (l.do_number && l.do_number.toString().toLowerCase().includes(query)) ||
    (l.status && l.status.toLowerCase().includes(query))
  );
  renderLoadBoard(filtered);
}

async function handleSaveLoad(e) {
  e.preventDefault();
  const btn = document.getElementById('saveBtn');
  btn.disabled = true;
  btn.innerText = 'Saving...';

  const payload = {
    do_number: document.getElementById('formDoNumber').value,
    customer_name: document.getElementById('formCustomer').value,
    container_number: document.getElementById('formContainer').value.toUpperCase(),
    container_size: document.getElementById('formSize').value,
    assigned_to: document.getElementById('formAssigned').value || 'Aleem',
    cargo_type: document.getElementById('formCargoType').value,
    pickup_terminal: document.getElementById('formPickup').value,
    delivery_consignee: document.getElementById('formDelivery').value,
    status: document.getElementById('formStatus').value,
    total_rate: parseFloat(document.getElementById('formRate').value) || 0
  };

  try {
    await api.post('/api/loads', payload);
    e.target.reset();
    await fetchLoads();
    switchTab('loadboard');
  } catch (err) {
    alert('Error saving load: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerText = 'Save & Dispatch';
  }
}