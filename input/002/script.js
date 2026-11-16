document.addEventListener('DOMContentLoaded', function() {
  const loadBtn = document.getElementById('load-btn');
  const tableBody = document.getElementById('table-body');
  const errorDisplay = document.getElementById('error');

  loadBtn.addEventListener('click', loadData);

  function loadData() {
    errorDisplay.classList.remove('show');
    tableBody.innerHTML = '';

    fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Viga andmete laadimisel');
        }
        return response.json();
      })
      .then(data => {
        renderTable(data);
      })
      .catch(error => {
        showError(error.message);
      });
  }

  function renderTable(data) {
    if (!Array.isArray(data) || data.length === 0) {
      showError('Andmed on tühjad või vigased!');
      return;
    }

    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${escapeHtml(item.nimi || '')}</td>
        <td>${escapeHtml(item.amet || '')}</td>
        <td>${item.vanus || ''}</td>
        <td>${escapeHtml(item.linn || '')}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.classList.add('show');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
