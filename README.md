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

## Project Structure


---

## Templates Overview

### 1. Common Templates
Location: `templates/common/`

- `header.html` – Top navigation header
- `nav.html` – Sidebar navigation
- `footer.html` – Footer section
- `common.css` – Shared layout styling

### 2. List Components
Location: `templates/lists/`

- `input-space.html` – Input/search area
- `setting-button.html` – Reusable settings button
- `setting-item.html` – Settings entry component
- `worker-row-active.html` – Active worker row
- `worker-row-inactive.html` – Inactive worker row
- `lists.css` – List-specific styling

### 3. Map Template
- `templates/map.html` – Reusable map component

### 4. Search Component
- `templates/search.html` – Search bar component

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
