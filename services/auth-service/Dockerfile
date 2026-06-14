FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy entrypoint script
COPY entrypoint.sh .
RUN apt-get update && apt-get install -y dos2unix && dos2unix entrypoint.sh && chmod +x entrypoint.sh

EXPOSE 8001

CMD ["bash", "entrypoint.sh"]
