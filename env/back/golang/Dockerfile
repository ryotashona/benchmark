FROM golang:1.20.2-bullseye

RUN apt-get update\
 && apt-get install -y time

COPY ./startup.sh /
ENTRYPOINT [ "/bin/sh", "/startup.sh" ]
