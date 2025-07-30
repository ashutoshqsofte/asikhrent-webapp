# backend/Dockerfile
FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV FLASK_APP=backend_app.py
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run", "--port=5000"]
