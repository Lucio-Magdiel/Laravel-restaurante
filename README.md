# Sistema de Gestión de Restaurante

Sistema completo de gestión para restaurantes desarrollado con Laravel 11, Inertia.js y React. Incluye gestión de pedidos, reservas, inventario, reportes y múltiples roles de usuario.

## 🚀 Características

### Gestión de Pedidos
- ✅ Creación de pedidos por mesa
- ✅ Selección de productos con categorías
- ✅ Cálculo automático de totales (subtotal + IGV 18%)
- ✅ Estados: pendiente → en_progreso → listo → entregado → pagado
- ✅ Notas especiales por item

### Panel de Cocina
- ✅ Vista en tiempo real de pedidos pendientes y en progreso
- ✅ Temporizador automático desde la creación del pedido
- ✅ Cambio de estado con un click
- ✅ Organización por columnas (Pendientes / En Progreso)

### Panel de Caja
- ✅ Procesamiento de pagos
- ✅ Métodos: simulación, efectivo, tarjeta
- ✅ Generación automática de número de recibo
- ✅ Detalle completo del pedido antes del pago
- ✅ Descarga de boletas en PDF

### Gestión de Reservas
- ✅ Sistema de reservas con validación de solapamientos
- ✅ Vista de calendario interactiva (8:00-23:00)
- ✅ Estados: pendiente, confirmada, completada, cancelada
- ✅ Actualización automática del estado de mesas
- ✅ Filtros por fecha y estado

### Reportes
- ✅ Reporte de ventas diarias con rango de fechas
- ✅ Productos más vendidos (top 10)
- ✅ Ventas agrupadas por día
- ✅ Exportación a PDF
- ✅ Boletas individuales por pedido

### Gestión de Recursos
- ✅ **Clientes**: CRUD completo con teléfono y email
- ✅ **Mesas**: Gestión con capacidad, ubicación y estado
- ✅ **Productos**: Categorías, precios, stock activo/inactivo
- ✅ **Usuarios**: 4 roles (admin, mesero, cocina, caja)

## 🛠️ Tecnologías

### Backend
- **Laravel 11** - Framework PHP
- **SQLite** - Base de datos
- **Laravel Fortify** - Autenticación
- **DomPDF** - Generación de PDFs

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Inertia.js** - Stack moderno sin API
- **Vite** - Build tool y HMR
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos

### Herramientas
- **Wayfinder** - Rutas type-safe
- **Pest** - Testing framework
- **Laravel Boost** - MCP tools

## 📋 Requisitos

- PHP 8.2 o superior
- Composer
- Node.js 18+ y npm
- Extensiones PHP: sqlite3, pdo_sqlite, gd, zip

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/laravel-restaurante.git
cd laravel-restaurante
```

### 2. Instalar dependencias
```bash
composer install
npm install
```

### 3. Configurar el entorno
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configurar la base de datos
Edita `.env` y configura SQLite:
```env
DB_CONNECTION=sqlite
DB_DATABASE=C:\xampp\htdocs\Laravel-restaurante\database\database.sqlite
```

Crea el archivo de base de datos:
```bash
touch database/database.sqlite  # En Linux/Mac
# En Windows: crear manualmente el archivo database.sqlite
```

### 5. Ejecutar migraciones y seeders
```bash
php artisan migrate --seed
```

### 6. Compilar assets
```bash
npm run build
# o para desarrollo:
npm run dev
```

### 7. Iniciar el servidor
```bash
php artisan serve
```

Accede a: http://127.0.0.1:8000

## 👥 Usuarios de Prueba

Después de ejecutar los seeders, tendrás estos usuarios (contraseña: `password`):

| Email | Rol | Acceso |
|-------|-----|--------|
| admin@example.com | Admin | Acceso completo |
| mesero@example.com | Mesero | Pedidos, clientes, mesas |
| cocina@example.com | Cocina | Panel de cocina |
| caja@example.com | Caja | Panel de caja, reportes |

## 📊 Estructura de la Base de Datos

### Tablas principales
- `users` - Usuarios con roles
- `mesas` - Mesas del restaurante
- `clientes` - Clientes registrados
- `categorias` - Categorías de productos
- `productos` - Platos y bebidas
- `pedidos` - Pedidos realizados
- `pedido_items` - Items de cada pedido
- `reservas` - Reservas de mesas
- `pagos` - Registro de pagos

## 🎯 Flujo de Trabajo

### Flujo de Pedido
1. **Mesero** crea pedido desde `/pedidos/create`
   - Selecciona mesa, cliente (opcional)
   - Agrega productos con cantidad
   - Sistema calcula subtotal + IGV

2. **Cocina** ve el pedido en `/cocina`
   - Click en "Comenzar a Preparar" → estado `en_progreso`
   - Click en "Marcar como Listo" → estado `listo`

3. **Caja** procesa el pago en `/caja`
   - Selecciona método de pago
   - Genera recibo y boleta PDF
   - Estado final: `pagado`

### Flujo de Reserva
1. Seleccionar cliente y mesa
2. Elegir fecha/hora (validación de solapamientos)
3. Sistema actualiza estado de mesa a `reservada`
4. Confirmar → Completar → Mesa vuelve a `disponible`

## 📁 Estructura del Proyecto

```
app/
├── Http/Controllers/
│   ├── Api/              # Controladores API REST
│   └── Web/              # Controladores Inertia
├── Models/               # Modelos Eloquent
database/
├── migrations/           # Esquema de BD
├── seeders/             # Datos de ejemplo
resources/
├── js/
│   ├── components/      # Componentes React
│   ├── pages/           # Páginas Inertia
│   └── layouts/         # Layouts
├── views/
│   └── reportes/        # Plantillas PDF
routes/
├── api.php              # Rutas API
├── web.php              # Rutas web
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Vite dev server con HMR
php artisan serve        # Laravel dev server

# Producción
npm run build            # Compilar para producción

# Base de datos
php artisan migrate      # Ejecutar migraciones
php artisan db:seed      # Ejecutar seeders
php artisan migrate:fresh --seed  # Reset completo

# Utilidades
php artisan wayfinder:generate    # Regenerar rutas TypeScript
php artisan route:list           # Listar todas las rutas
php artisan tinker               # REPL de Laravel
```

## 🧪 Testing

```bash
php artisan test         # Ejecutar tests con PHPUnit
./vendor/bin/pest        # Ejecutar tests con Pest
```

## 📱 Rutas Principales

### Autenticación
- `/login` - Iniciar sesión
- `/register` - Registro de usuarios
- `/dashboard` - Panel principal

### Gestión
- `/pedidos` - Lista de pedidos
- `/pedidos/create` - Crear pedido
- `/clientes` - Gestión de clientes
- `/mesas` - Gestión de mesas
- `/productos` - Gestión de productos

### Operaciones
- `/cocina` - Panel de cocina
- `/caja` - Panel de caja
- `/reservas` - Gestión de reservas
- `/reservas/calendario/view` - Vista calendario

### Reportes
- `/reportes` - Hub de reportes
- `/reportes/ventas` - Reporte de ventas
- `/reportes/ventas/pdf` - Descargar PDF
- `/reportes/boleta/{pedido}` - Boleta individual

## 🔐 Seguridad

- Autenticación con Laravel Fortify
- Middleware de roles en rutas API
- CSRF protection
- Validación de inputs
- SQL injection prevention (Eloquent ORM)

## 📝 Pendientes / Próximas Funcionalidades

- [ ] Broadcasting en tiempo real (Laravel Echo + Socket.IO)
- [ ] Protección por roles en frontend
- [ ] Tests automatizados completos
- [ ] Notificaciones push
- [ ] Gestión de inventario con stock
- [ ] Integración con pasarelas de pago
- [ ] App móvil para meseros
- [ ] QR codes para comandas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado como proyecto final de semestre.

## 🙏 Agradecimientos

- Laravel Framework
- Inertia.js
- React
- shadcn/ui
- Comunidad de código abierto

---

**Nota**: Este es un proyecto educativo. No usar en producción sin las debidas medidas de seguridad y optimizaciones.
