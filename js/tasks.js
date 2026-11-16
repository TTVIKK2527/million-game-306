window.Tasks = (() => {
  const TASKS_MANIFEST = 'tasks.json';

  function loadTaskList() {
    return new Promise((resolve) => {
      if (window.location.protocol === 'file:') {
        resolve([]);
        return;
      }

      fetch(TASKS_MANIFEST)
        .then(res => {
          if (!res.ok) throw new Error('Manifesti ei leitud');
          return res.json();
        })
        .then(manifest => resolve(manifest.tasks || []))
        .catch(() => discoverTasks().then(resolve));
    });
  }

  function discoverTasks() {
    return new Promise((resolve) => {
      const tasks = [];
      let i = 1;

      function tryNext() {
        if (i > 20) {
          resolve(tasks);
          return;
        }
        const id = String(i).padStart(3, '0');
        fetch(`input/${id}/assignment.md`)
          .then(res => {
            if (res.ok) {
              return res.text();
            }
            resolve(tasks);
          })
          .then(text => {
            if (text) {
              const title = extractTitle(text) || `Ülesanne ${id}`;
              tasks.push({ id, name: title });
              i++;
              tryNext();
            } else {
              resolve(tasks);
            }
          })
          .catch(() => resolve(tasks));
      }

      tryNext();
    });
  }

  function extractTitle(md) {
    const match = md.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
  }

  function loadTaskFiles(taskId) {
    return new Promise((resolve) => {
      const base = `input/${taskId}/`;
      const files = {};

      fetch(`${base}assignment.md`)
        .then(res => {
          if (res.ok) return res.text();
          return null;
        })
        .then(text => {
          if (text) files['assignment.md'] = text;
          resolve(files);
        })
        .catch(() => resolve(files));
    });
  }

  return { loadTaskList, loadTaskFiles };
})();
