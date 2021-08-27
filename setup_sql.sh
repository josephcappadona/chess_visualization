#!/bin/bash

sudo apt-get update
sudo apt-get -qq install mysql-server

sudo service mysql start

echo "Configuring SQL database"
read -p "Enter host: " HOST
read -p "Enter user:" USER
read -p "Ener create password" PASSWORD

echo "host: $HOST\nuser: $USER\npassword: $PASSWORD" > sql_credentials.yaml

sudo mysql -e "ALTER USER '$USER'@'$HOST' IDENTIFIED WITH mysql_native_password BY '$PASSWORD'"