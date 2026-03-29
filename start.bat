@echo off
echo Starting Portfolio Server...
cd /d "C:/Users/ASUS/Desktop/portf/CascadeProjects/personal-website/"
start http://localhost:8000
python -m http.server 8000
pause
