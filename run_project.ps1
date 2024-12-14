# venv path defination
$venvPath = "D:\projects\FUTSALA2\tenv"          # Path to the virtual environment

# Activate Python virtual environment
Start-Process "powershell" -ArgumentList "-NoExit", "-Command", "cd `"$venvPath`"; .\Scripts\activate; cd..; Write-Host 'Python venv activated - Ready for use'"


# Activate venv and start FastAPI backend server
Start-Process "powershell" -ArgumentList "-NoExit", "-Command", "cd `"$venvPath`"; .\Scripts\activate; cd..; uvicorn backend.main:app --reload; Write-Host 'Python venv activated - Ready for use'"

# Activate venv and start React Vite frontend
Start-Process "powershell" -ArgumentList "-NoExit", "-Command", "cd `"$venvPath`"; .\Scripts\activate; cd..;cd frontend; npm run dev; Write-Host 'Vite frontend server started'"

# Write-Host "Three PowerShell windows have been opened for venv activation, backend, and frontend tasks."

