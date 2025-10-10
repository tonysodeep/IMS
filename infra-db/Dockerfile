# Use the official MongoDB base image
FROM mongo:latest

# Copy initialization scripts or data files into the container's entrypoint directory
# These scripts will be executed when the container starts for the first time
COPY init-mongo.js /docker-entrypoint-initdb.d/
# COPY your_data.json /tmp/your_data.json