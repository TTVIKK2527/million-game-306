window.Tasks = (() => {
  async function loadTaskList() {
    if (window.location.protocol === 'file:') throw new Error('Ava rakendus HTTP serveri kaudu.');
    const response = await fetch('tasks.json');
    if (!response.ok) throw new Error('Manifest puudub. Käivita npm run build.');
    const manifest = await response.json();
    if (!Array.isArray(manifest.tasks)) throw new Error('Vigane manifest.');
    return manifest.tasks;
  }
  async function loadTaskFiles(taskId) {
    if (!/^\d+$/.test(taskId)) throw new Error('Vigane ülesande ID.');
    const task = (await loadTaskList()).find(task => task.id === taskId);
    if (!task || !Array.isArray(task.files)) throw new Error('Ülesannet ei leitud.');
    const files = {};
    for (const file of task.files) {
      if (typeof file !== 'string' || file.includes('\\') || file.startsWith('/') || file.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Vigane faili tee.');
      const url = 'input/' + taskId + '/' + file.split('/').map(encodeURIComponent).join('/');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ülesande faili ei saanud lugeda: ' + file);
      files[file] = await response.text();
    }
    if (!files['assignment.md'] || Object.keys(files).length < 2) throw new Error('Kirjeldus või lahendus puudub.');
    return files;
  }
  return {loadTaskList, loadTaskFiles};
})();
