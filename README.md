# SafeOps – Worker Safety Monitoring Dashboard

## Team Members
- **Kacper Klasen**  
- **Veronika Vlková**  
- **Francesco Picotto**  

---

## Project Description

**SafeOps** is a web-based dashboard designed to monitor worker safety in real time across hazardous environments.

The system provides:
- Live visualization of worker locations on a map
- Worker and team management
- Real-time status monitoring
- Configuration and simulation settings
- Worker creation and profile management

The project focuses on delivering a functional prototype that allows operations managers and safety supervisors to monitor and manage personnel efficiently. With target users:
- Operations Managers  
- Safety Supervisors  

---

## Key Goals

1. Visualize worker locations on a live map  
2. Detect distress situations rapidly  
3. Create a functional and interactive prototype  

---

## Functional Requirements

### 1. Authentication
- User login page
- Secure entry point for supervisors and managers

### 2. Worker Dashboard
- Side-by-side layout: worker list + map
- Team grouping
- Real-time status indicators
- Collapsible worker list (collapsed / semi-collapsed view)

### 3. Map View
- Expanded full-screen map mode
- Visualization of worker positions
- Spatial awareness of site activity

### 4. Team Management
- List of teams
- Expandable team entries
- Individual worker detail preview
- Active/inactive worker states

### 5. Worker Management
- Worker detail page
- Add new worker (creation form)
- Profile and assigned data management

### 6. Settings
- System configuration panel
- Simulation parameter control
- Toggle switches and configurable options

---

## Storyboard & Navigation Flow

The complete navigation flow of the application is documented in:

`mockups/storyboard/storyboard.png`

Additional storyboard breakdowns are available in:

- `dashboard_collapsing.png`
- `dashboard_to_map_nav.png`
- `login_to_dashboard.png`
- `map_to_settings_nav.png`
- `settings_to_team-detail_nav.png`
- `team-detail_collapsing.png`
- `team-detail_to_creation-page_footer.png`

The storyboard illustrates:

- Login → Dashboard transition
- Dashboard collapsing behavior
- Navigation between Dashboard, Map, Settings and Team Detail
- Transition from Team Detail to Worker Creation
- Sidebar and footer navigation flows

---

## HTML Pages → Mockups Mapping

| HTML Page | Corresponding Mockup |
|------------|----------------------|
| `pages/login.html` | `Login_mockup.png` |
| `pages/dashboard.html` | `Workers_Dashboard_collapsed_mockup.png` |
| `pages/dashboard.html` | `Workers_Dashboard_semicollapsed_mockup.png` |
| `pages/map.html` | `Map_page_mockup.png` |
| `pages/settings.html` | `Settings_mockup.png` |
| `pages/team-detail.html` | `Team_detail_mockup.png` |
| `pages/team-detail.html` | `Team_detail_worker_mockup.png` |
| `pages/create-worker.html` | `Creation_Page_mockup.png` |

---

## Templates Overview

The project uses a modular template structure. Common components are dynamically included using `xlu-include-file.js`, allowing reuse across multiple pages.

---

### Common Templates  
**Location:** `templates/common/`  
**Loaded in:** all pages  

These components define the global layout structure of the application.

- `header.html` – Top navigation bar  
- `nav.html` – Sidebar navigation menu  
- `footer.html` – Footer section  
- `common.css` – Shared layout and global styling  

---

### List Components  
**Location:** `templates/lists/`  

Reusable UI components related to lists, workers, and settings.

- `input-space.html`  
  → Used in:  
  - `pages/create-worker.html`  
  - `pages/login.html`  
  - `pages/team-detail.html`  
  - `templates/search.html`  

- `setting-button.html`  
  → Used in:  
  - `pages/settings.html`  

- `setting-item.html`  
  → Used in:  
  - `pages/settings.html`  

- `worker-row-active.html`  
  → Used in:  
  - `pages/dashboard.html`  
  - `pages/team-detail.html`  

- `worker-row-inactive.html`  
  → Used in:  
  - `pages/dashboard.html`  
  - `pages/team-detail.html`  

- `lists.css` – Styling specific to list components  

---

### Map Template  
**Location:** `templates/map.html`  

Reusable map component responsible for rendering the worker location view.

→ Used in:  
- `pages/dashboard.html`  
- `pages/map.html`  

---

### Search Component  
**Location:** `templates/search.html`  

Reusable search bar component integrated within dashboard views.

→ Used in:  
- `pages/dashboard.html`  

---

## Styling (CSS)

Styling is modularized:

- `default.css` – Base styles
- Page-specific CSS files inside `/styles`
- `common.css` – Shared layout styling
- `lists.css` – Styling for list components

Each page imports:
- `default.css`
- Required page-specific CSS
- Required template CSS

---

## Technical Details

### Frontend
- Pure HTML5
- Modular CSS structure
- Reusable template components

### JavaScript
- `xlu-include-file.js`
  - Handles dynamic inclusion of HTML templates
  - Enables component-based structure without backend templating

### Layout Design
- Responsive dashboard layout
- Collapsible sidebar behavior
- Component reuse via template includes

---

## How to Run

1. Use a local server (e.g., VSCode Live Server or python3 -m http.server 'port')

No backend is required – this is a frontend prototype

---