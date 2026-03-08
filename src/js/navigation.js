document.addEventListener('DOMContentLoaded', () => {
	const btn = document.getElementById('menu-toggle');
	const menu = document.getElementById('mobile-menu');
	const hamburger = document.getElementById('hamburger-icon');
	const closeIcon = document.getElementById('close-icon');

	function openMenu() {
		menu.style.display = 'flex';
		// Force reflow so transition fires
		menu.getBoundingClientRect();
		menu.classList.add('active');
		btn.setAttribute('aria-expanded', 'true');
		hamburger.classList.add('opacity-0', 'scale-0');
		closeIcon.classList.remove('opacity-0', 'scale-0');
		closeIcon.classList.add('opacity-100', 'scale-100');
		// Move focus to first link
		const firstLink = menu.querySelector('a');
		if (firstLink) firstLink.focus();
		// Prevent body scroll while overlay is open
		document.body.style.overflow = 'hidden';
	}

	function closeMenu() {
		menu.classList.remove('active');
		btn.setAttribute('aria-expanded', 'false');
		hamburger.classList.remove('opacity-0', 'scale-0');
		closeIcon.classList.add('opacity-0', 'scale-0');
		closeIcon.classList.remove('opacity-100', 'scale-100');
		document.body.style.overflow = '';
		// Hide after transition completes
		menu.addEventListener(
			'transitionend',
			() => {
				if (!menu.classList.contains('active')) {
					menu.style.display = 'none';
				}
			},
			{ once: true },
		);
		btn.focus();
	}

	if (btn && menu) {
		btn.addEventListener('click', () => {
			if (menu.classList.contains('active')) {
				closeMenu();
			} else {
				openMenu();
			}
		});

		// Close on Escape key
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && menu.classList.contains('active')) {
				closeMenu();
			}
		});
	}
});
