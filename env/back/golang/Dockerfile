FROM golang:1.20.2-bullseye

RUN apt-get update\
 && apt-get install -y time

# COPY ./startup.sh /
# ENTRYPOINT [ "/bin/sh", "/startup.sh" ]

# oci環境用: 負荷軽減のため、事前ビルドしたファイルを利用する.
RUN mkdir -p /opt/leibniz_formula/bin/
COPY ./leibniz_formula /opt/leibniz_formula/bin/
COPY ./leibniz_formula.sh /opt/leibniz_formula/

RUN mkdir -p /opt/fibonacci/bin/
COPY ./fibonacci /opt/fibonacci/bin/
COPY ./fibonacci.sh /opt/fibonacci/

RUN mkdir -p /opt/golang_server/bin/
COPY ./golang_server /opt/golang_server/bin/
ENTRYPOINT [ "/opt/golang_server/bin/golang_server" ]
