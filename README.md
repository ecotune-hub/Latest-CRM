# CRM Mapping App

A modern CRM with mapping and route-planning features.

## Features

- Add/manage contacts with addresses
- Geocoding (Mapbox) to plot contacts on a map
- Plan routes between selected contacts
- Visualize everything on Mapbox

## Stack

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React + Mapbox GL JS

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
npm install
```

### 2. Set up environment

Create a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/crm_map
MAPBOX_TOKEN=your_mapbox_token
```

For React (in `client/.env`):

```
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

### 3. Start backend and frontend

```bash
npm run dev
```

- Backend runs on port 5000
- Frontend runs on port 3000

### 4. Usage

- Go to `http://localhost:3000`
- Add contacts, select two or more, and click "Plan Route" to see directions.

---

**You can expand this app with:**
- Authentication
- Advanced filtering/searching
- Notes/activities per contact
- Export/import features
- Custom contact fields
