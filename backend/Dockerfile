# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY . .

# Collect static files for DRF, admin, etc.
RUN python manage.py collectstatic --noinput

# Run server
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
