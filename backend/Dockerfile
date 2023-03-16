FROM python:3.10.10
RUN pip install django
WORKDIR /usr/src/app

COPY . .

RUN pip install -r requirements.txt
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
EXPOSE 8000

