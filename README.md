# CogniStream: Developer Flow-State & Cognitive Load Analytics

## Project Overview

CogniStream is a developer productivity analytics platform that analyzes simulated GitHub, Slack, Jira, and IDE activity events to identify coding-session indicators and potential context-switching interruptions.

## Problem Statement

Traditional productivity metrics, such as commits and tickets closed, do not reveal interruptions or the friction developers experience during focused work.

## Objectives

- Ingest activity events from multiple sources.
- Clean and transform event data using Python and Polars.
- Orchestrate data pipelines using Apache Airflow.
- Store timestamped events in ClickHouse.
- Analyze focus sessions and context-switching patterns.
- Display insights in a React dashboard.
- Serve aggregated metrics using FastAPI.

## Technology Stack

Python, Pandas, Polars, Apache Airflow, ClickHouse, FastAPI, Uvicorn, React, Tailwind CSS, Recharts, TypeScript, Vite, Git and GitHub.

## Project Structure

```text
CogniStream/
├── backend/
│   └── main.py                              # FastAPI analytics endpoints with CORS support
├── data/
│   ├── sample/
│   │   └── developers.csv                   # Sample developer profiles
│   ├── raw/
│   │   └── developer_events.csv             # Generated raw activity events
│   └── processed/
│       ├── developer_events_clean.csv       # Validated and enriched activity records
│       ├── developer_activity_summary.csv   # Per-developer metrics
│       ├── source_activity_summary.csv      # Source-level load breakdown
│       ├── team_activity_summary.csv        # Team-level activity metrics
│       ├── team_flow_summary.csv            # Cross-team source change metrics
│       ├── ide_session_summary.csv          # IDE session timeline & candidate focus tags
│       └── context_switch_summary.csv       # Rapid switch and inactivity gap metrics
├── frontend/
│   ├── package.json                         # React + Vite + Tailwind + Recharts
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── api/                             # Centralized API client & TypeScript interfaces
│       ├── components/                      # Navigation, KPI cards, filters, skeletons
│       ├── views/                           # Control Tower, Activity, Teams, Flow & Sessions
│       ├── App.tsx
│       └── main.tsx
├── src/
│   ├── generate_events.py                   # Synthetic event generation
│   ├── validate_events.py                   # Data quality validation gate
│   ├── ingest_events.py                     # Profile enrichment & normalization
│   ├── flow_analytics.py                    # Developer flow and gap analytics
│   └── team_analytics.py                    # Cross-team source transition analytics
├── README.md
└── requirements.txt
```

## Current Implementation

### Phase 1: Synthetic Data Generation and Ingestion
- Created a sample developer profiles dataset containing 10 developers across two teams.
- Generated 1,000 synthetic activity events across GitHub, Slack, Jira, and IDE sources.
- Implemented data validation for required fields, event IDs, timestamps, sources, and durations.
- Built an ingestion script to validate events, verify developer references, standardize timestamps, sort records, and attach team and role information.
- Exported the processed dataset as a CSV file.

### Phase 2: Flow Analytics & Team Metrics
- Implemented Polars-based time-series and window calculations (`flow_analytics.py` and `team_analytics.py`).
- Classified rapid source switches ($\le 15$ min) and inactivity gaps ($> 60$ min).
- Identified candidate focus sessions from IDE coding event continuity.

### Phase 3A: FastAPI Analytics Service
- Built REST API endpoints (`backend/main.py`) serving health, developer summaries, sources, teams, IDE sessions, and context-switching metrics.
- Configured CORS middleware for local frontend dashboard communication.

### Phase 3B: Premium Developer-Intelligence Dashboard
- Developed a production-grade dark control tower dashboard in React, TypeScript, Tailwind CSS, and Recharts.
- Implemented 4 dedicated views:
  1. **Control Tower (Overview)**: Executive KPIs, activity breakdown, team switch rates, and cognitive friction rankings.
  2. **Activity Analytics**: Tool share duration versus event counts and developer source breadth.
  3. **Team Comparisons**: Side-by-side Team A vs Team B metrics, stability index, and role matrix.
  4. **Flow & Focus Sessions**: Deep work IDE session logs with candidate focus filter, rapid switch tracking, and methodology guides.
- Added live backend connectivity indicator with auto-retry and multi-dimensional filters (Team, Developer, Candidate Focus Sessions).

## Setup and Execution

### 1. Backend Setup & Pipeline

Python 3.11 or a compatible version is recommended.

Install backend dependencies:

```bash
python -m pip install -r requirements.txt
```

Run the pipeline from the project root directory in this order:

```bash
python src/generate_events.py
python src/validate_events.py
python src/ingest_events.py
python src/flow_analytics.py
python src/team_analytics.py
```

Start the FastAPI analytics API:

```bash
uvicorn backend.main:app --reload --port 8000
```

The interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Dashboard Setup & Run

In a separate terminal, navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

Open your browser to:

```text
http://localhost:5173
```

To create an optimized production build:

```bash
cd frontend
npm run build
```

## Project Status

- [x] **Phase 1**: Synthetic data generation, validation, and ingestion.
- [x] **Phase 2**: Polars-based processing and flow analytics.
- [x] **Phase 3A**: FastAPI analytics endpoints and CORS support.
- [x] **Phase 3B**: Premium React and Tremor-styled developer-intelligence control tower dashboard.
- [ ] **Future phases**: Airflow pipeline orchestration and ClickHouse time-series storage.

## Data Privacy and Limitations

The implementation uses synthetic activity data and does not require access to real employee accounts. Generated activity patterns are for development and testing; they are not direct measurements of real employee productivity or cognitive load.
