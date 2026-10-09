/* Gestion de copropriétés — comportements de la démonstration (aucune donnée n'est enregistrée). */
(function () {
  'use strict';

  var DEFAULT_TOAST = 'Démonstration : action non enregistrée';

  var STAFF = {
    'gestion@demo.fr': { role: 'gestionnaire', name: 'Claire MARTIN', label: 'Gestionnaire', twoFactor: false },
    'compta@demo.fr': { role: 'comptable', name: 'Julien ROBERT', label: 'Comptable', twoFactor: true },
    'direction@demo.fr': { role: 'dirigeant', name: 'Hélène FAURE', label: 'Dirigeante', twoFactor: true },
    'admin@demo.fr': { role: 'administrateur', name: 'Thomas GIRARD', label: 'Administrateur', twoFactor: false }
  };
  var OWNERS = {
    'marie.dupont@demo.fr': { id: 'marie', name: 'Marie DUPONT', lot: 'Lot C1', cs: false },
    'linh.nguyen@demo.fr': { id: 'linh', name: 'Linh NGUYEN', lot: 'Lot C3 · conseil syndical', cs: true }
  };

  /* --- Stockage local (tolérant si indisponible) --- */
  function load(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* ignoré */ } }
  function drop(key) { try { window.localStorage.removeItem(key); } catch (e) { /* ignoré */ } }

  function currentStaff() { return STAFF[load('demo.staff')] || STAFF['gestion@demo.fr']; }
  function currentOwner() { return OWNERS[load('demo.owner')] || OWNERS['marie.dupont@demo.fr']; }

  /* --- Toast --- */
  var region;
  function toast(message) {
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    var item = document.createElement('div');
    item.className = 'toast';
    item.textContent = message || DEFAULT_TOAST;
    region.appendChild(item);
    setTimeout(function () { item.classList.add('leaving'); }, 2800);
    setTimeout(function () { if (item.parentNode) { item.parentNode.removeChild(item); } }, 3200);
  }
  window.demoToast = toast;

  function each(selector, fn, root) {
    Array.prototype.forEach.call((root || document).querySelectorAll(selector), fn);
  }

  /* --- Identité affichée --- */
  function applyIdentity() {
    var staff = currentStaff();
    each('[data-staff-name]', function (el) { el.textContent = staff.name; });
    each('[data-staff-role]', function (el) { el.textContent = staff.label; });
    each('[data-if-role]', function (el) {
      el.hidden = el.getAttribute('data-if-role').split(' ').indexOf(staff.role) === -1;
    });
    each('[data-unless-role]', function (el) {
      el.hidden = el.getAttribute('data-unless-role').split(' ').indexOf(staff.role) !== -1;
    });

    var owner = currentOwner();
    each('[data-owner-name]', function (el) { el.textContent = owner.name; });
    each('[data-owner-lot]', function (el) { el.textContent = owner.lot; });
    each('[data-user]', function (el) { el.hidden = el.getAttribute('data-user') !== owner.id; });
    each('[data-cs-only]', function (el) { el.hidden = !owner.cs; });
    each('[data-not-cs]', function (el) { el.hidden = owner.cs; });
  }

  /* --- Connexion cabinet --- */
  function setupStaffLogin() {
    var form = document.getElementById('staff-login');
    if (!form) { return; }
    var step1 = document.getElementById('login-step-1');
    var step2 = document.getElementById('login-step-2');
    var codeForm = document.getElementById('staff-2fa');
    var error1 = document.getElementById('login-error');
    var error2 = document.getElementById('code-error');
    var pending = null;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = form.elements.email.value.trim().toLowerCase();
      var account = STAFF[email];
      if (!account || !form.elements.password.value) {
        error1.textContent = 'Compte de démonstration inconnu. Utilisez gestion@demo.fr ou compta@demo.fr.';
        error1.hidden = false;
        return;
      }
      error1.hidden = true;
      if (account.twoFactor) {
        pending = email;
        step1.hidden = true;
        step2.hidden = false;
        document.getElementById('code-email').textContent = email;
        codeForm.elements.code.focus();
      } else {
        save('demo.staff', email);
        window.location.href = 'immeubles.html';
      }
    });

    codeForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var code = codeForm.elements.code.value.replace(/\s/g, '');
      if (!/^\d{6}$/.test(code)) {
        error2.textContent = 'Saisissez les 6 chiffres affichés par votre application (en démonstration, tout code à 6 chiffres est accepté).';
        error2.hidden = false;
        return;
      }
      save('demo.staff', pending);
      window.location.href = 'immeubles.html';
    });

    var back = document.getElementById('login-back');
    if (back) {
      back.addEventListener('click', function () {
        step2.hidden = true;
        step1.hidden = false;
        error2.hidden = true;
        form.elements.email.focus();
      });
    }
  }

  /* --- Connexion extranet --- */
  function setupOwnerLogin() {
    var form = document.getElementById('owner-login');
    if (!form) { return; }
    var error = document.getElementById('login-error');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = form.elements.email.value.trim().toLowerCase();
      if (!OWNERS[email] || !form.elements.password.value) {
        error.textContent = 'Compte de démonstration inconnu. Utilisez marie.dupont@demo.fr ou linh.nguyen@demo.fr.';
        error.hidden = false;
        return;
      }
      save('demo.owner', email);
      window.location.href = 'compte.html';
    });
    each('[data-fill-login]', function (button) {
      button.addEventListener('click', function () {
        form.elements.email.value = button.getAttribute('data-fill-login');
        form.elements.password.value = 'Demo-syndic-2026';
        form.elements.email.focus();
      });
    });
  }

  /* --- Actions de démonstration --- */
  function setupActions() {
    document.addEventListener('click', function (event) {
      var logout = event.target.closest('[data-logout]');
      if (logout) {
        drop(logout.getAttribute('data-logout') === 'owner' ? 'demo.owner' : 'demo.staff');
        return;
      }

      var opener = event.target.closest('[data-dialog-open]');
      if (opener) {
        var dialog = document.getElementById(opener.getAttribute('data-dialog-open'));
        if (dialog && typeof dialog.showModal === 'function') { dialog.showModal(); }
        return;
      }
      var closer = event.target.closest('[data-dialog-close]');
      if (closer) {
        closer.closest('dialog').close();
        return;
      }

      var copy = event.target.closest('[data-copy]');
      if (copy) {
        var source = document.getElementById(copy.getAttribute('data-copy'));
        var text = source ? source.textContent : '';
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () { toast('Texte copié dans le presse-papiers'); },
            function () { toast('Copie impossible : sélectionnez le texte manuellement'); });
        } else {
          toast('Copie impossible ici : sélectionnez le texte manuellement');
        }
        return;
      }

      var action = event.target.closest('[data-demo]');
      if (!action) { return; }
      event.preventDefault();
      if (action.getAttribute('aria-disabled') === 'true') { return; }

      var required = action.getAttribute('data-requires-role');
      if (required && required.split(' ').indexOf(currentStaff().role) === -1) {
        toast(action.getAttribute('data-role-message') ||
          'Action réservée au comptable : reconnectez-vous avec compta@demo.fr');
        return;
      }

      toast(action.getAttribute('data-toast') || DEFAULT_TOAST);

      var reveal = action.getAttribute('data-reveal');
      if (reveal) {
        var target = document.getElementById(reveal);
        if (target) { target.hidden = false; }
      }

      var done = action.getAttribute('data-done');
      if (done) {
        action.textContent = done;
        action.setAttribute('aria-disabled', 'true');
        var chipText = action.getAttribute('data-chip-text');
        var row = chipText && action.closest('tr, li, .card');
        var chip = row && row.querySelector('[data-chip]');
        if (chip) {
          chip.textContent = chipText;
          chip.className = 'chip chip-success';
        }
      }
    });

    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form.hasAttribute('data-demo-form')) { return; }
      event.preventDefault();
      toast(form.getAttribute('data-toast') || DEFAULT_TOAST);
      if (form.hasAttribute('data-reset')) { form.reset(); }
    });
  }

  /* --- Onglets accessibles --- */
  function setupTabs() {
    each('[role="tablist"]', function (list) {
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) { panel.hidden = !on; }
        });
        if (focus) { tab.focus(); }
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab, false); });
        tab.addEventListener('keydown', function (event) {
          var next = null;
          if (event.key === 'ArrowRight') { next = tabs[(i + 1) % tabs.length]; }
          if (event.key === 'ArrowLeft') { next = tabs[(i - 1 + tabs.length) % tabs.length]; }
          if (event.key === 'Home') { next = tabs[0]; }
          if (event.key === 'End') { next = tabs[tabs.length - 1]; }
          if (next) { event.preventDefault(); select(next, true); }
        });
      });
      var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      if (initial) { select(initial, false); }
    });
  }

  applyIdentity();
  setupStaffLogin();
  setupOwnerLogin();
  setupActions();
  setupTabs();
}());
