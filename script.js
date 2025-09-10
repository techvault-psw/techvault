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
      --color-white: #f8fafc;
      --color-gray: #C6C6C6;
      --color-gray-2: oklch(87.58% 0.002 247.84);
      --color-black: #020617;
      --color-red: oklch(0.6381 0.2217 26.19);
      --color-background: #121826;
      --light-blue: #18AEFF;
      --dark-blue: #2777F0;
      --gradient-primary-r: to right, var(--light-blue), var(--dark-blue);
      --gradient-primary-b: to bottom, var(--light-blue), var(--dark-blue);
      --font-poppins: 'Poppins', sans-serif;
      --text-shadow-primary: 0px 4px 4px rgba(0,0,0,0.25);
    }
  `;
  document.head.appendChild(style);
}

addTailwind()