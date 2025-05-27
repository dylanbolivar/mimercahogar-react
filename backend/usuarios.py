from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from modelos import UsuarioRegistro, UsuarioLogin
from seguridad import codificar_contraseña, verificar_contraseña, crear_token_jwt
from auth import usuarios_en_memoria

router = APIRouter(tags=["auth"])  # Definir router

@router.post("/registro")
def registrar_usuario(datos: UsuarioRegistro):
    if datos.usuario in usuarios_en_memoria:
        raise HTTPException(status_code=400, detail="El usuario ya existe, pruebe con otro.")
    usuarios_en_memoria[datos.usuario] = codificar_contraseña(datos.contraseña)
    return {"mensaje": "Usuario registrado correctamente en el sistema."}

@router.post("/login")
def iniciar_sesion(datos: UsuarioLogin):
    contraseña_hash = usuarios_en_memoria.get(datos.usuario)
    if not contraseña_hash or not verificar_contraseña(datos.contraseña, contraseña_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas, intente nuevamente")
    token = crear_token_jwt(datos.usuario)
    return JSONResponse(content={"token": token, "usuario": datos.usuario})
