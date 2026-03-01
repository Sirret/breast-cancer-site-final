document.addEventListener('DOMContentLoaded', () => {
	const btn = document.getElementById('menu-toggle');
	const menu = document.getElementById('mobile-menu');
	const hamburger = document.getElementById('hamburger-icon');
	const closeIcon = document.getElementById('close-icon');

	if (btn && menu) {
		btn.addEventListener('click', () => {
			const isActive = menu.classList.toggle('active');
			btn.setAttribute('aria-expanded', isActive);

			if (isActive) {
				hamburger.classList.add('opacity-0', 'scale-0');
				closeIcon.classList.remove('opacity-0', 'scale-0');
				closeIcon.classList.add('opacity-100', 'scale-100');
			} else {
				hamburger.classList.remove('opacity-0', 'scale-0');
				closeIcon.classList.add('opacity-0', 'scale-0');
				closeIcon.classList.remove('opacity-100', 'scale-100');
			}
		});
	}
});
