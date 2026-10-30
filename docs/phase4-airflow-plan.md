# Phase 4: Apache Airflow Orchestration

## Objective

Automate the CogniStream analytics workflow using Apache Airflow and Docker Compose.

## Implementation Status

<badge color="success">Implementation completed</badge>

The Airflow environment and six-task analytics DAG have been implemented.

## DAG Information

**DAG ID:** `cognistream_analytics_pipeline`

**DAG file:** `airflow/dags/cognistream_pipeline.py`

### Tasks

1. `generate_events`: Generates synthetic activity events.
2. `validate_events`: Validates generated event records.
3. `ingest_events`: Processes and inserts event records into ClickHouse.
4. `flow_analytics`: Calculates developer flow metrics.
5. `team_analytics`: Produces team-level analytics.
6. `focus_sessions`: Calculates candidate focus-session metrics.

### Task Dependencies

The first three tasks execute sequentially:

`generate_events` → `validate_events` → `ingest_events`

After ingestion, the following tasks execute as parallel branches:

- `flow_analytics`
- `team_analytics`
- `focus_sessions`

## Execution

Initialize the Airflow environment:

```powershell id="x9z8y7"
docker compose -f airflow/docker-compose.yaml up airflow-init
```

Start the services:

```powershell id="m8n6v4"
docker compose -f airflow/docker-compose.yaml up -d
```

Check service status:

```powershell id="j5c3b2"
docker compose -f airflow/docker-compose.yaml ps
```

Open the Airflow web interface at `http://localhost:8080`.

Locate `cognistream_analytics_pipeline`, trigger a DAG run, and inspect the status of all six tasks.

## Validation

The DAG has previously completed successfully with all six tasks green.

Additional validation includes:

- Python API and ClickHouse API tests.
- ClickHouse event-count and duplicate checks.
- Docker Compose configuration validation.

A direct ClickHouse database test requires connection environment variables to be configured.

## Conclusion

Phase 4 establishes automated orchestration for the CogniStream data and analytics pipeline. Airflow coordinates generation, validation, ingestion, and parallel analytics tasks.