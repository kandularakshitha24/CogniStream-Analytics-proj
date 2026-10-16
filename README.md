
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

Python, Pandas, Polars, Apache Airflow, ClickHouse, FastAPI, React, Tremor.js, Git and GitHub.

## Project Structure

```text
CogniStream/
├── data/
│   ├── sample/
│   │   └── developers.csv
│   ├── raw/
│   │   └── developer_events.csv
│   └── processed/
│       └── developer_events_clean.csv
├── src/
│   ├── generate_events.py
│   ├── validate_events.py
│   ├── ingest_events.py
│   └── flow_analytics.py
├── README.md
└── requirements.txt
```

## Current Implementation

### Phase 1: Synthetic Data Generation and Ingestion

- Created a sample developer profiles dataset containing 10 developers across two teams.
- Generated 1,000 synthetic activity events.
- Simulated events from GitHub, Slack, Jira, and IDE sources.
- Implemented data validation for required fields, event IDs, timestamps, sources, and durations.
- Built an ingestion script to validate events, verify developer references, standardize timestamps, sort records, and attach team and role information.
- Exported the processed dataset as a CSV file.

### Data Validation Results

| Metric | Result |
|---|---:|
| Synthetic event records | 1,000 |
| Sample developers | 10 |
| Event sources | 4 |
| Processed dataset columns | 8 |
| Missing values in verified output | 0 |
| Validation errors in verified raw dataset | 0 |

### Dataset Files

- `data/sample/developers.csv`: Sample developer profiles.
- `data/raw/developer_events.csv`: Generated raw activity events.
- `data/processed/developer_events_clean.csv`: Validated and enriched activity records.

## Setup and Execution

Python 3.11 or a compatible version is recommended.

Install the current dependency:

```bash
python -m pip install pandas
```

Run the pipeline from the project root directory in this order:

```bash
python src/generate_events.py
python src/validate_events.py
python src/ingest_events.py
```

## Project Status

- Phase 1: Synthetic data generation, validation, and ingestion implemented.
- Phase 2: Polars-based processing and ClickHouse storage planned.
- Future phases: Airflow orchestration, flow-state analytics, FastAPI integration, and React dashboard development.

## Data Privacy and Limitations

The initial implementation uses synthetic activity data and does not require access to real employee accounts. Generated activity patterns are for development and testing; they are not direct measurements of real employee productivity or cognitive load.

## Future Enhancements

- Transform and analyze data using Polars.
- Store and query events using ClickHouse.
- Automate pipeline execution with Apache Airflow.
- Develop flow-state and context-switching metrics.
- Expose aggregated analytics through FastAPI.
- Build an interactive dashboard with React and Tremor.js.
