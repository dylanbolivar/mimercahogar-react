from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os

app = FastAPI()

USUARIOS_FILE = "data/usuarios.json"
HISTORIAL_FILE = "data/historial.json"

# Modelo de datos
class Usuario(BaseModel):
    usuario: str
    contrasena: str

class Compra(BaseModel):
    usuario: str
    productos: list

# Utilidades para leer y escribir archivos
def leer_json(path):
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump([], f)
    with open(path, "r") as f:
        return json.load(f)

def escribir_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# Registro
@app.post("/register")
def register(usuario: Usuario):
    usuarios = leer_json(USUARIOS_FILE)
    if any(u["usuario"] == usuario.usuario for u in usuarios):
        raise HTTPException(status_code=400, detail="Usuario ya existe.")
    usuarios.append(usuario.dict())
    escribir_json(USUARIOS_FILE, usuarios)
    return {"mensaje": "Registro exitoso"}

# Login
@app.post("/login")
def login(usuario: Usuario):
    usuarios = leer_json(USUARIOS_FILE)
    for u in usuarios:
        if u["usuario"] == usuario.usuario and u["contrasena"] == usuario.contrasena:
            return {"mensaje": "Login exitoso"}
    raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

# Guardar historial
@app.post("/historial")
def guardar_historial(compra: Compra):
    historial = leer_json(HISTORIAL_FILE)
    historial.append(compra.dict())
    escribir_json(HISTORIAL_FILE, historial)
    return {"mensaje": "Compra guardada"}

# Obtener historial de un usuario
@app.get("/historial/{usuario}")
def obtener_historial(usuario: str):
    historial = leer_json(HISTORIAL_FILE)
    user_historial = [c["productos"] for c in historial if c["usuario"] == usuario]
    return {"compras": user_historial}
