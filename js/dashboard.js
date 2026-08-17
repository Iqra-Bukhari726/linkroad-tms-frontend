function updateDashboardKPIs(loads, customerCount, carrierCount) {
  const totalLoadsEl = document.getElementById('kpiTotalLoads');
  const findCarrierEl = document.getElementById('kpiFindCarrier');
  const completedEl = document.getElementById('kpiCompleted');
  const revenueEl = document.getElementById('kpiRevenue');
  const custCountEl = document.getElementById('kpiCustomerCount');
  const carrCountEl = document.getElementById('kpiCarrierCount');

  if (totalLoadsEl) totalLoadsEl.innerText = loads.length;
  if (findCarrierEl) findCarrierEl.innerText = loads.filter(l => l.status === 'Find Carrier').length;
  if (completedEl) completedEl.innerText = loads.filter(l => l.status === 'Completed').length;
  if (custCountEl) custCountEl.innerText = customerCount;
  if (carrCountEl) carrCountEl.innerText = carrierCount;

  if (revenueEl) {
    const totalRev = loads.reduce((sum, l) => sum + Number(l.total_rate || 0), 0);
    revenueEl.innerText = '$' + totalRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

function initDashboardCharts() {
  const trendCanvas = document.getElementById('weeklyTrendChart');
  const donutCanvas = document.getElementById('statusDonutChart');

  if (trendCanvas) {
    new Chart(trendCanvas, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{ data: [14, 25, 18, 25, 23, 11], backgroundColor: '#3b82f6' }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (donutCanvas) {
    new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Transit', 'Pending'],
        datasets: [{ data: [45, 30, 25], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}