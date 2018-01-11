#!/bin/bash
# Script para actualizar la instalación

cd /home/pi/casainteligente
git -C /home/pi/casainteligente pull
npm install
