let customersList = [];

async function fetchCustomers() {
  try {
    customersList = await api.get('/api/customers');
    renderCustomers();
    updateDashboardKPIs(loadsList, customersList.length, carriersList.length);
  } catch (err) {
    console.error('Error fetching customers:', err);
  }
}

function renderCustomers() {
  const q = (document.getElementById('customerSearchInput')?.value || '').toLowerCase();
  const filtered = customersList.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.contact_name && c.contact_name.toLowerCase().includes(q))
  );
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">No customers found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr class="border-b hover:bg-slate-50 transition">
      <td class="px-4 py-3 font-bold text-slate-900">${c.name}</td>
      <td class="py-3 text-slate-700">${c.contact_name || '-'}</td>
      <td class="py-3 font-mono text-slate-600">${c.phone || '-'}</td>
      <td class="py-3 text-blue-600">${c.email || '-'}</td>
      <td class="py-3"><span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">${c.payment_terms || 'Net 30'}</span></td>
      <td class="py-3 font-mono font-bold text-slate-800">$${Number(c.credit_limit || 0).toLocaleString()}</td>
      <td class="px-4 py-3 text-right">
        <button onclick="deleteCustomer(${c.id})" class="text-red-500 hover:text-red-700 font-bold">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function handleSaveCustomer(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('custName').value,
    contact_name: document.getElementById('custContact').value,
    phone: document.getElementById('custPhone').value,
    email: document.getElementById('custEmail').value,
    credit_limit: parseFloat(document.getElementById('custCredit').value) || 0,
    payment_terms: document.getElementById('custTerms').value,
    address: document.getElementById('custAddress').value
  };

  try {
    await api.post('/api/customers', payload);
    closeCustomerModal();
    e.target.reset();
    fetchCustomers();
  } catch (err) {
    alert('Error saving customer: ' + err.message);
  }
}

async function deleteCustomer(id) {
  if (!confirm('Are you sure you want to delete this customer?')) return;
  try {
    await api.delete(`/api/customers/${id}`);
    fetchCustomers();
  } catch (err) {
    alert('Error deleting customer: ' + err.message);
  }
}

function openCustomerModal() {
  const modal = document.getElementById('customerModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCustomerModal() {
  const modal = document.getElementById('customerModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}