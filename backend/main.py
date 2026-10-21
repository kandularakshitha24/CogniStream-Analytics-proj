
import csv
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


# Resolve paths relative to the project root.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

app = FastAPI(
    title="CogniStream Analytics API",
    description=(
        "Explore synthetic developer activity, team flow patterns, "
        "source changes, and candidate IDE sessions."
    ),
    version="1.0.0",
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def convert_value(value: str) -> Any:
    """Convert CSV values to appropriate JSON-compatible types."""
    value = value.strip()

    if value == "":
        return None

    if value.lower() == "true":
        return True

    if value.lower() == "false":
        return False

    try:
        return int(value)
    except ValueError:
        pass

    try:
        return float(value)
    except ValueError:
        return value


def read_report(filename: str) -> list[dict[str, Any]]:
    """Read a processed CSV report and return its rows."""
    file_path = PROCESSED_DIR / filename

    if not file_path.is_file():
        raise HTTPException(
            status_code=503,
            detail=f"Analytics report is unavailable: {filename}",
        )

    try:
        with file_path.open(
            mode="r",
            encoding="utf-8-sig",
            newline="",
        ) as file:
            reader = csv.DictReader(file)
            return [
                {
                    key: convert_value(value)
                    for key, value in row.items()
                    if key is not None
                }
                for row in reader
            ]
    except (OSError, csv.Error) as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Could not read analytics report: {filename}",
        ) from exc


def paginate(
    rows: list[dict[str, Any]],
    limit: int,
    offset: int,
) -> dict[str, Any]:
    """Return a page of results with pagination metadata."""
    return {
        "count": len(rows),
        "limit": limit,
        "offset": offset,
        "data": rows[offset:offset + limit],
    }


@app.get("/")
def root():
    """Return basic API information."""
    return {
        "project": "CogniStream",
        "message": "CogniStream Analytics API is running.",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health_check():
    """Check whether the API is responding."""
    return {
        "status": "healthy",
        "service": "cognistream-api",
    }


@app.get("/developers")
def get_developers(
    team: Optional[str] = None,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
):
    """Get developer activity summaries, optionally filtered by team."""
    rows = read_report("developer_activity_summary.csv")

    if team:
        rows = [
            row for row in rows
            if str(row.get("team", "")).lower() == team.lower()
        ]

    return paginate(rows, limit, offset)


@app.get("/sources")
def get_sources():
    """Get activity summaries for GitHub, Slack, Jira, and IDE."""
    rows = read_report("source_activity_summary.csv")
    return {"count": len(rows), "data": rows}


@app.get("/teams")
def get_teams():
    """Get team activity summaries."""
    rows = read_report("team_activity_summary.csv")
    return {"count": len(rows), "data": rows}


@app.get("/team-flow")
def get_team_flow():
    """Get team source-change metrics."""
    rows = read_report("team_flow_summary.csv")
    return {"count": len(rows), "data": rows}


@app.get("/sessions")
def get_sessions(
    developer_id: Optional[str] = None,
    candidates_only: bool = False,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
):
    """Get IDE session summaries, optionally filtered by developer."""
    rows = read_report("ide_session_summary.csv")

    if developer_id:
        rows = [
            row for row in rows
            if str(row.get("developer_id", "")).lower()
            == developer_id.lower()
        ]

    if candidates_only:
        rows = [
            row for row in rows
            if row.get("candidate_focus_session") is True
        ]

    return paginate(rows, limit, offset)


@app.get("/context-switches")
def get_context_switches(
    developer_id: Optional[str] = None,
    team: Optional[str] = None,
):
    """Get source-change and event-gap metrics."""
    rows = read_report("context_switch_summary.csv")

    if developer_id:
        rows = [
            row for row in rows
            if str(row.get("developer_id", "")).lower()
            == developer_id.lower()
        ]

    if team:
        rows = [
            row for row in rows
            if str(row.get("team", "")).lower() == team.lower()
        ]

    return {"count": len(rows), "data": rows}
