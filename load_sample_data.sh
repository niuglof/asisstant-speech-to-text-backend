
#!/bin/bash

# Stop and remove existing Docker Compose setup, including volumes
echo "Stopping and removing existing Docker Compose setup and volumes..."
docker-compose down -v

# Start Docker Compose in detached mode
echo "Starting Docker Compose..."
docker-compose up -d

# Wait for the database service to be healthy
echo "Waiting for database to become healthy..."
until docker-compose exec db pg_isready -U postgres
do
  echo "."
  sleep 1
done
echo "Database is healthy!"

# Execute the sample data SQL script
echo "Loading sample data into the database..."
docker-compose exec -i db psql -U postgres -d postgres < ./seeds/001_sample_data.sql

echo "Sample data loaded successfully!"
