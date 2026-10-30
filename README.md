# CogniStream: Developer Flow-State & Cognitive Load Analytics

## Overview

CogniStream is an end-to-end developer activity analytics platform. It processes synthetic, privacy-safe activity events from GitHub, Slack, Jira, and IDE sources to explore developer workflows, potential context switching, and focus-session indicators.

## Technology Stack

- **Language:** Python 3.11
- **Data processing:** Polars, Pandas
- **Workflow orchestration:** Apache Airflow, Docker Compose
- **Database:** ClickHouse
- **Backend:** FastAPI, Uvicorn
- **Frontend:** React, TypeScript, Vite
- **Visualization:** Recharts
- **Version control:** Git and GitHub

## Dataset

- 1,000 synthetic activity events
- 10 developers
- 2 teams
- 4 sources: GitHub, Slack, Jira, and IDE
- 8 columns in the processed event dataset

Processed dataset: `data/processed/developer_events_clean.csv`

## Architecture

1. Generate synthetic developer activity events.
2. Validate and process the generated data.
3. Ingest event records into ClickHouse.
4. Calculate developer, team, flow, and focus-session analytics.
5. Expose analytics through FastAPI.
6. Display results in the React dashboard.
7. Orchestrate the pipeline using Apache Airflow.

## Dashboard

The React dashboard provides four views:

- **Control Tower:** Overall project and activity metrics.
- **Activity Analytics:** Developer and source activity.
- **Team Comparisons:** Team-level activity and flow patterns.
- **Flow & Focus Sessions:** IDE sessions and context-switch indicators.

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `/` | Project information |
| `/health` | API health |
| `/clickhouse/health` | ClickHouse connectivity |
| `/developers` | Developer analytics |
| `/sources` | Source activity |
| `/teams` | Team analytics |
| `/team-flow` | Team flow comparisons |
| `/sessions` | Focus-session analytics |
| `/context-switches` | Context-switch analytics |

Interactive API documentation: `http://localhost:8000/docs`

## Run Locally

### 1. Set up Python

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

### 2. Run the data pipeline

Run from the project root:

```powershell
python src/generate_events.py
python src/validate_events.py
python src/ingest_events.py
python src/flow_analytics.py
python src/team_analytics.py
python src/focus_sessions.py
```

### 3. Start the backend

```powershell
python -m uvicorn backend.main:app --reload --port 8000
```

### 4. Start the frontend

In a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### 5. Start Airflow

Docker Desktop and Docker Compose are required.

From the project root:

```powershell
docker compose -f airflow/docker-compose.yaml up airflow-init
docker compose -f airflow/docker-compose.yaml up -d
docker compose -f airflow/docker-compose.yaml ps
```

Open `http://localhost:8080` and trigger `cognistream_analytics_pipeline`.

The DAG contains six tasks:

1. `generate_events`
2. `validate_events`
3. `ingest_events`
4. `flow_analytics`
5. `team_analytics`
6. `focus_sessions`

The first three tasks run sequentially. The three analytics tasks run in parallel after ingestion.

To stop the services:

```powershell
docker compose -f airflow/docker-compose.yaml down
```

## ClickHouse Configuration

The ClickHouse client supports these environment variables:

- `CLICKHOUSE_HOST`
- `CLICKHOUSE_USER`
- `CLICKHOUSE_PASSWORD`
- `CLICKHOUSE_HTTP_PORT` (default: 8123)
- `CLICKHOUSE_DATABASE` (default: `cognistream`)
- `CLICKHOUSE_SECURE` (default: false)

The event table is `cognistream.developer_events`. Configure credentials locally and never commit secrets.

## Testing

Run the Python test suite:

```powershell
python -m unittest discover -s tests -v
```

Build the frontend:

```powershell
cd frontend
npm run build
```

Validate the Airflow Compose configuration:

```powershell
docker compose -f airflow/docker-compose.yaml config -q
```

## Project Status

- [x] Synthetic data generation and validation
- [x] Data ingestion and ClickHouse integration
- [x] Developer, team, flow, and focus-session analytics
- [x] FastAPI backend
- [x] React dashboard
- [x] Six-task Airflow pipeline
- [x] API and ClickHouse API tests

## Privacy and Limitations

CogniStream uses synthetic activity data and does not monitor real employee accounts. Focus-session and context-switch indicators are estimates derived from event patterns. They are not direct measurements of productivity, attention, or cognitive state.