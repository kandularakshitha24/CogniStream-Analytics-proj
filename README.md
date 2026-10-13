# CogniStream: Developer Flow-State & Cognitive Load Analytics

## Project Overview
CogniStream is a developer productivity analytics platform that analyzes simulated GitHub, Slack, Jira, and IDE activity events to identify uninterrupted coding sessions and potential context-switching interruptions.

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
Python, Polars, Apache Airflow, ClickHouse, FastAPI, React, Tremor.js, Git and GitHub.

## Project Status
Day 1: Repository initialization and project structure completed.

## Data Privacy
The initial implementation uses synthetic activity data and does not require access to real employee accounts.