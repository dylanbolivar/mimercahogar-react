from pydantic import BaseModel

class UsuarioRegistro(BaseModel):
    usuario: str
    contraseña: str

class UsuarioLogin(BaseModel):
    usuario: str
    contraseña: str
