FROM golang:latest
COPY --from=python:latest / /

WORKDIR /app

COPY go.mod main.go ./
RUN go mod download
RUN go build

COPY /py-script/requirements.txt .
RUN pip install -r requirements.txt
COPY /py-script/src/main.py .
COPY /py-script/src/best-fit.py .

CMD ["./backend"]