# Breast Cancer Warriors (BCW) Gambia

A high-performance, secure, and compassionate platform dedicated to breast cancer awareness, survivor advocacy, and treatment support in **The Gambia**.

This site is built with **Eleventy (11ty)** and **Tailwind CSS**, designed to share survivor stories and facilitate life-saving donations through integrated payment gateways.

---

## 🎗️ Project Overview

- **Organization:** Breast Cancer Warriors (Reg: 2025/C25004)
- **Mission:** To provide education, early detection services, and financial aid to cancer fighters.
- **Live URL:** [https://sirret.github.io/breast-cancer-site-final](https://sirret.github.io/breast-cancer-site-final)
- **Location:** Imam Omar Sowe Avenue, The Gambia.

## 🚀 Tech Stack

- **SSG:** [Eleventy (11ty) v3.0+](https://www.11ty.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (using the Typography plugin)
- **Images:** `@11ty/eleventy-img` for automated WebP/AVIF generation.
- **Payments:** Custom integrations for **PayPal**, **Stripe**, and **ModemPay**.
- **Templating:** Nunjucks (`.njk`) for logic and layouts.

---

## 🛠️ Development & Setup

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install

2. Environment Configuration

The project uses dotenv to manage sensitive API keys. Create a .env file in the root:
Code snippet

PAYPAL_CLIENT_ID=your_paypal_id
MODEMPAY_PUBLIC_KEY=your_modempay_key

3. Local Development

Run the following command to start the development server with hot-reloading:
Bash

npm start

    Note: The server is configured to run on port 8888 via HTTPS (using localhost.pem) to satisfy the security requirements of the PayPal and Stripe SDKs.

4. Build for Production

To generate the static site in the _site folder:
Bash

npm run build

📖 Managing Survivor Stories

The stories are data-driven, allowing you to add new survivors without touching HTML templates.
How to add a new story:

    Add the Image: Place the survivor's photo in src/assets/img/stories/.

    Update the Data: Open src/_data/stories.json (or src/stories/stories.json).

    Append a new object to the array using this format:
    JSON

    {
      "id": 17,
      "title": "Name: Hero's Journey",
      "image": "/assets/img/stories/filename.jpg",
      "excerpt": "A short preview of the story for the listing page...",
      "link": "survivor-name-story",
      "fullText": "The complete narrative of the survivor..."
    }

The site will automatically generate a new page at /stories/survivor-name-story/ and add it to the "Stories" listing page.
📂 Project Structure
Plaintext

├── src/
│   ├── _data/          # Global data (site.json, survivor stories, API keys)
│   ├── _includes/      # Shared layouts (layout.njk)
│   ├── css/            # Tailwind entry point (style.css)
│   ├── js/             # Donation logic and UI interactions
│   ├── stories/        # Dynamic survivor story templates & data
│   └── *.html          # Main pages (About, Contact, Donate, etc.)
├── .eleventy.js        # 11ty configuration & image shortcodes
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Build scripts and dependencies

🔒 Security & Optimization

    Content Security Policy (CSP): The project implements a strict CSP via .eleventy.js headers to allow secure communication with payment processors while blocking unauthorized scripts.

    Image Optimization: Images are automatically resized and converted to next-gen formats (AVIF/WebP) using a custom async shortcode:
    Code snippet

    {% image { src: "/path/to/img.jpg", alt: "Description", class: "rounded-xl" } %}

    SEO & Metadata: Includes automated sitemap.xml and robots.txt generation, with OpenGraph tags pre-configured in the base layout.

🤝 Support

For inquiries regarding partnerships or medical fund management, please contact us at breastcancerwarriors4@gmail.com.
```
