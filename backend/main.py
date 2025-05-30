from fastapi import HTTPException, FastAPI, status
from pydantic import BaseModel, Field
from typing import Optional, List
from supabase import create_client, Client
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

# Conectar a Supabase
supabase: Client = create_client(url, key)

# Inicializar la app
app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Modelos Pydantic para Productos (más específicos) ---
# Modelo para la creación de un producto (no necesita 'id')
class ProductoCreate(BaseModel):
    nombre: str = Field(..., min_length=1)
    descripcion: Optional[str] = None
    precio: float
    imagen: Optional[str] = None
    categoria_id: int

# Modelo para la respuesta de un producto (incluye 'id' y opcionalmente 'created_at')
class ProductoResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    imagen: Optional[str] = None
    categoria_id: int
    # created_at: Optional[datetime] = None # Descomenta si tu tabla 'productos' tiene un 'created_at' y quieres devolverlo

# --- Rutas de prueba ---
@app.get("/test")
def test_supabase():
    try:
        data = supabase.table("usuarios").select("*").limit(1).execute()
        # Supabase Python client devuelve la lista de resultados en .data
        return data.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al conectar con Supabase: {str(e)}")

# Ruta raíz
@app.get("/")
def leer_root():
    return {"mensaje": "API conectada a Supabase con éxito 🎉"}

# --- Modelos para Usuarios ---
class Usuario(BaseModel):
    nombre: str
    correo: str
    contrasena: str

# Modelo para la autenticación de usuarios (solo correo y contraseña)
class UsuarioLogin(BaseModel):
    correo: str
    contrasena: str

# --- Rutas de Usuarios ---
@app.get("/usuarios", response_model=List[Usuario]) # Añadido response_model para mayor claridad
def obtener_usuarios():
    data = supabase.table("usuarios").select("*").execute()
    return data.data

@app.post("/usuarios", status_code=status.HTTP_201_CREATED) # Código 201 para creación
async def crear_usuario(usuario: Usuario):
    try:
        # Verificar si el correo ya existe
        usuario_existente = supabase.table("usuarios").select("*").eq("correo", usuario.correo).execute()
        if len(usuario_existente.data) > 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo ya está registrado")

        # Verificar si el nombre ya existe
        nombre_existente = supabase.table("usuarios").select("*").eq("nombre", usuario.nombre).execute()
        if len(nombre_existente.data) > 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de usuario ya está en uso")

        # Insertar nuevo usuario
        # Supabase Python client devuelve la lista de resultados en .data
        resultado = supabase.table("usuarios").insert(usuario.model_dump()).execute() # .model_dump() para Pydantic v2
        
        if resultado.data:
            return {"mensaje": "Usuario creado con éxito ✅", "usuario": resultado.data[0]} # Retorna el primer objeto creado
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al insertar usuario en Supabase.")

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al crear usuario: {str(e)}")

@app.get("/usuarios/{id}", response_model=Usuario) # Asumimos que quieres devolver un solo usuario aquí
async def obtener_usuario(id: int):
    try:
        response = supabase.table("usuarios").select("*").eq("id", id).limit(1).execute()
        data = response.data

        if not data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

        return data[0] # Retorna el primer y único usuario encontrado
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al obtener usuario: {str(e)}")

# --- Ruta de Login ---
@app.post("/login")
async def login_usuario(usuario_login: UsuarioLogin):
    try:
        # Busca el usuario por correo electrónico
        response = supabase.table("usuarios").select("nombre, correo, contrasena").eq("correo", usuario_login.correo).limit(1).execute()
        usuario_encontrado = response.data

        if not usuario_encontrado:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

        # Verifica la contraseña (¡IMPORTANTE: esto asume que las contraseñas no están hasheadas en Supabase!
        # En producción, NUNCA almacenes contraseñas en texto plano. Usa funciones hash como bcrypt.)
        if usuario_encontrado[0]["contrasena"] != usuario_login.contrasena:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

        # Si las credenciales son correctas, devuelve información del usuario
        return {"mensaje": "Inicio de sesión exitoso ✅", "nombre_usuario": usuario_encontrado[0]["nombre"], "correo": usuario_encontrado[0]["correo"]}

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al iniciar sesión: {str(e)}")


# --- Rutas de Productos ---

@app.get("/productos", response_model=List[ProductoResponse])
async def obtener_productos():
    try:
        # Supabase Python client devuelve la lista de resultados en .data
        response = supabase.table("productos").select("*").order('id', desc=False).execute()
        productos = response.data

        # Siempre devuelve una lista, incluso si está vacía
        return productos
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al obtener productos: {str(e)}")

@app.get("/productos/{id}", response_model=ProductoResponse)
async def obtener_producto(id: int):
    try:
        # Usar .limit(1) para asegurar que solo esperamos un resultado por ID único
        response = supabase.table("productos").select("*").eq("id", id).limit(1).execute()
        producto = response.data

        if not producto:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado con ese ID")

        return producto[0]  # asumimos que solo puede haber uno por ID y lo devolvemos directamente
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al buscar producto: {str(e)}")

@app.post("/productos", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
async def agregar_producto(producto: ProductoCreate): # Usa ProductoCreate para la entrada
    try:
        # .model_dump() es el método correcto para Pydantic v2
        resultado = supabase.table("productos").insert(producto.model_dump()).execute()

        # Supabase Python client devuelve la lista de resultados en .data
        if resultado.data:
            return resultado.data[0] # Retorna el primer objeto creado, que debe ser un ProductoResponse
        else:
            # Esto puede ocurrir si hay un error de Supabase que no lanza excepción
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No se pudo agregar el producto en Supabase.")
    except Exception as e:
        # Captura cualquier excepción y la convierte en una HTTPException
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error al agregar producto: {str(e)}")

# **¡NUEVO ENDPOINT PARA ELIMINAR UN PRODUCTO!**
@app.delete("/productos/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_producto(producto_id: int):
    try:
        # Verificar si el producto existe antes de intentar eliminar
        # .select("id") para ser más eficiente, solo necesitamos saber si existe
        data = supabase.table('productos').select('id').eq('id', producto_id).limit(1).execute()
        if not data.data: # .data es la lista de resultados
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

        # Eliminar el producto
        delete_result = supabase.table('productos').delete().eq('id', producto_id).execute()
        
        # El cliente de Supabase Python no devuelve .count directamente de la misma manera que el JS.
        # Si la operación fue exitosa, simplemente no habrá error.
        # Si quisieras verificar la cantidad, necesitarías algo más sofisticado
        # o confiar en la excepción si falla. Por ahora, confiamos en que si no hay error, se eliminó.
        
        # Una respuesta 204 no debe tener cuerpo, así que solo devolvemos None o un mensaje simple
        return {"message": "Producto eliminado con éxito"} 
    except HTTPException as http_exc:
        # Re-lanzar las HTTPException ya definidas
        raise http_exc
    except Exception as e:
        # Capturar cualquier otra excepción inesperada
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al eliminar producto: {str(e)}")

# --- Rutas de Categorías ---
@app.get("/categorias")
async def obtener_categorias():
    try:
        response = supabase.table("categorias").select("*").execute()
        categorias = response.data
        return {"mensaje": "Categorías obtenidas ✅", "categorias": categorias}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al obtener categorías: {str(e)}")

# --- Rutas de Carrito ---
# (Asumo que tus tablas de carrito y compras usan 'id' como clave primaria y 'compras_id' como foreign key si aplica)
class CarritoItem(BaseModel):
    producto_id: int
    usuario_id: int
    cantidad: int
    # Añade cualquier otro campo que tu tabla 'carrito' tenga, como 'subtotal'
    # subtotal: float

@app.post("/carrito")
async def agregar_al_carrito(item: CarritoItem): # Usar un modelo Pydantic para el carrito
    try:
        data = supabase.table("carrito").insert(item.model_dump()).execute()
        if data.data:
            return {"mensaje": "Producto agregado al carrito ✅", "carrito": data.data[0]}
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No se pudo agregar al carrito en Supabase.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al agregar al carrito: {str(e)}")

@app.get("/carrito/{usuario_id}")
async def obtener_carrito(usuario_id: int):
    try:
        # Podrías querer hacer un join para obtener detalles del producto aquí también
        response = supabase.table("carrito").select("*").eq("usuario_id", usuario_id).execute()
        data = response.data

        if not data:
            return {"mensaje": "Carrito vacío o no encontrado", "carrito": []}

        return {"mensaje": "Carrito obtenido ✅", "carrito": data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al obtener carrito: {str(e)}")

@app.delete("/carrito/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_item_carrito(id: int):
    try:
        # Verificar si el item existe antes de eliminar
        item_existente = supabase.table("carrito").select("id").eq("id", id).limit(1).execute()
        if not item_existente.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ítem del carrito no encontrado")

        supabase.table("carrito").delete().eq("id", id).execute()
        return {"message": "Ítem eliminado del carrito ✅"} # Un 204 no debería tener cuerpo, pero a veces se devuelve para debugging
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al eliminar ítem del carrito: {str(e)}")

# --- Rutas de Compras ---
class CompraCreate(BaseModel):
    usuario_id: int
    total: float
    items: List[dict] # Lista de ítems: [{producto_id, cantidad, subtotal}, ...]

@app.post("/compras/", status_code=status.HTTP_201_CREATED)
async def generar_compra(compra: CompraCreate): # Usar un modelo Pydantic para la compra
    try:
        # Paso 1: Insertar en la tabla compras
        nueva_compra_data = {
            "usuario_id": compra.usuario_id,
            "total": compra.total,
            "fecha": datetime.utcnow().isoformat()
        }

        # Asegúrate de que tu columna de ID en 'compras' se auto-incremente o se genere
        compra_response = supabase.table("compras").insert(nueva_compra_data).execute()
        # Supabase Python client retorna data.data[0] para el objeto insertado
        compra_id = compra_response.data[0]["id"]

        # Paso 2: Insertar en detalle_compra
        detalle_items = []
        for item in compra.items:
            detalle_items.append({
                "compra_id": compra_id,
                "producto_id": item["producto_id"],
                "cantidad": item["cantidad"],
                "subtotal": item["subtotal"]
            })

        # Insertar todos los detalles de una vez
        if detalle_items: # Solo insertar si hay items
            supabase.table("detalle_compra").insert(detalle_items).execute()

        return {
            "mensaje": "Compra realizada con éxito ✅",
            "compra_id": compra_id,
            "detalle": detalle_items
        }

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado al generar compra: {str(e)}")

@app.get("/compras/{usuario_id}")
async def historial_compras(usuario_id: int):
    try:
        # JOIN entre compras → detalle_compra → productos
        # .data para el resultado
        result = supabase \
            .table("compras") \
            .select("""
                id,
                fecha,
                total,
                detalle_compra(
                    id,
                    producto_id,
                    cantidad,
                    subtotal,
                    productos(
                        nombre,
                        precio,
                        imagen
                    )
                )
            """) \
            .eq("usuario_id", usuario_id) \
            .order("fecha", desc=True) \
            .execute()

        compras = result.data

        if not compras:
            return {
                "mensaje": "Este usuario no tiene compras registradas ❌",
                "historial": []
            }

        return {
            "mensaje": "Historial obtenido con éxito ✅",
            "historial": compras
        }

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado: {str(e)}")

@app.get("/detalle_compra/{compra_id}")
async def obtener_detalle_compra(compra_id: int):
    try:
        response = supabase.table("detalle_compra").select("*").eq("compra_id", compra_id).execute()
        detalles = response.data

        if not detalles:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay detalles para esta compra")

        return {
            "mensaje": "Detalle de compra obtenido ✅",
            "detalle_compra": detalles
        }
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado: {str(e)}")

class DetalleCompraCreate(BaseModel): # Renombrado para claridad
    compra_id: int # Asumo que es un int ahora
    producto_id: int # Asumo que es un int ahora
    cantidad: int
    subtotal: float # Añadido subtotal, ya que lo usas en la compra

@app.post("/detalle_compra", status_code=status.HTTP_201_CREATED)
async def crear_detalle_compra(detalle: DetalleCompraCreate): # Usar el nuevo modelo
    try:
        # Puedes insertar el objeto Pydantic directamente con .model_dump()
        respuesta = supabase.table("detalle_compra").insert(detalle.model_dump()).execute()

        if respuesta.data:
            return {"mensaje": "Detalle de compra registrado correctamente", "data": respuesta.data[0]}
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No se pudo registrar el detalle de compra en Supabase.")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado: {str(e)}")