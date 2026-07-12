const endpoint = 'http://127.0.0.1:9224';
async function inspect(width, height) {
  const opened = await fetch(`${endpoint}/json/new?${encodeURIComponent('http://localhost:3000/mentalnaya-arifmetika')}`, { method: 'PUT' }).then((r) => r.json());
  const socket = new WebSocket(opened.webSocketDebuggerUrl);
  let id = 0; const pending = new Map();
  socket.onmessage = (event) => { const msg = JSON.parse(event.data); if (!msg.id || !pending.has(msg.id)) return; const task = pending.get(msg.id); pending.delete(msg.id); msg.error ? task.reject(new Error(msg.error.message)) : task.resolve(msg.result); };
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const callId = ++id; pending.set(callId, { resolve, reject }); socket.send(JSON.stringify({ id: callId, method, params })); });
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await send('Page.navigate', { url: 'http://localhost:3000/mentalnaya-arifmetika' });
  await new Promise((resolve) => setTimeout(resolve, 1800));
  const evaluated = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify({viewport:innerWidth,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,title:document.querySelector('.mental-hero-title')?.textContent.trim(),ageTabs:document.querySelectorAll('.mental-age-tab').length,cards:document.querySelectorAll('.mental-lesson-card').length,miniAbacuses:document.querySelectorAll('.mental-lesson-visual svg').length,liveDemo:Boolean(document.querySelector('.mental-demo-stage svg')),css:getComputedStyle(document.querySelector('.mental-page')).backgroundColor})` });
  socket.close(); return JSON.parse(evaluated.result.value);
}
for (const [width, height] of [[1440,1000],[390,844]]) {
  const report = await inspect(width,height);
  if (report.scrollWidth > report.clientWidth + 1) throw new Error(`Overflow ${width}: ${report.scrollWidth}/${report.clientWidth}`);
  if (!report.title || report.ageTabs !== 2 || report.cards !== 26 || report.miniAbacuses < 25 || !report.liveDemo) throw new Error(`Incomplete ${width}: ${JSON.stringify(report)}`);
  console.log(`${width}px: ${JSON.stringify(report)}`);
}
