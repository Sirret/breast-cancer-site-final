// js/donate-logic.js

const STATE = {
	pageLoadTime: Date.now(),
	paypalRendered: false,
	modemPayTimeout: null,
};

/**
 * TAB LOGIC
 * Handles switching between PayPal, ModemPay, and Bank Transfer
 * Updated with ARIA support and fixed ID targeting
 */
function openTab(event, tabName) {
	const contents = document.querySelectorAll('.tab-content');
	contents.forEach((c) => {
		c.classList.remove('tab-block');
		c.classList.add('tab-hidden');
		// Accessibility: Hide panels from screen readers
		c.setAttribute('hidden', '');
	});

	const buttons = document.querySelectorAll('.tab-trigger');
	buttons.forEach((b) => {
		b.classList.remove(
			'active-pill-blue',
			'active-pill-pink',
			'active-pill-slate',
		);
		// Accessibility: Mark buttons as unselected
		b.setAttribute('aria-selected', 'false');
	});

	const target = document.getElementById(tabName);
	if (target) {
		target.classList.replace('tab-hidden', 'tab-block');
		target.removeAttribute('hidden');
	}

	const symbol = document.getElementById('currency-symbol');
	const currentBtn = event.currentTarget;

	// Accessibility: Mark active button
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
	// If PayPal script isn't loaded yet, retry in 500ms
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

	// 3. ModemPay Logic
	const modemBtn = document.getElementById('modempay-button');
	modemBtn?.addEventListener('click', function () {
		const amount =
			parseFloat(document.getElementById('donation-input').value) || 0;

		if (amount < 50) {
			showToast('Minimum D50 donation', '⚠️');
			return;
		}

		if (typeof window.ModemPayCheckout !== 'function') {
			showToast('Payment system loading...', '⏳');
			return;
		}

		const originalText = this.innerHTML;
		this.disabled = true;
		this.innerHTML = `<span class="inline-block animate-spin mr-2" aria-hidden="true">🌀</span> SECURING...`;

		STATE.modemPayTimeout = setTimeout(() => {
			if (this.disabled) {
				this.disabled = false;
				this.innerHTML = originalText;
			}
		}, 30000);

		try {
			const modal = ModemPayCheckout({
				amount: amount,
				public_key:
					'pk_test_bc03965d81b422862f1e9cc9547ab84f9cf9eb1100d49efe07359f8b10cea2e3',
				currency: 'GMD',
				payment_methods: 'wallet',
				callback: (transaction) => {
					clearTimeout(STATE.modemPayTimeout);
					if (transaction.status === 'success') {
						showToast('Thank you!', '✅');
						window.location.href = getSuccessUrl();
					} else {
						this.disabled = false;
						this.innerHTML = originalText;
						showToast('Payment failed.', '❌');
					}
				},
				onClose: () => {
					clearTimeout(STATE.modemPayTimeout);
					this.disabled = false;
					this.innerHTML = originalText;
				},
			});

			if (modal && typeof modal.show === 'function') {
				modal.show();
			}
		} catch (e) {
			console.error('ModemPay Error:', e);
			this.disabled = false;
			this.innerHTML = originalText;
			showToast('Error opening payment', '❌');
		}
	});

	// FIX: Default view now targets the correct ID
	document.getElementById('tab-paypal')?.click();
});
