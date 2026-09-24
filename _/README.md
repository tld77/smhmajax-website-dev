# Sankat Mochan Hanuman Mandir Website 🛕

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=flat&logo=google&logoColor=white)
![Deployment](https://github.com/Raj200727/smhmajax-website/actions/workflows/deploy.yml/badge.svg)

A production-style digital presence and management platform for Sankat Mochan Hanuman Mandir (Ajax, Ontario).

The platform utilizes a hybrid architecture, combining a lightweight static frontend with a serverless Google Apps Script backend and a Google Sheets database. It features a fully integrated online Seva booking system, automated payment processing via the PayPal SDK, and an automated two-stage deployment pipeline to Hostinger via GitHub Actions.

**[Live Website →](https://smhmajax.ca)**

---

## What it does

The project provides:

- Automated Seva & Puja bookings linked directly to Google Sheets.
- Live PayPal checkout integration (Sandbox and Live).
- Chronological, responsive photo galleries with year-filtering.
- 3-column directory for 16 Hindu Samskars, Pujas, and Special Occasions.
- Infinite-loop event poster slider with automatic advancement.
- Two-stage CI/CD deployment pipeline to Sandbox and Production environments.

---

## Core Technologies

- **Frontend:** HTML5, CSS3, Vanilla JavaScript.
- **Backend Bridge:** Google Apps Script (hosted externally — not included in this repo for security).
- **Database:** Google Sheets (real-time slot availability and transaction logging).
- **Payments:** PayPal SDK.
- **Hosting & CI/CD:** Hostinger LiteSpeed Web Server, GitHub Actions FTP Deployment.

---

## System Architecture

The application is split into three discrete layers to bypass CORS restrictions without a heavy traditional server.

```text
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│                                                         │
│  HTML5 / CSS3 / Vanilla JS                              │
│  - Custom CSS Grid Gallery                              │
│  - Interactive Booking Calendar (donate.html)            │
│  - PayPal Checkout Modal                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ JSONP Requests
                   ▼
┌─────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                      │
│                                                         │
│  Google Apps Script (hosted externally)                  │
│  - Handles JSONP bridging and duplicate checks          │
│  - Triggers Admin email confirmations                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Data Read / Write
                   ▼
┌─────────────────────────────────────────────────────────┐
│                       DATA LAYER                        │
│                                                         │
│  Google Sheets                                          │
│  - Master Transaction Logging                           │
│  - Real-time Slot Availability Tracking                 │
└─────────────────────────────────────────────────────────┘
```

> **Note:** The Google Apps Script backend is maintained separately and not included in this repository, as its deployed URL serves as an unauthenticated write endpoint to the booking database. Contact the admin team for access.

## Core Features

### 1. Online Seva Booking Engine (`donate.html`)
*   **Interactive Calendar Grid:** Devotees select dates and sponsorship types (Archana, Mala, Vastra, Priti Bhoj) from a live calendar that shows real-time availability synced with Google Sheets.
*   **PayPal Integration:** Secure checkout via PayPal SDK with order ID tracking, duplicate-booking prevention, and admin email confirmations.
*   **Admin Panel:** Password-protected modal for manually adding cash or e-transfer bookings directly to the sheet.

### 2. Pujas & Bookings Directory (`bookings.html`)
*   **3-Column Responsive Grid:** Displays 16 Hindu Samskars, Pujas & Paaths, and Special Occasions side-by-side on desktop, collapsing seamlessly to a single column on mobile screens.
*   **Contact CTAs:** Direct call, WhatsApp, and online booking links for Pandit Rabindranath Tiwari.

### 3. Event Poster Slider (`events.html`)
*   **Infinite-Loop Carousel:** Seamless continuous scrolling through event posters with no snap-back, using cloned slides and silent repositioning on transition end.
*   **Auto-Advancement:** Posters cycle automatically every 4 seconds with manual arrow navigation.

### 4. Event Gallery System (`gallery.html`)
*   **Responsive Photo Grid:** Utilizes CSS Grid to dynamically fit images across screen sizes.
*   **Year Filtering:** Filter gallery images by event year.
*   **Performance:** Uses the `loading="lazy"` attribute to ensure fast page load times despite housing a large number of high-resolution images.

### 5. CI/CD Deployment Pipeline (`deploy.yml`)
The project utilizes a two-stage GitHub Actions FTP pipeline to deploy code seamlessly without manual FTP uploads:
*   **Stage 1 (Sandbox):** Commits pushed to the `main` branch automatically deploy to the testing environment (`testsmhmajax.com`) using dedicated `TEST_FTP_` GitHub Secrets.
*   **Stage 2 (Production):** A manual approval gate deploys the validated code to the live `smhmajax.ca` domain.

### 6. Branding & Design System
*   **Visual Assets:** Features the official Mandir logo (`mandir-icon.png`) in the navigation and a Canadian flag SVG (`ca.svg`) in the hero section.
*   **Custom CSS Variables:** Relies on a strict color palette, including `--crimson-dk`, `--ivory`, and `--gold`, to maintain aesthetic consistency across all pages.

---

## Project Structure

```text
smhmajax-website/
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  # Two-stage FTP deploy (test → prod)
│
├── assets/
│   ├── css/
│   │   └── style.css                   # Global stylesheet
│   ├── images/
│   │   ├── september/                  # Current month event posters
│   │   ├── 9 days/
│   │   ├── Hanuman Jayanti/
│   │   ├── Hanuman Ji Holi Shringar 2026/
│   │   ├── Krishna Janmashtami 2025/
│   │   ├── Mahashivratri 2024/
│   │   ├── Mahashivratri 2025/
│   │   ├── Mahashivratri 2026/
│   │   ├── Ram Navmi 2026/
│   │   ├── sita 2026/
│   │   ├── Vasant Panchmi 2024/
│   │   ├── Vasant Panchmi 2025/
│   │   ├── Vjaya Dashmi 2025/
│   │   ├── ca.svg                      # Canadian flag (hero section)
│   │   ├── mandir-icon.png             # Primary logo
│   │   ├── mandir-icon1.jpeg
│   │   ├── new_temple_pic.png
│   │   └── [Deity images: bal_hanuman, durga-maaa, ganesha-ji,
│   │        hanuman-ji, kal_bhairav, laddu__gopal, lakshmi-maa,
│   │        navagrah, radha_krishna, ram-ji, ram_darbar]
│   └── scripts/
│       └── main.js                     # All site JS (nav, slider, calendar, gallery)
│
├── about.html
├── bookings.html                       # Pujas & Samskars directory
├── contact.html
├── deities.html
├── donate.html                         # Donation page + Seva booking engine + PayPal
├── events.html                         # Event posters + weekly puja schedule
├── gallery.html
├── index.html
├── livestream.html
├── new-mandir.html
└── README.md
```

## Author
**Rajveer Sharma**  
GitHub: [Raj200727](https://github.com/Raj200727)

## Organization
**Sankat Mochan Hanuman Mandir & Cultural Centre**  
Ajax, Ontario, Canada  
Contact Pandit Rabindranath Tiwari: [416-846-0726](tel:4168460726) / [WhatsApp](https://wa.me/14168460726)  
Support/Admin: [donations@smhmajax.ca](mailto:donations@smhmajax.ca)