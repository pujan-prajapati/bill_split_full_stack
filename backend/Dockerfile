FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  gcc \
  libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY --from=docker.io/astral/uv:latest /uv /uvx /bin/
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

EXPOSE 8000

CMD ["uv", "run", "gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3" , "--timeout", "180"]
