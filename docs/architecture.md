# CogniStream System Architecture

## Data Sources
- Mock GitHub events
- Mock Slack notifications
- Mock Jira issue updates
- Mock IDE activity events

## Data Pipeline
1. Python extraction scripts generate or retrieve activity events.
2. Apache Airflow schedules the ingestion and processing tasks.
3. Polars cleans, validates and transforms event data.
4. ClickHouse stores timestamped events and supports analytical queries.
5. FastAPI exposes aggregated analytics through REST endpoints.
6. React and Tremor-style components display metrics, trends and interruption timelines.

## Core Analytics
- Total activity events
- Estimated uninterrupted focus duration
- Number of potential interruptions
- Context-switching frequency
- Team-level activity comparisons

## Important Assumption
Focus duration and interruption metrics are estimates derived from recorded events. They are not direct measurements of a developer's cognitive state.