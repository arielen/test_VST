FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt /app/

WORKDIR /app
RUN pip install -r requirements.txt

CMD ["python", "manage.py", "makemigrations", "migrate"]