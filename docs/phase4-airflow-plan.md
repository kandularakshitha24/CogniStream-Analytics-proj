# Phase 4: Airflow Orchestration Plan

## Objective
Prepare CogniStream for scheduled, repeatable analytics pipeline execution.

## Existing Pipeline
- Generate synthetic developer activity events.
- Validate event structure and data quality.
- Process events and calculate analytics.
- Insert only new events into ClickHouse.
- Serve analytics through the FastAPI backend.
- Display analytics in the React dashboard.

## Planned Orchestration
1. Configure Apache Airflow in a compatible environment.
2. Create a DAG for event validation and ingestion.
3. Add task dependencies and useful failure logs.
4. Test task execution and retry behavior.
5. Verify that repeated runs do not insert duplicate events.
6. Document setup and execution instructions.

## Validation Checklist
- [ ] Airflow starts successfully.
- [ ] The DAG is discovered by Airflow.
- [ ] Pipeline tasks execute in the correct order.
- [ ] Failed tasks provide useful logs.
- [ ] Repeated runs preserve ingestion idempotency.
- [ ] Existing API and dashboard tests continue to pass.

## Current Status
Planning documented. Airflow implementation and runtime validation remain pending.
