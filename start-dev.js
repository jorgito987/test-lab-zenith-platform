
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando desarrollo con frontend y backend...\n');

// Iniciar servidor API
const apiProcess = spawn('node', ['api/server.js'], {
  stdio: 'inherit',
  shell: true
});

// Iniciar Vite dev server
const viteProcess = spawn('npm', ['run', 'dev:vite'], {
  stdio: 'inherit',
  shell: true
});

// Manejar cierre de procesos
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidores...');
  apiProcess.kill();
  viteProcess.kill();
  process.exit();
});

apiProcess.on('close', (code) => {
  console.log(`Servidor API cerrado con código ${code}`);
});

viteProcess.on('close', (code) => {
  console.log(`Vite dev server cerrado con código ${code}`);
});
