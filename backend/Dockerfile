FROM python:3.8-alpine3.15

# This keeps Python from buffering stdin/stdout
ENV PYTHONUNBUFFERED 1

# This prevents Python from writing out pyc files
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend

COPY requirements.txt .

RUN apk add --no-cache \
    ca-certificates gcc postgresql-dev linux-headers musl-dev \
    libffi-dev jpeg-dev zlib-dev git

RUN pip install -U pip

RUN pip install -r requirements.txt

COPY . .

