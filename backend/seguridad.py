from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

ALGORITMO = "HS256"
CLAVE_SECRETA = "miclaveultrasecreta"
EXPIRA_MINUTOS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def codificar_contraseña(contraseña: str) -> str:
    return pwd_context.hash(contraseña)

def verificar_contraseña(contraseña: str, contraseña_hash: str) -> bool:
    return pwd_context.verify(contraseña, contraseña_hash)

def crear_token_jwt(usuario: str) -> str:
    datos = {
        "sub": usuario,
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRA_MINUTOS)
    }
    return jwt.encode(datos, CLAVE_SECRETA, algorithm=ALGORITMO)
