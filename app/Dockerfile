FROM python:3.11-slim

RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

# Salin isi folder app ke /app
COPY app/ .

# Salin folder models ke /models (di luar /app)
COPY models/ /models/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]