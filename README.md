# Employee Tracking App - Sprint 2

## 1. Project Information
* **Project Name:** [Your Project Name]
* **Group Members:** [Names of group members]
* **GitHub Repository:** [Link to your repo]
* **Sprint Branch:** `sprint-2`

---

## 2. Mockups
* **Location:** `/mockups/<page>`
* **Description:** Includes designs for **Tablet**, **Mobile** and **Laptop** views. Names of those mockups in folder indicate width.

---

* **`styles/default.css`**: Defines the global layout core. It uses a `flex-column` wrapper to ensure the footer stays at the bottom.
* **`styles/common.css`**: Manages shared UI components like the Header and Navigation. It features a **Mobile-First/Adaptive** menu: on screens below `768px`, the navigation links transform into a 2-column `display: grid` layout to provide large, touch-friendly tap targets.
* **`templates/lists/lists.css`**: Contains the "Smart View" logic. It uses `@media (min-width: 900px)` to toggle between an accordion-style list (mobile) and a split-pane side-panel view (desktop).
---

## 4. Project Pages & Navigation
The application starts at the index.html.

| Page | File | Responsive Implementation | JSON/Template Loading |
| :--- | :--- | :--- | :---: |
| **Login** | `login.html` | Uses `.login-container` with `display: flex`. On mobile (`max-width: 480px`), the login box switches to `width: 100%` with `20px` padding to prevent overflow. | Loads the `pages.login` object from `data.json`. Native validation for email/password fields. |
| **Dashboard** | `dashboard.html` | **Split-Screen Logic**: On desktop, `#map-panel` and `#workers-panel` share the space. Media query `@media (max-width: 768px)` hides the map (`display: none`), and the worker list takes 100% width. | Renders the worker list in a loop, mapping `workers[]` to `worker-row.html` components. |
| **Map** | `map.html` | |  |
| **Team Detail** | `team-detail.html` | **Adaptive View**: Above `900px`, it functions with `flex-direction: row` (list + preview). Below `900px`, it switches to a full-screen list where details (`#details-view`) remain hidden until JS applies an active class. | Dynamic mapping of `teams[].members` into a 2-column grid (`.info-grid`) within the worker card. |
| **Settings** | `settings.html` | **Absolute Overlay Pattern**: Two side-by-side panels on desktop (`flex: 1.2` vs `1`). On mobile (`max-width: 768px`), the right panel becomes an overlay (`position: absolute; z-index: 1000`) controlled by the `.show` class. | **Heavy Template Loading**: Generates forms based on `pages.settings`. Each section (Account/Appearance/Management) is a separate JSON payload injected into. |
---

## 5. HTML Form Validations

The application utilizes native HTML5 validation mechanisms that are injected dynamically by the rendering engine in `load-content.js`. The primary validation logic is handled by the `fillInputSpace` function, which maps data definitions from JSON or JS objects to DOM element attributes.

### Validation Engine Logic
The `fillInputSpace` function automatically configures form fields based on the provided data objects:
* **Required Fields**: The `required` attribute is added if the `required` flag in the data is set to `true`.
* **Data Typing**: The `type` attribute (e.g., `email`, `password`, `text`) is set dynamically, enabling built-in browser format validation.
* **Length Constraints**: The `minlength` attribute is applied to text and password fields to enforce minimum character counts.
* **Placeholder Support**: Dynamic placeholders are generated to guide user input.

### Implemented Validations Summary

| Location | Form | Validations Implemented | Source |
| :--- | :--- | :--- | :--- |
| `login.js` | **Authentication** | `required`, `type="text"`, `type="password"` | `renderLogin` constants |
| `settings.js` | **Change Password** | `required`, `type="password"`, `minlength="8"` | `data.json` (account) |
| `settings.js` | **Change Email** | `required`, `type="email"`, `type="password"` | `data.json` (account) |
| `settings.js` | **Add Worker** | `required`, `type="text"`, `type="email"` | `data.json` (management) |
| `settings.js` | **Register Admin** | `required`, `type="text"`, `type="email"`, `type="password"` | `data.json` (management) |
---


## 6. Data Source
* **Current Location:** Local JSON file (`/dummy_html/data.json`).
* **Future Compatibility:** The `fetchData()` utility is prepared to connect to a **Json-server** or **Strapi** by simply changing the `BASE_URL` constant.

---

## 7. How to run

- Change directory to dummy_html
- Use a local server (e.g., VSCode Live Server or **python3 -m http.server 'port'**)


No backend is required – this is a frontend prototype


**Test Credentials:**
* **Admin:** User: `admin` | Pass: `1234`
* **Worker:** User: `user` | Pass: `1234`

