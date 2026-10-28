FROM apache/airflow:3.3.2

COPY requirements.txt /requirements-cognistream.txt

USER airflow
RUN pip install --no-cache-dir -r /requirements-cognistream.txt
