# CogniStream Data Dictionary

## Dataset Overview

The processed dataset contains 1,000 synthetic developer activity events from 10 developers, two teams, and four sources.

Processed file: `data/processed/developer_events_clean.csv`

## Dataset Columns

| Column | Description |
|---|---|
| `event_id` | Unique identifier assigned to an activity event |
| `developer_id` | Identifier of the synthetic developer who generated the event |
| `timestamp` | Date and time when the activity event occurred |
| `source` | Activity source: GitHub, Slack, Jira, or IDE |
| `event_type` | Type of activity recorded |
| `duration_minutes` | Duration associated with the event, in minutes |
| `team` | Team associated with the developer |
| `role` | Role assigned to the synthetic developer |

## Data Characteristics

- Total records: 1,000
- Developers: 10
- Teams: 2
- Sources: 4
- Columns: 8

## Analytical Concepts

**Developer activity:** Summarizes activity events by developer.

**Source activity:** Compares activity across GitHub, Slack, Jira, and IDE.

**Context switching:** Identifies rapid transitions between activity sources using the project's configured time threshold.

**Focus-session candidates:** Identifies potential uninterrupted IDE activity periods. These are estimates derived from event patterns, not direct measurements of attention or productivity.

**Team analytics:** Aggregates activity and flow indicators at team level.

## Schema Notes

The current processed dataset contains the eight columns listed above. It does not contain separate `session_id` or `metadata` columns. Focus-session and context-switch information is calculated by the analytics modules.