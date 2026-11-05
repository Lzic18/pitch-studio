/* We Care note builder. Customer details stay in memory only. */
(function () {
  'use strict';
  const sidebar = document.querySelector('.sidebar'), main = document.querySelector('.main-content');
  if (!sidebar || !main) return;
  const section = document.createElement('section');
  section.id = 'we-care'; section.hidden = true;
  section.setAttribute('aria-labelledby', 'wc-title');
  const field = (id, label, extra = '') => `<label>${label}<input id="wc-${id}" name="${id}" ${extra}></label>`;
  const select = (id, label, options) => `<label>${label}<select id="wc-${id}" name="${id}" required><option value="">Select…</option>${options.map(o => `<option>${o}</option>`).join('')}</select></label>`;
  const check = (id, label) => `<label class="wc-check"><input type="checkbox" name="${id}" id="wc-${id}" required><span>${label}</span></label>`;
  const yesNo = (id, label) => `<fieldset class="wc-question"><legend>${label}</legend><label><input type="radio" name="${id}" value="Yes" required> Yes</label><label><input type="radio" name="${id}" value="No" required> No</label></fieldset>`;
  section.innerHTML = `
    <div class="wc-heading"><div><h1 id="wc-title">We Care</h1><p>Pay Monthly additional notes</p></div><button type="button" id="wc-clear" class="wc-secondary">Clear all</button></div>
    <p class="wc-hint">Complete the details, select roaming, then validate the checklist to create your note. Details are cleared when this page is reloaded.</p>
    <form id="wc-details" autocomplete="off">
      <div class="wc-card"><h2>Customer &amp; security</h2><div class="wc-grid wc-three">
        ${field('name', 'Customer name', 'required maxlength="150"')}
        ${field('security', 'Level of security passed', 'required maxlength="150" placeholder="e.g. DPA"')}
        ${field('proof', 'ID / proof details', 'required maxlength="500"')}
      </div><div class="wc-grid wc-two">${check('permission', 'Customer has permission on the account')}${check('health', 'Account Health Check processed and details confirmed correct')}</div></div>
      <div class="wc-grid wc-three">
        <div class="wc-card"><h2>Sale &amp; device</h2>
          ${select('service', 'Service purchased', ['SIM Only', 'Device', 'Tablet', 'Smartwatch', 'Mobile Broadband'])}
          ${select('connection', 'Connection type', ['New Connection', 'Upgrade'])}
          ${field('device', 'Device make & model', 'maxlength="200" placeholder="If applicable"')}
        </div>
        <div class="wc-card"><h2>Airtime plan</h2>
          ${field('plan', 'Airtime plan description', 'required maxlength="300"')}
          ${field('speed', 'Download speed limit', 'required list="wc-speeds" placeholder="e.g. 100Mbps or No speed limit" maxlength="100"')}
          <datalist id="wc-speeds"><option value="10Mbps"><option value="100Mbps"><option value="No speed limit"></datalist>
          <p id="wc-roaming-status">Roaming not selected</p><button type="button" id="wc-roaming-open">Roaming – select plan</button>
        </div>
        <div class="wc-card"><h2>Insurance &amp; extras</h2>
          <label>Insurance purchased<select name="insurance" id="wc-insurance"><option>No</option><option>Loss, Theft &amp; Damage Cover</option><option>Damage Cover</option><option>Screen Damage Cover</option></select></label>
          <div id="wc-insurance-fields" class="wc-grid wc-two" hidden>${field('insuranceCost', 'Monthly cost (£)', 'type="number" min="0" step="0.01" disabled')}${field('excess', 'Excess (£)', 'type="number" min="0" step="0.01" disabled')}</div>
          <label class="wc-check"><input type="checkbox" name="tech" id="wc-tech"><span>Tech Service processed</span></label>
        </div>
      </div>
      <div class="wc-card"><h2>Additional comments</h2><label>Other details discussed<textarea id="wc-comments" name="comments" rows="3" placeholder="Discounts, other products discussed or declined, customer requirements and objections"></textarea></label></div>
      <div class="wc-actions"><button type="submit">Validate Note</button><p id="wc-status" role="status" aria-live="polite"></p></div>
    </form>
    <div id="wc-results" class="wc-grid wc-two" hidden>
      <div class="wc-card"><div class="wc-heading"><h2>Account note</h2><button type="button" data-copy="wc-note">Copy note</button></div><textarea id="wc-note" aria-label="Completed account note" readonly rows="22"></textarea></div>
      <div class="wc-card"><div class="wc-heading"><h2>Text reassurance</h2><button type="button" data-copy="wc-sms">Copy text</button></div><textarea id="wc-sms" aria-label="Text reassurance" readonly rows="22"></textarea></div>
    </div>
    <dialog id="wc-roaming-dialog" aria-labelledby="wc-roaming-title"><div class="wc-heading"><h2 id="wc-roaming-title">Roaming</h2><button type="button" data-close="wc-roaming-dialog" class="wc-secondary">Close</button></div><p>What roaming plan does the customer have?</p><div class="wc-roaming-options"><button type="button" data-roaming="Xtra Euro Roam">Xtra Euro Roam</button><button type="button" data-roaming="Xtra Global Roam">Xtra Global Roam</button><button type="button" data-roaming="No Inclusive Roaming">No Inclusive Roaming</button></div><button type="button" id="wc-roaming-reset" class="wc-secondary">Reset roaming</button></dialog>
    <dialog id="wc-checklist-dialog" aria-labelledby="wc-checklist-title"><form id="wc-checklist"><h2 id="wc-checklist-title">Checklist</h2>
      ${yesNo('vulnerable', 'Has the customer requested or given any indication that a vulnerability flag should be placed on the account?')}
      ${yesNo('complaint', 'Has the customer requested or given any indication that this is or could later be raised as a complaint?')}
      ${yesNo('securenet', 'Has Secure Net been added to the customer’s account?')}
      ${check('roamingConfirmed', 'I confirm I have discussed and the customer understands roaming charges and the date that these come into effect.')}
      ${check('billing', 'I confirm the next / first bill has been discussed with the customer and they are aware of the possibility of pro-rata billing.')}
      ${select('spend', 'Spend Manager', ['£0', '£5', '£10', '£15', '£20', '£30', '£40', '£50', '£75', '£100', 'No Spend Manager', 'Not applicable', 'Other'])}
      <div id="wc-spend-custom" hidden>${field('spendOther', 'Spend Manager amount (£)', 'type="number" min="0" step="0.01" disabled')}</div>
      <div class="wc-grid wc-three">
        <div class="wc-card"><h3>Marketing preferences</h3>${check('marketing', 'I confirm marketing preferences have been discussed and set correctly on the customer’s account.')}</div>
        <div class="wc-card"><h3>Consumer Price Index</h3>${check('cpi', 'I confirm I have discussed with and the customer understands the Consumer Price Index and how it may affect future billing.')}</div>
        <div class="wc-card"><h3>Network Access Charge</h3>${check('networkCharge', 'I confirm I have discussed with and the customer understands the standard Network Access Charge.')}</div>
      </div><h3>Declaration</h3>${check('declaration', 'I confirm I have not Recommended, Pressure Sold or Miss Sold this product.')}
      <div class="wc-actions"><button type="submit">Confirm &amp; create note</button><button type="button" data-close="wc-checklist-dialog" class="wc-secondary">Cancel</button></div>
    </form></dialog>`;
  main.append(section);
  const $ = id => document.getElementById('wc-' + id);
  const details = $('details'), checklist = $('checklist');
  let roaming = '';
  const val = id => $(id).value.trim();
  function invalidate() {
    $('results').hidden = true; $('note').value = ''; $('sms').value = '';
    $('status').textContent = 'Validate the details and checklist to create your note.';
  }
  details.addEventListener('input', () => { checklist.reset(); updateSpend(); invalidate(); });
  checklist.addEventListener('input', invalidate);
  $('insurance').addEventListener('change', () => {
    const enabled = val('insurance') !== 'No'; $('insurance-fields').hidden = !enabled;
    ['insuranceCost', 'excess'].forEach(id => { $(id).disabled = !enabled; $(id).required = enabled; if (!enabled) $(id).value = ''; });
  });
  function updateSpend() {
    const enabled = val('spend') === 'Other'; $('spend-custom').hidden = !enabled;
    $('spendOther').disabled = !enabled; $('spendOther').required = enabled;
  }
  $('spend').addEventListener('change', updateSpend);
  $('roaming-open').addEventListener('click', () => $('roaming-dialog').showModal());
  section.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  function setRoaming(value) {
    roaming = value; $('roaming-status').textContent = value || 'Roaming not selected';
    section.querySelectorAll('[data-roaming]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.roaming === value)));
    checklist.reset(); updateSpend(); invalidate();
  }
  section.querySelectorAll('[data-roaming]').forEach(button => button.addEventListener('click', () => { setRoaming(button.dataset.roaming); $('roaming-dialog').close(); }));
  $('roaming-reset').addEventListener('click', () => setRoaming(''));
  details.addEventListener('submit', event => {
    event.preventDefault();
    if (!details.reportValidity()) return;
    if (!roaming) { $('status').textContent = 'Select the customer’s roaming plan first.'; $('roaming-dialog').showModal(); return; }
    $('checklist-dialog').showModal();
  });
  const roamingText = () => `Your Plan includes: ${roaming}\nYou can use your UK allowance of data, minutes and texts in Zone A at no extra cost on all of our plans.\nIf your plan doesn't have inclusive roaming, there will be an additional cost to use your allowance outside of these zones. You can check out all of our zones and destinations on our roaming page (https://www.vodafone.co.uk/mobile/global-roaming).\nThere's a 25GB roaming fair usage policy that applies to your monthly data usage and using your phone abroad for long periods of time may incur additional charges. Terms and conditions apply (https://www.vodafone.co.uk/terms-and-conditions/).`;
  checklist.addEventListener('submit', event => {
    event.preventDefault();
    if (!checklist.reportValidity() || !details.checkValidity() || !roaming) return;
    const answers = new FormData(checklist);
    const extras = [];
    if (val('device')) extras.push('Device: ' + val('device'));
    extras.push(val('speed').toLowerCase() === 'no speed limit' ? `The ${val('plan')} – has no download speed limit.` : `The ${val('plan')} – has a download speed limit of ${val('speed')}.`);
    if (val('insurance') !== 'No') extras.push(`Insurance: ${val('insurance')}. Monthly cost: £${Number(val('insuranceCost')).toFixed(2)}. Excess: £${Number(val('excess')).toFixed(2)}.`);
    if ($('tech').checked) extras.push('A Tech Service has been processed.');
    if (val('comments')) extras.push(val('comments'));
    if (answers.get('vulnerable') === 'Yes') extras.push('The customer has requested or indicated that a vulnerability flag should be placed on the account.');
    if (answers.get('complaint') === 'Yes') extras.push('The customer has indicated that this is or could later be raised as a complaint.');
    if (answers.get('securenet') === 'Yes') extras.push('Secure Net has been added to the customer’s account.');
    if (val('spend') !== 'Not applicable') extras.push('Spend Manager: ' + (val('spend') === 'Other' ? '£' + Number(val('spendOther')).toFixed(2) : val('spend')) + '.');
    $('note').value = `Spoken to ${val('name')} who has permission on the account and passed ${val('security')}.\nAccount Health Check processed and I confirm details are correct.\n\nID/Proof Details: ${val('proof')}\n\nEnquiry: Purchase\n\nAdditional information relating to the customers recent ${val('service')} - ${val('connection')} purchase:\n\n${extras.join('\n\n')}\n\nRoaming SMS:\n${roamingText()}\n\nI have discussed billing with the customer and informed them about the possibility of pro-rata billing.\nMarketing preferences have been discussed and amended where necessary on the account.\nI confirm I have not Recommended, Pressure Sold or Miss Sold this product.\n\n#NoteToolEngine`;
    $('sms').value = roamingText();
    $('checklist-dialog').close(); $('results').hidden = false;
    $('status').textContent = 'Note ready. Review it, then copy.';
    $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  section.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const output = document.getElementById(button.dataset.copy);
    try { await navigator.clipboard.writeText(output.value); $('status').textContent = button.dataset.copy === 'wc-note' ? 'Account note copied.' : 'Text reassurance copied.'; }
    catch { output.focus(); output.select(); $('status').textContent = 'Text selected. Press Ctrl+C or use your device’s Copy option.'; }
  }));
  $('clear').addEventListener('click', () => {
    details.reset(); checklist.reset(); setRoaming(''); updateSpend();
    $('insurance-fields').hidden = true;
    ['insuranceCost', 'excess'].forEach(id => { $(id).disabled = true; $(id).required = false; });
    $('status').textContent = 'Cleared. Ready for the next customer.'; $('name').focus();
  });
  const nav = document.createElement('a'); nav.id = 'we-care-link'; nav.href = '#we-care'; nav.textContent = 'We Care';
  sidebar.insertBefore(nav, sidebar.querySelector('.sidebar-bottom'));
  const breadcrumb = document.querySelector('.workspace-header > span');
  function hide() {
    section.hidden = true; nav.classList.remove('active'); nav.removeAttribute('aria-current');
    section.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    if (breadcrumb?.textContent === 'Sales workspace / We Care') breadcrumb.textContent = 'Sales workspace / Pitch builder';
    if (location.hash === '#we-care') history.replaceState(null, '', location.pathname + location.search);
  }
  function show(event) {
    event?.preventDefault();
    for (const id of ['welcome-content', 'template-content', 'branch-content', 'knowledge-base-section']) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
    for (const id of ['conversion-tracker', 'third-party-objections', 'pro-rata-calc', 'super-mobile-objections', 'cancellation-pitches', 'hundred-gb-pitch', 'new-starter-guide']) { const el = document.getElementById(id); if (el) el.hidden = true; }
    sidebar.querySelectorAll('a').forEach(link => { link.classList.toggle('active', link === nav); if (link === nav) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    section.hidden = false; if (breadcrumb) breadcrumb.textContent = 'Sales workspace / We Care';
    if (location.hash !== '#we-care') history.replaceState(null, '', '#we-care');
  }
  nav.addEventListener('click', show);
  sidebar.querySelectorAll('a').forEach(link => { if (link !== nav) link.addEventListener('click', hide); });
  if (typeof window.renderTemplate === 'function') { const render = window.renderTemplate; window.renderTemplate = function (...args) { hide(); return render.apply(this, args); }; }
  if (location.hash === '#we-care') show();
})();
