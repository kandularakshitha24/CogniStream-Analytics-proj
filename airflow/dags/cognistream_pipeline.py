from datetime import datetime

from airflow import DAG
from airflow.providers.standard.operators.bash import BashOperator

PROJECT_DIR = "/mnt/c/Users/kandu/OneDrive/Documents/Cognistream"
PROJECT_PYTHON = "/home/kandu/cognistream_venv/bin/python"

with DAG(
    dag_id="cognistream_analytics_pipeline",
    description="Generate, validate, ingest, and analyze CogniStream developer events",
    start_date=datetime(2026, 10, 23),
    schedule=None,
    catchup=False,
    tags=["cognistream", "analytics"],
) as dag:

    generate_events = BashOperator(
        task_id="generate_events",
        bash_command=f'cd "{PROJECT_DIR}" && "{PROJECT_PYTHON}" src/generate_events.py',
    )

    validate_events = BashOperator(
        task_id="validate_events",
        bash_command=f'cd "{PROJECT_DIR}" && "{PROJECT_PYTHON}" src/validate_events.py',
    )

    ingest_events = BashOperator(
        task_id="ingest_events",
        bash_command=f'cd "{PROJECT_DIR}" && "{PROJECT_PYTHON}" src/ingest_events.py',
    )

    flow_analytics = BashOperator(
        task_id="flow_analytics",
        bash_command=f'cd "{PROJECT_DIR}" && "{PROJECT_PYTHON}" src/flow_analytics.py',
    )

    team_analytics = BashOperator(
        task_id="team_analytics",
        bash_command=f'cd "{PROJECT_DIR}" && "{PROJECT_PYTHON}" src/team_analytics.py',
    )

    focus_sessions = BashOperator(
        task_id="focus_sessions",
        bash_command=f'cd "{PROJECT_DIR}" && "{PROJECT_PYTHON}" src/focus_sessions.py',
    )

    generate_events >> validate_events >> ingest_events
    ingest_events >> [flow_analytics, team_analytics, focus_sessions]
