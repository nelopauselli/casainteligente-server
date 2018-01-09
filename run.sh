#!/bin/bash
# Script para ejecutar el server de casa inteligente
echo "redireccionando puerto 80 al 3000..."

# Forward port 80 to 5000 (where our web server is) so the
# web server can run at normal permissions
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

echo "ejecutando server"
/usr/bin/node /home/pi/casainteligente/index.js