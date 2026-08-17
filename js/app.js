function switchTab(t) {
  ['dashboard', 'loadboard', 'addload', 'customers', 'carriers', 'invoices', 'users', 'reports'].forEach(id => {
    const el = document.getElementById('tab-' + id);
    const nav = document.getElementById('nav-' + id);
    if (el) el.classList.toggle('hidden', id !== t);
    if (nav) {
      nav.className = (id === t)
        ? 'w-full flex items-center px-4 py-3 rounded-lg text-white bg-[#3b82f6] font-semibold transition'
        : 'w-full flex items-center px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition';
    }
  });

  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) pageTitle.innerText = t.toUpperCase();

  if (t === 'customers') fetchCustomers();
  if (t === 'carriers') fetchCarriers();
  if (t === 'loadboard') fetchLoads();
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  initDashboardCharts();
  fetchLoads();
  fetchCustomers();
  fetchCarriers();
});