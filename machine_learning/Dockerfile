# Base image
FROM python:3.9-slim
# Create app directory
WORKDIR /usr/src/app

# Create a virtual environment and activate it
RUN python3 -m venv /usr/src/app/venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

# Copy your Python script
# Assume your Python script is in the 'python' directory in your project
COPY ./requirements.txt ./

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Bundle app source
COPY . .

# Run the script when the container launches
CMD ["python3", "main.py"]
