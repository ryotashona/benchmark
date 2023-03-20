#!/bin/sh
SERVER_DIR="/opt/golang_server"

cd $SERVER_DIR
go build -o ./bin/ golang_server.go 

./bin/golang_server

