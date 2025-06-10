FROM python:3.10-slim
WORKDIR /app
COPY .. ../
RUN pip install -r ai_service/requirements.txt
CMD ["uvicorn", "ai_service.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
