document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;
  
    const moonIcon = toggleButton.querySelector('.fa-moon');
    const sunIcon = toggleButton.querySelector('.fa-sun');
    const currentTheme = localStorage.getItem('theme');
  
    if (currentTheme === 'dark') {
      document.body.classList.add('dark');
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'inline-block';
    } else {
      moonIcon.style.display = 'inline-block';
      sunIcon.style.display = 'none';
    }
  
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      let theme = 'light';
      if (document.body.classList.contains('dark')) {
        theme = 'dark';
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
      } else {
        moonIcon.style.display = 'inline-block';
        sunIcon.style.display = 'none';
      }
      localStorage.setItem('theme', theme);
    });
  });
  