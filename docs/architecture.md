# CogniStream Architecture

## Overview

CogniStream is an end-to-end developer activity analytics platform built around synthetic activity events from GitHub, Slack, Jira, and IDE sources.

## System Workflow

1. **Data generation:** Python generates synthetic developer activity events.
2. **Validation:** Event records are checked for data quality and consistency.
3. **Ingestion:** Processed events are prepared and inserted into ClickHouse.
4. **Analytics:** Polars-based modules calculate developer activity, team patterns, flow metrics, and focus-session indicators.
5. **API layer:** FastAPI exposes analytical results through REST endpoints.
6. **Frontend:** React and TypeScript present the results in an interactive dashboard.
7. **Orchestration:** Apache Airflow coordinates the pipeline tasks.

## Airflow Workflow

The DAG `cognistream_analytics_pipeline` contains six tasks:

- `generate_events`
- `validate_events`
- `ingest_events`
- `flow_analytics`
- `team_analytics`
- `focus_sessions`

Generation, validation, and ingestion run sequentially. After ingestion, the three analytics tasks run as parallel branches.

## Main Components

| Component | Responsibility |
|---|---|
| Python scripts | Data generation, validation, ingestion, and analytics |
| Polars | Data transformation and analytical calculations |
| ClickHouse | Storage of developer activity events |
| Apache Airflow | Workflow scheduling and orchestration |
| FastAPI | Backend API and health endpoints |
| React dashboard | Visualization and interaction |

## Design Considerations

- Synthetic data avoids collecting real employee activity.
- Analytics focus on activity patterns rather than lines of code or ticket counts.
- Focus-session and context-switch indicators are estimates based on event timestamps and source transitions.
- The ClickHouse insertion helper checks existing event IDs before inserting records.