FROM golang:latest AS goc
WORKDIR /app

COPY go.mod main.go ./
RUN go mod download
RUN env CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -o backend

FROM alpine:latest
WORKDIR /app

RUN apk update
RUN apk add python3
RUN apk add py3-numpy

COPY --from=goc /app/ /app/

COPY py-script/src/main.py .
COPY py-script/src/best-fit.py .

CMD ["./backend"]
