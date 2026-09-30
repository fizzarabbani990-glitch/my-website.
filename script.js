/* ======================================================================
   script.js – AI Portfolio Generator – Full Functionality
   ====================================================================== */

// ── Utility ──
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg, type = 'success') {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Tab Switching ──
$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $$('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $(`#tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ── Device Preview Toggle ──
$$('.device-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.device-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const container = $('.preview-frame-container');
    container.className = 'preview-frame-container ' + btn.dataset.device;
  });
});

// ── Dynamic Add / Remove Helpers ──
function createRemoveBtn() {
  const btn = document.createElement('button');
  btn.className = 'remove-btn';
  btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  btn.title = 'Remove';
  btn.addEventListener('click', function () {
    this.parentElement.remove();
    renderPreview();
  });
  return btn;
}

function addExperience() {
  const list = $('#experienceList');
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <input type="text" class="exp-title" placeholder="Job Title">
    <input type="text" class="exp-company" placeholder="Company">
    <input type="text" class="exp-dates" placeholder="Dates (e.g. 2020 - Present)">
    <textarea class="exp-desc" placeholder="Description"></textarea>
  `;
  item.appendChild(createRemoveBtn());
  list.appendChild(item);
  attachLiveListeners(item);
}

function addEducation() {
  const list = $('#educationList');
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <input type="text" class="edu-degree" placeholder="Degree">
    <input type="text" class="edu-school" placeholder="School/University">
    <input type="text" class="edu-dates" placeholder="Dates">
  `;
  item.appendChild(createRemoveBtn());
  list.appendChild(item);
  attachLiveListeners(item);
}

function addProject() {
  const list = $('#projectsList');
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <input type="text" class="proj-title" placeholder="Project Name">
    <input type="text" class="proj-tech" placeholder="Technologies used">
    <textarea class="proj-desc" placeholder="Project Description"></textarea>
    <input type="text" class="proj-link" placeholder="Project Link">
  `;
  item.appendChild(createRemoveBtn());
  list.appendChild(item);
  attachLiveListeners(item);
}

function addService() {
  const list = $('#servicesList');
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <input type="text" class="srv-title" placeholder="Service Name">
    <textarea class="srv-desc" placeholder="Service Description"></textarea>
  `;
  item.appendChild(createRemoveBtn());
  list.appendChild(item);
  attachLiveListeners(item);
}

function addCert() {
  const list = $('#certsList');
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <input type="text" class="cert-title" placeholder="Award/Certificate Name">
    <input type="text" class="cert-issuer" placeholder="Issuer/Organization">
    <input type="text" class="cert-date" placeholder="Year">
  `;
  item.appendChild(createRemoveBtn());
  list.appendChild(item);
  attachLiveListeners(item);
}

function addTestimonial() {
  const list = $('#testimonialsList');
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = `
    <input type="text" class="test-name" placeholder="Client Name">
    <input type="text" class="test-role" placeholder="Client Role/Company">
    <textarea class="test-text" placeholder="Testimonial"></textarea>
  `;
  item.appendChild(createRemoveBtn());
  list.appendChild(item);
  attachLiveListeners(item);
}

// Make add functions globally available
window.addExperience = addExperience;
window.addEducation = addEducation;
window.addProject = addProject;
window.addService = addService;
window.addCert = addCert;
window.addTestimonial = addTestimonial;

// ── Collect Form Data ──
function collectData() {
  const val = id => ($(id) ? $(id).value.trim() : '');
  return {
    name: val('#inputName') || 'Your Name',
    title: val('#inputTitle') || 'Your Title',
    photo: val('#inputPhoto') || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    bio: val('#inputBio') || '',
    skills: val('#inputSkills') ? val('#inputSkills').split(',').map(s => s.trim()).filter(Boolean) : [],
    email: val('#inputEmail') || '',
    phone: val('#inputPhone') || '',
    location: val('#inputLocation') || '',
    linkedin: val('#inputLinkedin') || '#',
    github: val('#inputGithub') || '#',
    template: val('#templateSelect') || 'modern',
    experience: $$('#experienceList .dynamic-item').map(el => ({
      title: el.querySelector('.exp-title')?.value || '',
      company: el.querySelector('.exp-company')?.value || '',
      dates: el.querySelector('.exp-dates')?.value || '',
      desc: el.querySelector('.exp-desc')?.value || '',
    })),
    education: $$('#educationList .dynamic-item').map(el => ({
      degree: el.querySelector('.edu-degree')?.value || '',
      school: el.querySelector('.edu-school')?.value || '',
      dates: el.querySelector('.edu-dates')?.value || '',
    })),
    projects: $$('#projectsList .dynamic-item').map(el => ({
      title: el.querySelector('.proj-title')?.value || '',
      tech: el.querySelector('.proj-tech')?.value || '',
      desc: el.querySelector('.proj-desc')?.value || '',
      link: el.querySelector('.proj-link')?.value || '#',
    })),
    services: $$('#servicesList .dynamic-item').map(el => ({
      title: el.querySelector('.srv-title')?.value || '',
      desc: el.querySelector('.srv-desc')?.value || '',
    })),
    certs: $$('#certsList .dynamic-item').map(el => ({
      title: el.querySelector('.cert-title')?.value || '',
      issuer: el.querySelector('.cert-issuer')?.value || '',
      date: el.querySelector('.cert-date')?.value || '',
    })),
    testimonials: $$('#testimonialsList .dynamic-item').map(el => ({
      name: el.querySelector('.test-name')?.value || '',
      role: el.querySelector('.test-role')?.value || '',
      text: el.querySelector('.test-text')?.value || '',
    })),
  };
}

// ── Generate Portfolio HTML ──
function generatePortfolioHTML(data) {
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const templateClass = data.template === 'modern' ? '' : data.template;

  const skillsHTML = data.skills.map(s => `<span class="skill-tag">${esc(s)}</span>`).join('');

  const expHTML = data.experience.filter(e => e.title || e.company).map(e => `
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">${esc(e.title)}</div><div class="card-subtitle">${esc(e.company)}</div></div>
        <div class="card-date">${esc(e.dates)}</div>
      </div>
      <p style="color:var(--text-light)">${esc(e.desc)}</p>
    </div>
  `).join('');

  const projHTML = data.projects.filter(p => p.title).map(p => `
    <div class="card">
      <div class="card-title">${esc(p.title)}</div>
      <div class="tech-stack">${esc(p.tech)}</div>
      <p style="color:var(--text-light)">${esc(p.desc)}</p>
      ${p.link && p.link !== '#' ? `<a class="project-link" href="${esc(p.link)}" target="_blank">View Project →</a>` : ''}
    </div>
  `).join('');

  const eduHTML = data.education.filter(e => e.degree || e.school).map(e => `
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">${esc(e.degree)}</div><div class="card-subtitle">${esc(e.school)}</div></div>
        <div class="card-date">${esc(e.dates)}</div>
      </div>
    </div>
  `).join('');

  const certsHTML = data.certs.filter(c => c.title).map(c => `
    <div class="card">
      <div class="card-header">
        <div><div class="card-title"><i class="fa-solid fa-award" style="color:var(--primary);margin-right:8px"></i>${esc(c.title)}</div><div class="card-subtitle">${esc(c.issuer)}</div></div>
        <div class="card-date">${esc(c.date)}</div>
      </div>
    </div>
  `).join('');

  const srvHTML = data.services.filter(s => s.title).map(s => `
    <div class="card">
      <div class="card-title">${esc(s.title)}</div>
      <p style="color:var(--text-light);margin-top:10px">${esc(s.desc)}</p>
    </div>
  `).join('');

  const testHTML = data.testimonials.filter(t => t.text).map(t => `
    <div class="card" style="font-style:italic">
      <p>"${esc(t.text)}"</p>
      <p style="margin-top:15px;font-style:normal;font-weight:600">— ${esc(t.name)}</p>
      <p style="font-style:normal;color:var(--text-light);font-size:0.9rem">${esc(t.role)}</p>
    </div>
  `).join('');

  // Use the inline template from the <script type="text/template"> tag
  const templateTag = document.getElementById('portfolioTemplate');
  if (!templateTag) return '<p>Template missing</p>';

  let html = templateTag.innerHTML;
  html = html.replace(/\{\{TEMPLATE_CLASS\}\}/g, templateClass);
  html = html.replace(/\{\{NAME\}\}/g, esc(data.name));
  html = html.replace(/\{\{TITLE\}\}/g, esc(data.title));
  html = html.replace(/\{\{PHOTO\}\}/g, esc(data.photo));
  html = html.replace(/\{\{BIO\}\}/g, esc(data.bio));
  html = html.replace(/\{\{EMAIL\}\}/g, esc(data.email));
  html = html.replace(/\{\{PHONE\}\}/g, esc(data.phone));
  html = html.replace(/\{\{LOCATION\}\}/g, esc(data.location));
  html = html.replace(/\{\{LINKEDIN\}\}/g, esc(data.linkedin));
  html = html.replace(/\{\{GITHUB\}\}/g, esc(data.github));
  html = html.replace(/\{\{SKILLS_HTML\}\}/g, skillsHTML);
  html = html.replace(/\{\{EXPERIENCE_HTML\}\}/g, expHTML || '<p style="text-align:center;color:var(--text-light)">No experience added yet.</p>');
  html = html.replace(/\{\{PROJECTS_HTML\}\}/g, projHTML || '<p style="text-align:center;color:var(--text-light)">No projects added yet.</p>');
  html = html.replace(/\{\{EDUCATION_HTML\}\}/g, eduHTML);
  html = html.replace(/\{\{CERTS_HTML\}\}/g, certsHTML);
  html = html.replace(/\{\{SERVICES_HTML\}\}/g, srvHTML || '<p style="text-align:center;color:var(--text-light)">No services added yet.</p>');
  html = html.replace(/\{\{TESTIMONIALS_HTML\}\}/g, testHTML || '<p style="text-align:center;color:var(--text-light)">No testimonials added yet.</p>');

  return html;
}

// ── Render Preview ──
let previewTimeout;
function renderPreview() {
  clearTimeout(previewTimeout);
  previewTimeout = setTimeout(() => {
    const data = collectData();
    const html = generatePortfolioHTML(data);
    const frame = $('#previewFrame');
    if (frame) {
      const doc = frame.contentDocument || frame.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    }
    // Save to localStorage
    try { localStorage.setItem('portfolioData', JSON.stringify(data)); } catch(e) {}
  }, 200);
}

// ── Live Listeners (re-render on every keystroke) ──
function attachLiveListeners(root) {
  root.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', renderPreview);
  });
}

// Attach to all existing fields
attachLiveListeners(document);

// Template select also triggers re-render
$('#templateSelect')?.addEventListener('change', renderPreview);

// ── Download as HTML ──
$('#downloadBtn')?.addEventListener('click', () => {
  const data = collectData();
  const html = generatePortfolioHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.name.replace(/\s+/g, '_')}_Portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Portfolio downloaded!', 'success');
});

// ── Publish (simulated) ──
$('#publishBtn')?.addEventListener('click', () => {
  const data = collectData();
  const html = generatePortfolioHTML(data);
  // Open in new tab as "published"
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    showToast('Portfolio published in new tab!', 'success');
  } else {
    showToast('Popup blocked – please allow popups.', 'error');
  }
});

// ── Load saved data from localStorage ──
function loadSavedData() {
  try {
    const saved = localStorage.getItem('portfolioData');
    if (!saved) return;
    const data = JSON.parse(saved);
    if (data.name) $('#inputName').value = data.name;
    if (data.title) $('#inputTitle').value = data.title;
    if (data.photo) $('#inputPhoto').value = data.photo;
    if (data.bio) $('#inputBio').value = data.bio;
    if (data.skills?.length) $('#inputSkills').value = data.skills.join(', ');
    if (data.email) $('#inputEmail').value = data.email;
    if (data.phone) $('#inputPhone').value = data.phone;
    if (data.location) $('#inputLocation').value = data.location;
    if (data.linkedin) $('#inputLinkedin').value = data.linkedin;
    if (data.github) $('#inputGithub').value = data.github;
    if (data.template) $('#templateSelect').value = data.template;
  } catch(e) {}
}

// ── Init ──
loadSavedData();
renderPreview();
