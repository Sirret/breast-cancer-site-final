const STATE = {
	pageLoadTime: Date.now(),
	paypalRendered: false,
	modemPayTimeout: null,
};

/**
 * TAB LOGIC
 */
function openTab(event, tabName) {
	const contents = document.querySelectorAll('.tab-content');
	contents.forEach((c) => {
		c.classList.remove('tab-block');
		c.classList.add('tab-hidden');
		c.setAttribute('hidden', '');
	});

	const buttons = document.querySelectorAll('.tab-trigger');
	buttons.forEach((b) => {
		b.classList.remove(
			'active-pill-blue',
			'active-pill-pink',
			'active-pill-slate',
		);
		b.setAttribute('aria-selected', 'false');
	});

	const target = document.getElementById(tabName);
	if (target) {
		target.classList.replace('tab-hidden', 'tab-block');
		target.removeAttribute('hidden');
	}

	const symbol = document.getElementById('currency-symbol');
	const currentBtn = event.currentTarget;
	currentBtn.setAttribute('aria-selected', 'true');

	if (tabName === 'paypal-tab') {
		currentBtn.classList.add('active-pill-blue');
		symbol.innerText = '$';
		initPayPal();
	} else if (tabName === 'modem-tab') {
		currentBtn.classList.add('active-pill-pink');
		symbol.innerText = 'D';
	} else {
		currentBtn.classList.add('active-pill-slate');
		symbol.innerText = 'D';
	}
}

/**
 * UTILITIES
 */
function showToast(message, icon = '🎗️') {
	const toast = document.getElementById('toast');
	const msgElem = document.getElementById('toast-message');
	const iconElem = document.getElementById('toast-icon');
	if (!toast || !msgElem) return;

	msgElem.innerText = message;
	iconElem.innerText = icon;
	toast.classList.remove(
		'opacity-0',
		'translate-y-[-20px]',
		'pointer-events-none',
	);
	toast.classList.add('opacity-100', 'translate-y-0');

	setTimeout(() => {
		toast.classList.add(
			'opacity-0',
			'translate-y-[-20px]',
			'pointer-events-none',
		);
		toast.classList.remove('opacity-100', 'translate-y-0');
	}, 4000);
}

const getSuccessUrl = () => {
	const path = window.location.pathname;
	const base = path.includes('/donate/')
		? path.substring(0, path.indexOf('/donate/'))
		: '';
	return window.location.origin + base + '/thank-you/';
};

function copyBBAN() {
	const bbanText = document.getElementById('bban').innerText;
	navigator.clipboard.writeText(bbanText).then(() => {
		const btn = document.getElementById('copy-btn');
		const originalText = btn.innerText;
		btn.innerText = 'Copied!';
		showToast('Account number copied', '📋');
		setTimeout(() => (btn.innerText = originalText), 2000);
	});
}

/**
 * PAYPAL INTEGRATION
 */
function initPayPal() {
	if (!window.paypal) {
		setTimeout(initPayPal, 500);
		return;
	}
	if (STATE.paypalRendered) return;

	window.paypal
		.Buttons({
			onClick: (data, actions) => {
				const amount = parseFloat(
					document.getElementById('donation-input').value,
				);
				if (Date.now() - STATE.pageLoadTime < 1000)
					return actions.reject();
				if (!amount || amount < 5) {
					showToast('Minimum $5 donation', '⚠️');
					return actions.reject();
				}
				return actions.resolve();
			},
			createOrder: (data, actions) => {
				const amount = parseFloat(
					document.getElementById('donation-input').value,
				);
				return actions.order.create({
					purchase_units: [
						{
							description: 'Donation to Breast Cancer Warriors',
							amount: {
								currency_code: 'USD',
								value: amount.toFixed(2),
							},
						},
					],
				});
			},
			onApprove: (data, actions) =>
				actions.order.capture().then(() => {
					showToast('Success!', '✅');
					window.location.href = getSuccessUrl();
				}),
			onError: (err) => {
				console.error('PayPal Error:', err);
				showToast('PayPal connection lost', '❌');
			},
		})
		.render('#paypal-button-container');
	STATE.paypalRendered = true;
}

/**
 * INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
	// 1. Tab Listeners
	document.querySelectorAll('.tab-trigger').forEach((btn) => {
		btn.addEventListener('click', (e) =>
			openTab(e, btn.getAttribute('data-tab')),
		);
	});

	// 2. Utility Buttons
	document.getElementById('copy-btn')?.addEventListener('click', copyBBAN);
	document
		.getElementById('notify-insta-btn')
		?.addEventListener('click', () => {
			window.open(
				'https://instagram.com/breastcancerwarriors.gm',
				'_blank',
			);
		});

	/**
	 * MODEMPAY REDIRECT LOGIC
	 * Replaced modal logic with direct link redirect to avoid CSP blocks.
	 */
	const modemBtn = document.getElementById('modempay-button');
	modemBtn?.addEventListener('click', function () {
		const amount =
			parseFloat(document.getElementById('donation-input').value) || 0;

		if (amount < 50) {
			showToast('Minimum D50 donation', '⚠️');
			return;
		}

		// Change button state to show progress
		const originalText = this.innerHTML;
		this.disabled = true;
		this.innerHTML = `<span class="inline-block animate-spin mr-2" aria-hidden="true">🌀</span> REDIRECTING...`;

		// MODEMPAY REDIRECT
		// We use your test link. Note: If you want to pass the dynamic 'amount',
		// you would usually append it as a query parameter if ModemPay supports it,
		// otherwise, this link takes them to the set payment page.
		const testLink =
			'https://test.checkout.modempay.com/donate/abdc65af7ecb14088ded3422057d20ca2fe936f2d76aee8adff69dcdcf975623';

		// Small delay so the user sees the "Redirecting" state
		setTimeout(() => {
			window.location.href = testLink;
		}, 800);
	});

	// Default view
	document.getElementById('tab-paypal')?.click();
});
