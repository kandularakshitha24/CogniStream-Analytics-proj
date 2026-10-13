# CogniStream Data Dictionary

The primary event dataset will contain:

| Column | Description |
|---|---|
| event_id | Unique event identifier |
| developer_id | Synthetic developer identifier |
| team | Synthetic team name |
| timestamp | Time when the event occurred |
| source | GitHub, Slack, Jira or IDE |
| event_type | Type of recorded event |
| activity | Associated developer activity |
| session_id | Coding session identifier |
| metadata | Additional event information |

The complete schema and validation rules will be documented after the initial dataset is generated.