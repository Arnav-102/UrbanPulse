# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
# Set the working directory in the container
WORKDIR /app

# Copy the requirements file from the backend directory
COPY backend/requirements.txt ./backend/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the backend and ai directories into the container
COPY backend ./backend
COPY ai ./ai

# Make port 8001 available to the world outside this container
EXPOSE 8001

# Run the application (using module syntax to support imports)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8001"]
