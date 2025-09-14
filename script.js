function navigateTo(page) {
  window.location.href = page;
}

function togglePasswordVisibility() {
  const passwordField = document.getElementById('password');
  const eyeClosed = document.getElementById('eye-closed');
  const eyeOpen = document.getElementById('eye-open');
  
  if (passwordField && eyeClosed && eyeOpen) {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      eyeClosed.classList.add('hidden');
      eyeOpen.classList.remove('hidden');
    } else {
      passwordField.type = 'password';
      eyeClosed.classList.remove('hidden');
      eyeOpen.classList.add('hidden');
    }
  }
}

function addTailwind() {
  const tailwindScript = document.createElement('script');
  tailwindScript.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
  tailwindScript.defer = true;
  document.head.appendChild(tailwindScript);

  const link = document.createElement('link');
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const style = document.createElement('style');
  style.type = 'text/tailwindcss';
  style.innerHTML = `
    @theme {
      --color-blue: #00BFFF;
      --color-white: #f8fafc; /* slate-50 */
      --color-gray: #C6C6C6;
      --color-gray-2: oklch(87.58% 0.002 247.84); /* #D9D9D9 */
      --color-black: #020617;
      --color-red: oklch(0.6381 0.2217 26.19); /* #F53B3B */
      --color-background: #121826;
      --color-overlay: #000000;
      --light-blue: #18AEFF;  
      --dark-blue: #2777F0;
      --gradient-primary-r: to right, var(--light-blue), var(--dark-blue);
      --gradient-primary-b: to bottom, var(--light-blue), var(--dark-blue);
      --font-poppins: 'Poppins', sans-serif;
      --text-shadow-primary: 0px 4px 4px rgba(0,0,0,0.25);
    }

    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `;
  document.head.appendChild(style);
}

addTailwind()

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const content = sidebar.querySelector('.content');
  const overlay = sidebar.querySelector('.overlay');
  
  content.classList.add('transition-transform', 'duration-300');
  overlay.classList.add('transition-opacity', 'duration-300');

  sidebar.classList.remove('hidden');
  sidebar.classList.add('flex');

  setTimeout(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
    content.classList.remove('translate-x-full');
  }, 1);
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const content = sidebar.querySelector('.content');
  const overlay = sidebar.querySelector('.overlay');

  content.classList.add('translate-x-full');
  overlay.classList.remove('opacity-100');
  overlay.classList.add('opacity-0');

  setTimeout(() => {
    sidebar.classList.add('hidden');
  }, 300);
}

function openPopup(popupName) {
  const popup = document.getElementById(popupName);
  const content = popup.querySelector('.content');
  const overlay = popup.querySelector('.overlay');
  
  content.classList.add('transition-all', 'duration-200');
  overlay.classList.add('transition-opacity', 'duration-200');

  popup.classList.remove('hidden');
  popup.classList.add('flex');

  setTimeout(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
    content.classList.remove('scale-90', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 1);

  if(popupName === 'popup-confirmar-entrega') {
    closePopup('popup-info-reserva');
  } else if(popupName === 'popup-entrega-confirmada') {
    closePopup('popup-confirmar-entrega');
  }
}

function closePopup(popupName) {
  const popup = document.getElementById(popupName);
  const content = popup.querySelector('.content');
  const overlay = popup.querySelector('.overlay');

  overlay.classList.remove('opacity-100');
  overlay.classList.add('opacity-0');
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-90', 'opacity-0');

  setTimeout(() => {
    popup.classList.add('hidden');
  }, 200);
}

function realizarLogin(inputId) {
  const input = document.getElementById(inputId);
  const valor = input.value.toLowerCase().trim();

  if (valor === "gerente" || valor === "suporte") {
    localStorage.setItem("cargo", valor);
  } else {
    localStorage.removeItem("cargo");
  }

  navigateTo('home.html')

  // Dashboard ainda não está pronto
  // if (valor === "gerente" || valor === "suporte") {
  //   navigateTo('dashboard.html')
  // } else {
  //   navigateTo('home.html')
  // }
}

function filtrarPorCargo() {
  const cargoUsuario = localStorage.getItem("cargo");

  const cargos = ["gerente", "suporte"];
  const elementos = document.querySelectorAll(cargos.map(c => `.${c}`).join(","));

  elementos.forEach(el => {
    if (!cargoUsuario || !el.classList.contains(cargoUsuario)) {
      el.hidden = true;
    } else {
      el.hidden = false;
    }
  });
}

filtrarPorCargo();

function enableInputs(inputIds) {
  inputIds.forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (input) input.disabled = false;
  })
}

function disableInputs(inputIds) {
  inputIds.forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (input) input.disabled = true;
  })
}
