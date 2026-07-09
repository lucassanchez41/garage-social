// GarageSocial — logique applicative (état + rendu + actions)
var App = window.App || {};

App.state = {
  hasOnboarded: false,
  onboardingStep: 'choose',
  pendingMode: 'particulier',
  signupEmail: '',
  signupPassword: '',
  signupFirstName: '',
  signupLastName: '',
  signupBirthdate: '',
  signupCompany: '',
  signupAddress: '',
  signupPhone: '',
  lang: 'fr',
  mode: 'particulier',
  view: 'feed',
  selectedVehicleId: 'v1',
  selectedProId: 'p1',
  showVehicleSettings: false,
  searchQuery: '',
  quoteVehicleId: 'v1',
  quoteService: '',
  quoteMessage: '',
  selectedConversationId: 'c1',
  messageDraft: '',
  commissionModel: 'commission',
  proFilterCategory: 'all',
  proFilterCity: '',
  formPlate: '',
  formMake: '',
  formModel: '',
  formYear: '',
  formDescription: '',
  formPlateBlur: false,
  formPrivate: false,
  formDisableSearch: false,
  formRgpdConsent: false,
};

// ---------- Helpers ----------
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function T() { return App.TR[App.state.lang] || App.TR.fr; }
function findVehicle(id) { return App.data.vehicles.find(v => v.id === id); }
function findPro(id) { return App.data.pros.find(p => p.id === id); }
function formatPlate(plate, blurred) {
  if (!plate) return '';
  const p = plate.toUpperCase();
  if (!blurred) return p.length >= 4 ? p.slice(0, 2) + '-' + p.slice(2, 5) + '-' + p.slice(5) : p;
  return p.slice(0, 2) + '-•••-•••';
}

function setState(patch) {
  Object.assign(App.state, patch);
  render();
}

// ---------- Actions ----------
App.chooseParticulier = () => setState({ onboardingStep: 'signup', pendingMode: 'particulier' });
App.chooseProfessionnel = () => setState({ onboardingStep: 'signup', pendingMode: 'pro' });
App.backToChooseType = () => setState({ onboardingStep: 'choose' });

App.onSignupEmailChange = (v) => setState({ signupEmail: v });
App.onSignupPasswordChange = (v) => setState({ signupPassword: v });
App.onSignupFirstNameChange = (v) => setState({ signupFirstName: v });
App.onSignupLastNameChange = (v) => setState({ signupLastName: v });
App.onSignupBirthdateChange = (v) => setState({ signupBirthdate: v });
App.onSignupCompanyChange = (v) => setState({ signupCompany: v });
App.onSignupAddressChange = (v) => setState({ signupAddress: v });
App.onSignupPhoneChange = (v) => setState({ signupPhone: v });

App.submitSignup = () => {
  const s = App.state;
  const base = s.signupEmail && s.signupPassword && s.signupFirstName && s.signupLastName && s.signupBirthdate;
  const proOk = s.pendingMode !== 'pro' || (s.signupCompany && s.signupAddress && s.signupPhone);
  if (!base || !proOk) return;
  App.currentUser.name = s.signupFirstName + ' ' + s.signupLastName;
  App.currentUser.handle = (s.signupFirstName + '.' + s.signupLastName).toLowerCase().replace(/\s+/g, '');
  if (s.pendingMode === 'pro') {
    App.data.myProBusiness.name = s.signupCompany;
  }
  setState({ hasOnboarded: true, mode: s.pendingMode, view: 'feed', onboardingStep: 'choose' });
};

App.goFeed = () => setState({ view: 'feed', showVehicleSettings: false });
App.goOwner = () => setState({ view: 'owner' });
App.goProDirectory = () => setState({ view: 'proDirectory' });
App.goMessages = () => setState({ view: 'messages' });
App.goQuotes = () => setState({ view: 'quotes' });
App.goProDashboard = () => setState({ view: 'proDashboard' });
App.goCreateVehicle = () => setState({ view: 'createVehicle' });
App.goQuoteForm = () => setState({ view: 'quoteForm', quoteService: '', quoteMessage: '' });
App.goProProfileBack = () => setState({ view: 'proProfile' });

App.toggleMode = () => setState({ mode: App.state.mode === 'particulier' ? 'pro' : 'particulier' });
App.setLangFr = () => setState({ lang: 'fr' });
App.setLangEn = () => setState({ lang: 'en' });

App.onSearchChange = (v) => setState({ searchQuery: v });

App.openVehicle = (id) => setState({ view: 'vehicle', selectedVehicleId: id, showVehicleSettings: false });
App.openPro = (id) => setState({ view: 'proProfile', selectedProId: id });
App.toggleVehicleSettings = () => setState({ showVehicleSettings: !App.state.showVehicleSettings });

App.onFormPlateChange = (v) => setState({ formPlate: v });
App.onFormMakeChange = (v) => setState({ formMake: v });
App.onFormModelChange = (v) => setState({ formModel: v });
App.onFormYearChange = (v) => setState({ formYear: v });
App.onFormDescriptionChange = (v) => setState({ formDescription: v });
App.toggleFormPlateBlur = () => setState({ formPlateBlur: !App.state.formPlateBlur });
App.toggleFormPrivate = () => setState({ formPrivate: !App.state.formPrivate });
App.toggleFormDisableSearch = () => setState({ formDisableSearch: !App.state.formDisableSearch });
App.toggleFormRgpd = () => setState({ formRgpdConsent: !App.state.formRgpdConsent });

App.submitVehicle = () => {
  const s = App.state;
  if (!s.formRgpdConsent || !s.formPlate || !s.formMake) return;
  const id = 'v' + (App.data.vehicles.length + 1);
  App.data.vehicles.push({
    id, plate: s.formPlate.replace(/[^A-Za-z0-9]/g, ''), make: s.formMake, model: s.formModel || '', year: s.formYear || '—', city: App.currentUser.city,
    tagline: 'Nouvelle fiche', ownerHandle: App.currentUser.handle, isOwn: true, followers: 0, modsCount: 0, photosCount: 0, prosCount: 0,
    plateBlurred: s.formPlateBlur, isPrivate: s.formPrivate, disableSearch: s.formDisableSearch,
    description: s.formDescription || '', mods: [],
  });
  setState({ view: 'vehicle', selectedVehicleId: id, formPlate: '', formMake: '', formModel: '', formYear: '', formDescription: '', formPlateBlur: false, formPrivate: false, formDisableSearch: false, formRgpdConsent: false });
};

App.toggleSelPlateBlur = () => { const v = findVehicle(App.state.selectedVehicleId); if (v) v.plateBlurred = !v.plateBlurred; render(); };
App.toggleSelPrivate = () => { const v = findVehicle(App.state.selectedVehicleId); if (v) v.isPrivate = !v.isPrivate; render(); };
App.toggleSelDisableSearch = () => { const v = findVehicle(App.state.selectedVehicleId); if (v) v.disableSearch = !v.disableSearch; render(); };
App.deleteVehicle = () => { App.data.vehicles = App.data.vehicles.filter(v => v.id !== App.state.selectedVehicleId); setState({ view: 'owner', showVehicleSettings: false }); };

App.onProCategoryChange = (v) => setState({ proFilterCategory: v });
App.onProCityChange = (v) => setState({ proFilterCity: v });

App.onQuoteVehicleChange = (v) => setState({ quoteVehicleId: v });
App.onQuoteServiceChange = (v) => setState({ quoteService: v });
App.onQuoteMessageChange = (v) => setState({ quoteMessage: v });
App.submitQuote = () => {
  const s = App.state;
  const vehicle = findVehicle(s.quoteVehicleId) || App.data.vehicles[0];
  const pro = findPro(s.selectedProId);
  App.data.quoteRequests.push({ id: 'q' + (App.data.quoteRequests.length + 1), vehicleId: vehicle.id, vehicleName: vehicle.make + ' ' + vehicle.model, proId: pro.id, proName: pro.name, service: s.quoteService || 'Demande de devis', status: 0, clientHandle: App.currentUser.handle });
  setState({ view: 'quotes' });
};

App.openConversation = (id) => setState({ selectedConversationId: id });
App.onMessageDraftChange = (v) => setState({ messageDraft: v });
App.sendMessage = () => {
  const s = App.state;
  if (!s.messageDraft.trim()) return;
  const conv = App.data.conversationsData.find(c => c.id === s.selectedConversationId);
  if (conv) conv.messages.push({ from: 'me', text: s.messageDraft });
  setState({ messageDraft: '' });
};

App.selectCommissionModel = () => setState({ commissionModel: 'commission' });
App.selectLeadModel = () => setState({ commissionModel: 'lead' });
App.advanceLead = (id) => { const l = App.data.leadsData.find(l => l.id === id); if (l && l.status < 3) l.status += 1; render(); };

// ---------- View renderers ----------
function renderChooseType() {
  const t = T(), s = App.state;
  return `
    <div class="onboarding-box">
      <div class="onboard-logo">GARAGE·</div>
      <div class="onboard-subtitle">${esc(t.onboardSubtitle)}</div>
      <div class="lang-toggle">
        <span class="lang-pill ${s.lang === 'fr' ? 'active' : ''}" onclick="App.setLangFr()">Français</span>
        <span class="lang-pill ${s.lang === 'en' ? 'active' : ''}" onclick="App.setLangEn()">English</span>
      </div>
      <div class="onboard-card" onclick="App.chooseParticulier()">
        <div class="onboard-card-title">${esc(t.onboardCard1Title)}</div>
        <div class="onboard-card-desc">${esc(t.onboardCard1Desc)}</div>
      </div>
      <div class="onboard-card" onclick="App.chooseProfessionnel()">
        <div class="onboard-card-title">${esc(t.onboardCard2Title)}</div>
        <div class="onboard-card-desc">${esc(t.onboardCard2Desc)}</div>
      </div>
    </div>`;
}

function renderSignupStep() {
  const t = T(), s = App.state;
  const isPro = s.pendingMode === 'pro';
  const signupSubtitle = isPro ? t.signupSubtitlePro : t.signupSubtitleParticulier;
  const canSubmit = !!(s.signupEmail && s.signupPassword && s.signupFirstName && s.signupLastName && s.signupBirthdate && (!isPro || (s.signupCompany && s.signupAddress && s.signupPhone)));

  const proFields = isPro ? `
      <label class="form-label">${esc(t.companyFieldLabel)}</label>
      <input id="input-signup-company" class="form-input" value="${esc(s.signupCompany)}" oninput="App.onSignupCompanyChange(this.value)" placeholder="WrapStudio Lyon" />
      <label class="form-label">${esc(t.addressFieldLabel)}</label>
      <input id="input-signup-address" class="form-input" value="${esc(s.signupAddress)}" oninput="App.onSignupAddressChange(this.value)" placeholder="12 rue de la République, Lyon" />
      <label class="form-label">${esc(t.phoneFieldLabel)}</label>
      <input id="input-signup-phone" class="form-input" value="${esc(s.signupPhone)}" oninput="App.onSignupPhoneChange(this.value)" placeholder="06 12 34 56 78" />` : '';

  return `
    <div class="signup-box">
      <span class="back-link" onclick="App.backToChooseType()">${esc(t.signupBack)}</span>
      <div class="signup-title">${esc(t.signupTitle)}</div>
      <div class="signup-subtitle">${esc(signupSubtitle)}</div>

      <label class="form-label">${esc(t.emailFieldLabel)}</label>
      <input id="input-signup-email" class="form-input" value="${esc(s.signupEmail)}" oninput="App.onSignupEmailChange(this.value)" placeholder="prenom.nom@email.com" />

      <label class="form-label">${esc(t.passwordFieldLabel)}</label>
      <input id="input-signup-password" type="password" class="form-input" value="${esc(s.signupPassword)}" oninput="App.onSignupPasswordChange(this.value)" placeholder="mot de passe" />

      <div class="form-row">
        <div>
          <label class="form-label">${esc(t.firstNameFieldLabel)}</label>
          <input id="input-signup-firstname" class="form-input" value="${esc(s.signupFirstName)}" oninput="App.onSignupFirstNameChange(this.value)" placeholder="Léo" />
        </div>
        <div>
          <label class="form-label">${esc(t.lastNameFieldLabel)}</label>
          <input id="input-signup-lastname" class="form-input" value="${esc(s.signupLastName)}" oninput="App.onSignupLastNameChange(this.value)" placeholder="Martin" />
        </div>
      </div>

      <label class="form-label">${esc(t.birthdateFieldLabel)}</label>
      <input id="input-signup-birthdate" type="date" class="form-input" value="${esc(s.signupBirthdate)}" oninput="App.onSignupBirthdateChange(this.value)" />

      ${proFields}

      <button class="btn-primary" style="width:100%; padding:13px 22px; font-size:14px; border-radius:6px; margin-top:6px;" ${canSubmit ? '' : 'disabled'} onclick="App.submitSignup()">${esc(t.signupSubmitBtn)}</button>
    </div>`;
}

const ONBOARD_CAR_SVG = `
<svg class="onboard-car-svg" viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="carBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6FB6EE"/>
      <stop offset="45%" stop-color="#1E6FB5"/>
      <stop offset="100%" stop-color="#0A2B47"/>
    </linearGradient>
    <linearGradient id="carGlass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#12293b"/>
      <stop offset="100%" stop-color="#04121c"/>
    </linearGradient>
  </defs>
  <ellipse cx="460" cy="298" rx="400" ry="16" fill="#1E6FB5" opacity="0.35"/>
  <path d="M40,258 C40,228 92,214 142,208 C172,172 232,138 302,123 C342,114 382,110 422,110 C472,110 522,118 562,138 C612,118 662,116 702,126 C742,136 782,158 812,193 C844,203 868,214 878,234 L878,254 C878,267 868,274 853,274 L822,274 C817,254 797,239 772,239 C747,239 727,254 722,274 L262,274 C257,254 237,239 212,239 C187,239 167,254 162,274 L72,274 C52,274 40,267 40,258 Z" fill="url(#carBody)" stroke="#082238" stroke-width="2"/>
  <path d="M300,123 C340,114 380,110 420,110 C470,110 520,118 560,138 L540,174 L330,174 Z" fill="url(#carGlass)"/>
  <path d="M762,148 L832,138 L834,150 L770,163 Z" fill="#0A2B47"/>
  <path d="M822,136 L834,136 L834,164 L822,164 Z" fill="#0A2B47"/>
  <path d="M162,218 L762,218" stroke="#3d8fd6" stroke-width="2" opacity="0.45"/>
  <circle cx="217" cy="274" r="45" fill="#050505"/>
  <circle cx="217" cy="274" r="23" fill="#111" stroke="#3d8fd6" stroke-width="2"/>
  <circle cx="747" cy="274" r="48" fill="#050505"/>
  <circle cx="747" cy="274" r="25" fill="#111" stroke="#3d8fd6" stroke-width="2"/>
</svg>`;

function renderOnboarding() {
  const s = App.state;
  return `
  <div class="onboarding-wrap">
    <div class="onboard-bg">
      ${ONBOARD_CAR_SVG}
      <div class="onboard-led-strip strip-1"></div>
      <div class="onboard-led-strip strip-2"></div>
      <div class="onboard-vignette"></div>
    </div>
    ${s.onboardingStep === 'signup' ? renderSignupStep() : renderChooseType()}
  </div>`;
}

function renderSidebar() {
  const t = T(), s = App.state;
  const navItem = (view, icon, label, action) => `
    <div class="nav-item ${s.view === view ? 'active' : ''}" onclick="App.${action}()">
      <span class="nav-icon">${icon}</span><span class="nav-label">${esc(label)}</span>
    </div>`;
  const proDashItem = s.mode === 'pro' ? navItem('proDashboard', '📊', t.navProDash, 'goProDashboard') : '';
  return `
  <div class="sidebar">
    <div class="sidebar-logo">GARAGE·</div>
    ${navItem('feed', '🏠', t.navFeed, 'goFeed')}
    ${navItem('owner', '🚗', t.navOwner, 'goOwner')}
    ${navItem('proDirectory', '🔧', t.navProDir, 'goProDirectory')}
    ${navItem('messages', '💬', t.navMessages, 'goMessages')}
    ${navItem('quotes', '📋', t.navQuotes, 'goQuotes')}
    ${proDashItem}
    <div class="sidebar-spacer"></div>
    <div class="sidebar-footer">
      <div class="mode-row">
        <span class="mode-label">${esc(t.modePro)}</span>
        <div class="toggle-switch ${s.mode === 'pro' ? 'on' : ''}" onclick="App.toggleMode()"><div class="toggle-knob"></div></div>
      </div>
      <div class="user-mini">
        <div class="avatar-circle"></div>
        <div>
          <div class="user-mini-name">${esc(App.currentUser.name)}</div>
          <div class="user-mini-handle">@${esc(App.currentUser.handle)}</div>
        </div>
      </div>
      <div class="lang-row">
        <span class="lang-row-label">${esc(t.langLabel)}</span>
        <div class="lang-row-pills">
          <span class="lang-pill-sm ${s.lang === 'fr' ? 'active' : ''}" onclick="App.setLangFr()">FR</span>
          <span class="lang-pill-sm ${s.lang === 'en' ? 'active' : ''}" onclick="App.setLangEn()">EN</span>
        </div>
      </div>
    </div>
  </div>`;
}

function renderFeed() {
  const t = T(), s = App.state;
  const searchQ = (s.searchQuery || '').toLowerCase().trim();
  const searchResults = searchQ ? App.data.vehicles.filter(v =>
    v.plate.toLowerCase().includes(searchQ.replace(/[^a-z0-9]/g, '')) ||
    v.make.toLowerCase().includes(searchQ) || v.model.toLowerCase().includes(searchQ) || v.city.toLowerCase().includes(searchQ)
  ) : [];

  let resultsBlock = '';
  if (searchQ) {
    resultsBlock = `
    <div class="results-block">
      <div class="results-label">${esc(t.resultsLabel)}</div>
      ${searchResults.map(v => `
        <div class="result-card" onclick="App.openVehicle('${v.id}')">
          <div class="result-thumb placeholder-tile"></div>
          <div class="result-info">
            <div class="result-title">${esc(v.make)} ${esc(v.model)}</div>
            <div class="result-sub">${esc(v.city)} · @${esc(v.ownerHandle)}</div>
          </div>
          <span class="plate-badge">${esc(formatPlate(v.plate, v.plateBlurred))}</span>
        </div>`).join('')}
      ${searchResults.length === 0 ? `<div class="empty-hint">${esc(t.noResults)}</div>` : ''}
    </div>`;
  }

  const posts = App.data.posts.map(p => `
    <div class="post-card">
      <div class="post-header">
        <div class="avatar-circle"></div>
        <div class="post-header-info">
          <div class="post-name">@${esc(p.ownerHandle)}</div>
          <div class="post-time">${esc(p.time)}</div>
        </div>
        <button class="btn-outline" onclick="App.openVehicle('${p.vehicleId}')">${esc(t.viewProfileBtn)}</button>
      </div>
      <div class="post-text">${esc(p.text)}</div>
      <div class="post-photo placeholder-tile">photo véhicule</div>
      <div class="post-actions"><span>♥ ${p.likes}</span><span>💬 ${p.comments}</span></div>
    </div>`).join('');

  return `
    <div style="margin-bottom:24px;">
      <input id="input-search" class="search-input" value="${esc(s.searchQuery)}" oninput="App.onSearchChange(this.value)" placeholder="${esc(t.searchPlaceholder)}" />
    </div>
    ${resultsBlock}
    <div class="section-header">
      <div class="section-title">${esc(t.feedTitle)}</div>
      <button class="btn-primary" onclick="App.goCreateVehicle()">${esc(t.addVehicleBtn)}</button>
    </div>
    ${posts}`;
}

function renderCreateVehicle() {
  const t = T(), s = App.state;
  const submitDisabled = !(s.formRgpdConsent && s.formPlate && s.formMake);
  return `
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:24px;">
      <span class="back-link" onclick="App.goFeed()">${esc(t.backToFeed)}</span>
    </div>
    <h2 class="page-title">${esc(t.createVehicleTitle)}</h2>
    <div class="form-card">
      <div class="form-photo placeholder-tile">${esc(t.addPhotosPlaceholder)}</div>

      <label class="form-label">${esc(t.plateFieldLabel)}</label>
      <input id="input-form-plate" class="form-input mono" value="${esc(s.formPlate)}" oninput="App.onFormPlateChange(this.value)" placeholder="AA-123-BB" />

      <div class="form-row">
        <div>
          <label class="form-label">${esc(t.makeFieldLabel)}</label>
          <input id="input-form-make" class="form-input" value="${esc(s.formMake)}" oninput="App.onFormMakeChange(this.value)" placeholder="BMW" />
        </div>
        <div>
          <label class="form-label">${esc(t.modelFieldLabel)}</label>
          <input id="input-form-model" class="form-input" value="${esc(s.formModel)}" oninput="App.onFormModelChange(this.value)" placeholder="M3 Touring" />
        </div>
        <div class="form-year">
          <label class="form-label">${esc(t.yearFieldLabel)}</label>
          <input id="input-form-year" class="form-input" value="${esc(s.formYear)}" oninput="App.onFormYearChange(this.value)" placeholder="2023" />
        </div>
      </div>

      <label class="form-label">${esc(t.descFieldLabel)}</label>
      <textarea id="input-form-desc" class="form-input form-textarea" oninput="App.onFormDescriptionChange(this.value)" placeholder="${esc(t.descPlaceholder)}">${esc(s.formDescription)}</textarea>

      <div class="privacy-block">
        <div class="privacy-title">${esc(t.confidentialityTitle)}</div>
        <div class="privacy-row">
          <div><div class="privacy-row-title">${esc(t.plateBlurLabel)}</div><div class="privacy-row-sub">Seuls les 2 premiers caractères restent visibles</div></div>
          <div class="toggle-switch ${s.formPlateBlur ? 'on' : ''}" onclick="App.toggleFormPlateBlur()"><div class="toggle-knob"></div></div>
        </div>
        <div class="privacy-row">
          <div><div class="privacy-row-title">${esc(t.privateProfileLabel)}</div><div class="privacy-row-sub">Visible uniquement par tes abonnés approuvés</div></div>
          <div class="toggle-switch ${s.formPrivate ? 'on' : ''}" onclick="App.toggleFormPrivate()"><div class="toggle-knob"></div></div>
        </div>
        <div class="privacy-row">
          <div><div class="privacy-row-title">${esc(t.disableSearchLabel)}</div><div class="privacy-row-sub">Ton véhicule n'apparaîtra pas dans les résultats de recherche par plaque</div></div>
          <div class="toggle-switch ${s.formDisableSearch ? 'on' : ''}" onclick="App.toggleFormDisableSearch()"><div class="toggle-knob"></div></div>
        </div>
      </div>

      <div class="rgpd-box">
        <div class="rgpd-inner">
          <input type="checkbox" ${s.formRgpdConsent ? 'checked' : ''} onchange="App.toggleFormRgpd()" style="margin-top:2px; flex-shrink:0;" />
          <div class="rgpd-text">${esc(t.rgpdText)}</div>
        </div>
      </div>

      <button class="btn-primary" ${submitDisabled ? 'disabled' : ''} onclick="App.submitVehicle()">${esc(t.publishBtn)}</button>
    </div>`;
}

function renderVehicleProfile() {
  const t = T(), s = App.state;
  const v = findVehicle(s.selectedVehicleId) || App.data.vehicles[0];
  const plateDisplay = formatPlate(v.plate, v.plateBlurred);
  const isOwn = !!v.isOwn;

  let settingsPanel = '';
  if (isOwn && s.showVehicleSettings) {
    settingsPanel = `
    <div class="settings-panel">
      <div class="settings-title">${esc(t.privacySettingsTitle)}</div>
      <div class="settings-row">
        <div class="privacy-row-title">${esc(t.plateBlurLabel)}</div>
        <div class="toggle-switch ${v.plateBlurred ? 'on' : ''}" onclick="App.toggleSelPlateBlur()"><div class="toggle-knob"></div></div>
      </div>
      <div class="settings-row">
        <div class="privacy-row-title">${esc(t.privateProfileLabel)}</div>
        <div class="toggle-switch ${v.isPrivate ? 'on' : ''}" onclick="App.toggleSelPrivate()"><div class="toggle-knob"></div></div>
      </div>
      <div class="settings-row last">
        <div class="privacy-row-title">${esc(t.disableSearchLabel)}</div>
        <div class="toggle-switch ${v.disableSearch ? 'on' : ''}" onclick="App.toggleSelDisableSearch()"><div class="toggle-knob"></div></div>
      </div>
      <span class="delete-link" onclick="App.deleteVehicle()">${esc(t.deleteVehicleBtn)}</span>
    </div>`;
  }

  const mods = (v.mods || []).map(m => `
    <div class="mod-item">
      <div class="mod-item-left"><div class="mod-dot"></div><div class="mod-title">${esc(m.title)} — <span class="mod-pro">${esc(m.pro)}</span></div></div>
      <span class="mod-date">${esc(m.date)}</span>
    </div>`).join('');

  const gallery = Array.from({ length: 8 }).map(() => `<div class="gallery-item placeholder-tile"></div>`).join('');

  return `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
      <span class="back-link" onclick="App.goFeed()">${esc(t.backToFeed)}</span>
      ${isOwn ? `<span class="back-link" style="border:1px solid #2a2a2a; padding:7px 12px; border-radius:5px;" onclick="App.toggleVehicleSettings()">${esc(t.privacySettingsBtn)}</span>` : ''}
    </div>
    ${settingsPanel}
    <div class="vehicle-card">
      <div class="vehicle-hero placeholder-tile">
        photo véhicule — plein cadre
        <div class="vehicle-hero-fade"></div>
        <div class="vehicle-hero-info">
          <span class="plate-badge-lg">${esc(plateDisplay)}</span>
          ${v.plateBlurred ? `<span class="blur-badge">🔒 plaque partiellement floutée</span>` : ''}
        </div>
      </div>
      <div class="vehicle-body">
        <div class="vehicle-title-row">
          <div>
            <h2 class="vehicle-title">${esc(v.make)} ${esc(v.model)}</h2>
            <div class="vehicle-sub">${esc(v.year)} · ${esc(v.tagline)} · ${esc(v.city)}</div>
          </div>
          ${isOwn ? `<span class="own-badge">${esc(t.ownVehicleBadge)}</span>` : `<button class="btn-follow">${esc(t.followBtn)}</button>`}
        </div>
        <div class="vehicle-owner-row">
          <div class="vehicle-owner-avatar"></div>
          <div class="vehicle-owner-text">par <strong style="color:#fff;">@${esc(v.ownerHandle)}</strong> · ${v.followers} ${esc(t.followersWord)}</div>
        </div>
        <div class="stats-row">
          <div><div class="stat-value">${v.modsCount}</div><div class="stat-label">${esc(t.modsLabel)}</div></div>
          <div><div class="stat-value">${v.photosCount}</div><div class="stat-label">${esc(t.photosLabel)}</div></div>
          <div><div class="stat-value">${v.prosCount}</div><div class="stat-label">${esc(t.prosLinkedLabel)}</div></div>
        </div>
      </div>
      <div class="vehicle-desc">${esc(v.description)}</div>
      <div class="mod-history">
        <div class="mod-history-title">${esc(t.modHistoryTitle)}</div>
        ${mods}
      </div>
      <div class="gallery-section">
        <div class="gallery-title">${esc(t.galleryTitle)}</div>
        <div class="gallery-grid">${gallery}</div>
      </div>
    </div>`;
}

function renderOwner() {
  const t = T();
  const u = App.currentUser;
  const myVehicles = App.data.vehicles.filter(v => v.isOwn);
  const items = myVehicles.map(v => `
    <div class="result-card" onclick="App.openVehicle('${v.id}')">
      <div class="result-thumb placeholder-tile" style="width:70px;height:70px;"></div>
      <div class="result-info">
        <div class="result-title">${esc(v.make)} ${esc(v.model)}</div>
        <div class="result-sub">${esc(v.year)} · ${v.followers} abonnés · ${v.modsCount} modifs</div>
      </div>
      <span class="plate-badge">${esc(formatPlate(v.plate, v.plateBlurred))}</span>
    </div>`).join('');

  return `
    <div class="owner-header">
      <div class="owner-avatar"></div>
      <div class="owner-info">
        <h2 class="owner-name">${esc(u.name)}</h2>
        <div class="owner-meta">@${esc(u.handle)} · ${esc(u.city)}</div>
        <div class="owner-bio">${esc(u.bio)}</div>
      </div>
      <div class="owner-stats">
        <div><div class="owner-stat-value">${u.followers}</div><div class="owner-stat-label">${esc(t.followersStat)}</div></div>
        <div><div class="owner-stat-value">${u.following}</div><div class="owner-stat-label">${esc(t.followingStat)}</div></div>
      </div>
    </div>
    <div class="section-header">
      <div class="section-title">${esc(t.myVehiclesTitle)}</div>
      <button class="btn-primary" onclick="App.goCreateVehicle()">${esc(t.addVehicleBtn)}</button>
    </div>
    ${items}`;
}

function renderProDirectory() {
  const t = T(), s = App.state;
  const cat = s.proFilterCategory || 'all';
  const city = (s.proFilterCity || '').toLowerCase().trim();
  const filtered = App.data.pros.filter(p => (cat === 'all' || p.category === cat) && (!city || p.city.toLowerCase().includes(city)));

  const categories = ['Covering', 'Carrosserie', 'Détailing', 'Préparation', 'Vente de véhicules'];
  const cards = filtered.map(p => `
    <div class="pro-card" onclick="App.openPro('${p.id}')">
      <div class="pro-card-photo placeholder-tile"></div>
      <div class="pro-card-body">
        <div class="pro-card-name">${esc(p.name)}</div>
        <div class="pro-card-category">${esc(p.category)}</div>
        <div class="pro-card-meta">${esc(p.city)} · ★ ${p.rating} (${p.reviewsCount} avis)</div>
      </div>
    </div>`).join('');

  return `
    <h2 class="page-title">${esc(t.proDirTitle)}</h2>
    <div class="pro-filters">
      <select class="select-input" onchange="App.onProCategoryChange(this.value)">
        <option value="all" ${cat === 'all' ? 'selected' : ''}>${esc(t.categoryAllOpt)}</option>
        ${categories.map(c => `<option value="${esc(c)}" ${cat === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
      </select>
      <input class="text-input" value="${esc(s.proFilterCity)}" oninput="App.onProCityChange(this.value)" placeholder="${esc(t.cityPlaceholder)}" />
    </div>
    <div class="pro-grid">${cards}</div>
    ${filtered.length === 0 ? `<div class="empty-hint">${esc(t.noProResults)}</div>` : ''}`;
}

function renderProProfile() {
  const t = T(), s = App.state;
  const pro = findPro(s.selectedProId) || App.data.pros[0];
  const gallery = Array.from({ length: 8 }).map(() => `<div class="gallery-item placeholder-tile"></div>`).join('');
  const reviews = (pro.reviews || []).map(r => `
    <div class="review-card">
      <div class="review-header"><span class="review-author">${esc(r.author)}</span><span class="review-rating">★ ${r.rating}</span></div>
      <div class="review-text">${esc(r.text)}</div>
    </div>`).join('');

  return `
    <span class="back-link" onclick="App.goProDirectory()">${esc(t.backToDirectory)}</span>
    <div class="pro-cover placeholder-tile"></div>
    <div class="pro-header-row">
      <div>
        <h2 class="pro-header-name">${esc(pro.name)}</h2>
        <div class="pro-header-category">${esc(pro.category)}</div>
        <div class="pro-header-meta">${esc(pro.city)} · ★ ${pro.rating} (${pro.reviewsCount} avis)</div>
      </div>
      <button class="btn-quote" onclick="App.goQuoteForm()">${esc(t.requestQuoteBtn)}</button>
    </div>
    <div class="pro-desc">${esc(pro.description)}</div>
    <div class="block-title">${esc(t.portfolioTitle)}</div>
    <div class="gallery-grid" style="margin-bottom:32px;">${gallery}</div>
    <div class="block-title">${esc(t.reviewsTitle)}</div>
    ${reviews}`;
}

function renderQuoteForm() {
  const t = T(), s = App.state;
  const pro = findPro(s.selectedProId) || App.data.pros[0];
  const myVehicles = App.data.vehicles.filter(v => v.isOwn);
  const options = myVehicles.map(v => `<option value="${v.id}" ${s.quoteVehicleId === v.id ? 'selected' : ''}>${esc(v.make)} ${esc(v.model)}</option>`).join('');

  return `
    <span class="back-link" onclick="App.goProProfileBack()">${esc(t.cancelBtn)}</span>
    <h2 class="page-title" style="margin-top:16px; margin-bottom:6px;">${esc(t.quoteFormTitle)}</h2>
    <div class="quote-form-subtitle">${esc(t.quoteFormSubtitlePrefix)} <strong>${esc(pro.name)}</strong></div>
    <div class="quote-form-card">
      <label class="form-label">${esc(t.vehicleFieldLabel)}</label>
      <select class="form-input" style="margin-bottom:18px;" onchange="App.onQuoteVehicleChange(this.value)">${options}</select>
      <label class="form-label">${esc(t.serviceFieldLabel)}</label>
      <input id="input-quote-service" class="form-input" value="${esc(s.quoteService)}" oninput="App.onQuoteServiceChange(this.value)" placeholder="${esc(t.servicePlaceholder)}" />
      <label class="form-label">${esc(t.detailsFieldLabel)}</label>
      <textarea id="input-quote-details" class="form-input form-textarea" style="height:100px;" oninput="App.onQuoteMessageChange(this.value)" placeholder="${esc(t.detailsPlaceholder)}">${esc(s.quoteMessage)}</textarea>
      <button class="btn-primary" style="padding:13px 22px; font-size:14px; border-radius:6px;" onclick="App.submitQuote()">${esc(t.sendRequestBtn)}</button>
    </div>`;
}

function renderQuotes() {
  const t = T();
  const cards = App.data.quoteRequests.map(q => {
    const steps = t.stepLabels.map((label, i) => `
      <div class="step">
        <div class="step-bar ${i <= q.status ? 'done' : ''}"></div>
        <div class="step-label ${i <= q.status ? 'done' : ''}">${esc(label)}</div>
      </div>`).join('');
    return `
    <div class="quote-card">
      <div class="quote-card-top">
        <div>
          <div class="quote-service">${esc(q.service)}</div>
          <div class="quote-meta">${esc(q.proName)} · pour ${esc(q.vehicleName)}</div>
        </div>
        <span class="btn-message" onclick="App.goMessages()">${esc(t.messageBtn)}</span>
      </div>
      <div class="steps-row">${steps}</div>
    </div>`;
  }).join('');

  return `<h2 class="page-title">${esc(t.myQuotesTitle)}</h2>${cards}`;
}

function renderProDashboard() {
  const t = T(), s = App.state;
  const biz = App.data.myProBusiness;
  const statusBgMap = ['#2a2115', '#152a2a', '#152a1c', '#1c1c1c'];
  const statusColorMap = ['#e0a94a', '#4ac2c2', '#4ae06f', '#999'];

  const leads = App.data.leadsData.map(l => {
    const canAdvance = l.status < 3;
    const advanceLabel = t.advanceLabels[Math.min(l.status, 2)];
    return `
    <div class="lead-card">
      <div class="lead-top">
        <div>
          <div class="lead-service">${esc(l.service)}</div>
          <div class="lead-meta">${esc(l.clientHandle)} · ${esc(l.vehicleName)}</div>
        </div>
        <span class="status-pill" style="background:${statusBgMap[l.status]}; color:${statusColorMap[l.status]};">${esc(t.statusLabelMap[l.status] || t.statusLabelMap[3])}</span>
      </div>
      ${canAdvance ? `<button class="btn-advance" onclick="App.advanceLead('${l.id}')">${esc(advanceLabel)}</button>` : ''}
    </div>`;
  }).join('');

  return `
    <h2 class="page-title" style="margin-bottom:4px;">${esc(t.dashboardTitlePrefix)} ${esc(biz.name)}</h2>
    <div class="dashboard-subtitle">${esc(t.dashboardSubtitle)}</div>
    <div class="dashboard-stats">
      <div class="dashboard-stat-card"><div class="dashboard-stat-value">${biz.newLeadsCount}</div><div class="dashboard-stat-label">${esc(t.newLeadsStat)}</div></div>
      <div class="dashboard-stat-card"><div class="dashboard-stat-value">${biz.completedCount}</div><div class="dashboard-stat-label">${esc(t.completedStat)}</div></div>
      <div class="dashboard-stat-card"><div class="dashboard-stat-value">★ ${biz.rating}</div><div class="dashboard-stat-label">${biz.reviewsCount} ${esc(t.reviewsStat)}</div></div>
    </div>
    <div class="relation-model-card">
      <div class="relation-model-title">${esc(t.relationModelTitle)}</div>
      <div class="relation-model-subtitle">${esc(t.relationModelSubtitle)}</div>
      <div class="model-options">
        <div class="model-option ${s.commissionModel === 'commission' ? 'selected' : ''}" onclick="App.selectCommissionModel()">
          <div class="model-option-title">${esc(t.commissionTitle)}</div>
          <div class="model-option-desc">${esc(t.commissionDesc)}</div>
        </div>
        <div class="model-option ${s.commissionModel === 'lead' ? 'selected' : ''}" onclick="App.selectLeadModel()">
          <div class="model-option-title">${esc(t.leadTitle)}</div>
          <div class="model-option-desc">${esc(t.leadDesc)}</div>
        </div>
      </div>
    </div>
    <div class="block-title">${esc(t.incomingLeadsTitle)}</div>
    ${leads}`;
}

function renderMessages() {
  const t = T(), s = App.state;
  const activeConv = App.data.conversationsData.find(c => c.id === s.selectedConversationId) || App.data.conversationsData[0];
  const convItems = App.data.conversationsData.map(c => `
    <div class="conv-item ${c.id === s.selectedConversationId ? 'active' : ''}" onclick="App.openConversation('${c.id}')">
      <div class="conv-item-top"><div class="conv-avatar"></div><div class="conv-name">${esc(c.name)}</div></div>
      <div class="conv-lastmsg">${esc(c.messages[c.messages.length - 1].text)}</div>
    </div>`).join('');

  const bubbles = activeConv.messages.map(m => `<div class="msg-bubble ${m.from === 'me' ? 'me' : 'them'}">${esc(m.text)}</div>`).join('');

  return `
    <div class="messages-panel">
      <div class="conv-list">${convItems}</div>
      <div class="chat-panel">
        <div class="chat-header">${esc(activeConv.name)}</div>
        <div class="chat-messages">${bubbles}</div>
        <div class="chat-input-row">
          <input id="input-chat" class="chat-input" value="${esc(s.messageDraft)}" oninput="App.onMessageDraftChange(this.value)" placeholder="${esc(t.messagePlaceholder)}" />
          <button class="btn-send" onclick="App.sendMessage()">${esc(t.sendBtn)}</button>
        </div>
      </div>
    </div>`;
}

function renderView() {
  const v = App.state.view;
  if (v === 'feed') return renderFeed();
  if (v === 'createVehicle') return renderCreateVehicle();
  if (v === 'vehicle') return renderVehicleProfile();
  if (v === 'owner') return renderOwner();
  if (v === 'proDirectory') return renderProDirectory();
  if (v === 'proProfile') return renderProProfile();
  if (v === 'quoteForm') return renderQuoteForm();
  if (v === 'quotes') return renderQuotes();
  if (v === 'proDashboard') return renderProDashboard();
  if (v === 'messages') return renderMessages();
  return renderFeed();
}

// ---------- Root render ----------
function render() {
  const root = document.getElementById('app');
  const active = document.activeElement;
  const activeId = active && active.id;
  const selStart = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
  const selEnd = active && typeof active.selectionEnd === 'number' ? active.selectionEnd : null;

  root.innerHTML = App.state.hasOnboarded
    ? `<div class="app-shell">${renderSidebar()}<div class="main-content"><div class="content-inner">${renderView()}</div></div></div>`
    : renderOnboarding();

  if (activeId) {
    const el = document.getElementById(activeId);
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      el.focus();
      if (selStart !== null && el.setSelectionRange) {
        try { el.setSelectionRange(selStart, selEnd); } catch (e) { /* no-op */ }
      }
    }
  }
}

window.App = App;
document.addEventListener('DOMContentLoaded', render);
