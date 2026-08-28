# PRD Maestro --- Sistema de Gestión para Licorería "Al Paso"

**Versión:** 1.0\
**Estado:** Listo para implementación del MVP\
**Proyecto:** Licorería Al Paso\
**Sprint:** Sprint 1\
**Equipo:** Sergio Mendoza, Luis Padilla y Velásquez

------------------------------------------------------------------------

## 1. Nombre y visión del producto

### 1.1 Nombre del producto

**Sistema de Gestión para Licorería "Al Paso"**

### 1.2 Visión

Construir una aplicación web sencilla, segura y consistente que permita
a la Licorería "Al Paso" controlar las operaciones esenciales del
negocio desde una única interfaz: autenticación de usuarios, gestión de
productos, registro de entradas de inventario y registro de ventas.

El MVP debe reducir el registro manual, mejorar el control de
existencias, evitar ventas por encima del stock disponible y conservar
trazabilidad sobre las operaciones realizadas por los usuarios.

### 1.3 Objetivo del MVP

Implementar y validar las cuatro Historias de Usuario priorizadas para
el Sprint 1:

-   **HU01:** Iniciar sesión.
-   **HU02:** Gestionar productos.
-   **HU03:** Registrar entradas de inventario.
-   **HU04:** Registrar venta.

------------------------------------------------------------------------

## 2. Problema que resuelve

La Licorería "Al Paso" requiere sistematizar procesos que, al realizarse
manualmente o de forma dispersa, pueden ocasionar:

-   dificultad para conocer el stock disponible;
-   errores al registrar productos;
-   falta de trazabilidad en las entradas de inventario;
-   errores en cantidades y totales de venta;
-   riesgo de vender productos sin existencias suficientes;
-   dificultad para identificar qué usuario realizó una operación;
-   duplicidad o inconsistencia de información.

El sistema centralizará estas operaciones y utilizará una base de datos
relacional para mantener la integridad de la información.

------------------------------------------------------------------------

## 3. Alcance del MVP

### 3.1 Incluido

El MVP incluye:

1.  autenticación de usuarios;
2.  validación del estado activo del usuario;
3.  cierre de sesión;
4.  listado y búsqueda de productos;
5.  registro de productos;
6.  edición de productos;
7.  desactivación lógica de productos;
8.  asociación de productos con categorías;
9.  consulta del stock actual;
10. registro de entradas de inventario;
11. actualización de existencias;
12. trazabilidad de movimientos de inventario;
13. búsqueda y selección de productos para una venta;
14. modificación de cantidades;
15. eliminación de productos del detalle antes de confirmar;
16. cálculo de subtotales y total;
17. validación de stock;
18. registro de venta y detalles;
19. descuento de stock;
20. registro de movimientos de salida vinculados con la operación de
    venta.

### 3.2 Fuera del alcance del Sprint 1

No forman parte obligatoria del MVP:

-   compras a proveedores;
-   cuentas por cobrar;
-   facturación electrónica;
-   contabilidad;
-   delivery;
-   tienda en línea;
-   promociones avanzadas;
-   reportes gerenciales avanzados;
-   integración con métodos de pago externos;
-   aplicación móvil nativa.

Cualquier incorporación posterior deberá tratarse como ampliación del
backlog y no como modificación silenciosa del alcance.

------------------------------------------------------------------------

## 4. Usuarios y roles

### 4.1 Usuario autorizado

Persona registrada en el sistema con credenciales válidas y estado
activo.

### 4.2 Administrador

Responsable principalmente de:

-   acceder al sistema;
-   gestionar productos;
-   consultar información necesaria para la operación.

### 4.3 Encargado de inventario

Responsable principalmente de:

-   consultar productos;
-   visualizar existencias;
-   registrar entradas de inventario;
-   dejar trazabilidad del movimiento.

### 4.4 Vendedor

Responsable principalmente de:

-   acceder al sistema;
-   buscar productos;
-   registrar ventas;
-   validar disponibilidad;
-   confirmar la operación.

Los roles se almacenan en la tabla `rol` y cada usuario referencia un
rol mediante `usuario.id_rol`.

------------------------------------------------------------------------

# 5. Historias de Usuario del Sprint 1

## HU01 --- Iniciar sesión

**Como** usuario autorizado,\
**quiero** iniciar sesión,\
**para** acceder únicamente a las funciones que me corresponden.

### Flujo principal

1.  El usuario abre la pantalla de inicio de sesión.
2.  Introduce usuario y contraseña.
3.  El sistema valida campos obligatorios.
4.  El sistema busca al usuario.
5.  Se validan las credenciales.
6.  Se comprueba que `estado = TRUE`.
7.  Si todo es correcto, se inicia la sesión.
8.  El usuario accede al Dashboard.
9.  El usuario puede cerrar sesión.

### Criterios de aceptación

-   **CA-HU01-01:** usuario y contraseña son obligatorios.
-   **CA-HU01-02:** credenciales incorrectas no permiten el acceso.
-   **CA-HU01-03:** un usuario con `estado = FALSE` no puede acceder.
-   **CA-HU01-04:** credenciales válidas y usuario activo permiten
    acceder al Dashboard.
-   **CA-HU01-05:** el sistema muestra un mensaje comprensible cuando el
    acceso falla.
-   **CA-HU01-06:** cerrar sesión elimina la sesión activa y retorna al
    Login.
-   **CA-HU01-07:** las rutas protegidas no deben quedar disponibles sin
    autenticación.

------------------------------------------------------------------------

## HU02 --- Gestionar productos

**Como** administrador,\
**quiero** registrar y editar productos,\
**para** mantener actualizado el catálogo de la licorería.

### Flujo principal

1.  El administrador abre el módulo de productos.
2.  El sistema lista los productos.
3.  El administrador puede buscar un producto.
4.  Puede crear un producto nuevo.
5.  El sistema valida los datos.
6.  Se comprueba que el código no esté duplicado.
7.  El producto se guarda.
8.  Un producto existente puede editarse.
9.  Un producto puede desactivarse sin eliminar su historial.

### Criterios de aceptación

-   **CA-HU02-01:** debe mostrarse un listado de productos.
-   **CA-HU02-02:** debe ser posible buscar productos.
-   **CA-HU02-03:** `codigo` es obligatorio y único.
-   **CA-HU02-04:** `nombre` es obligatorio.
-   **CA-HU02-05:** `precio_venta` debe ser mayor que cero.
-   **CA-HU02-06:** `stock_actual` debe ser mayor o igual que cero.
-   **CA-HU02-07:** `stock_minimo` debe ser mayor o igual que cero.
-   **CA-HU02-08:** el producto debe asociarse a una categoría válida.
-   **CA-HU02-09:** debe ser posible editar un producto existente.
-   **CA-HU02-10:** la desactivación debe realizarse mediante `estado`,
    preservando referencias históricas.

------------------------------------------------------------------------

## HU03 --- Registrar entrada de inventario

**Como** encargado de inventario,\
**quiero** registrar ingresos de productos,\
**para** aumentar las existencias y conservar la trazabilidad.

### Flujo principal

1.  El usuario selecciona un producto.
2.  El sistema consulta `stock_actual`.
3.  Se introduce una cantidad de entrada.
4.  Se valida que la cantidad sea mayor que cero.
5.  Se conserva el valor como `stock_anterior`.
6.  Se calcula `stock_resultante`.
7.  Se actualiza `producto.stock_actual`.
8.  Se crea un registro en `movimiento_inventario`.
9.  El movimiento utiliza `tipo = 'ENTRADA'`.
10. El sistema informa que la operación fue registrada.

### Criterios de aceptación

-   **CA-HU03-01:** debe seleccionarse un producto válido.
-   **CA-HU03-02:** el stock actual debe visualizarse antes de
    confirmar.
-   **CA-HU03-03:** `cantidad` debe ser mayor que cero.
-   **CA-HU03-04:** `stock_resultante = stock_anterior + cantidad`.
-   **CA-HU03-05:** `producto.stock_actual` debe coincidir con el stock
    resultante.
-   **CA-HU03-06:** debe generarse un registro de
    `movimiento_inventario`.
-   **CA-HU03-07:** el movimiento debe identificar producto y usuario.
-   **CA-HU03-08:** la actualización del stock y el movimiento deben
    mantenerse consistentes; no debe quedar una operación parcialmente
    aplicada.

------------------------------------------------------------------------

## HU04 --- Registrar venta

**Como** vendedor,\
**quiero** registrar una venta,\
**para** calcular el total y descontar automáticamente los productos
vendidos.

### Flujo principal

1.  El vendedor inicia una venta.
2.  Busca un producto.
3.  El sistema consulta su disponibilidad.
4.  El vendedor agrega el producto y cantidad.
5.  El sistema valida que exista stock suficiente.
6.  Se calcula el subtotal.
7.  El vendedor puede modificar cantidades o quitar productos.
8.  El sistema recalcula el total.
9.  Antes de finalizar una venta de bebidas alcohólicas, el vendedor
    confirma que realizó la verificación de mayoría de edad
    correspondiente.
10. El vendedor confirma la venta.
11. Se crea el registro en `venta`.
12. Se crean los registros en `detalle_venta`.
13. Se descuenta el stock de cada producto.
14. Se registran movimientos de tipo `SALIDA`.
15. Se informa que la venta fue registrada.

### Criterios de aceptación

-   **CA-HU04-01:** una venta debe contener al menos un producto.
-   **CA-HU04-02:** cada cantidad debe ser mayor que cero.
-   **CA-HU04-03:** no puede agregarse o confirmarse una cantidad
    superior al stock disponible.
-   **CA-HU04-04:** `subtotal = cantidad × precio_unitario`.
-   **CA-HU04-05:** `venta.total` debe ser igual a la suma de los
    subtotales.
-   **CA-HU04-06:** la venta debe identificar al usuario responsable.
-   **CA-HU04-07:** cada detalle debe identificar venta y producto.
-   **CA-HU04-08:** el stock resultante nunca puede ser negativo.
-   **CA-HU04-09:** la venta, sus detalles, la actualización de stock y
    los movimientos relacionados deben mantenerse consistentes.
-   **CA-HU04-10:** si falla una parte crítica de la operación, no debe
    quedar una venta parcialmente registrada.
-   **CA-HU04-11:** antes de confirmar la venta de bebidas alcohólicas
    debe existir confirmación de la verificación de mayoría de edad por
    parte del vendedor.

------------------------------------------------------------------------

# 6. Reglas de negocio

-   **RN-01:** solo usuarios con credenciales válidas y `estado = TRUE`
    pueden acceder.
-   **RN-02:** `usuario.usuario` debe ser único.
-   **RN-03:** `rol.nombre` debe ser único.
-   **RN-04:** `categoria.nombre` debe ser único.
-   **RN-05:** `producto.codigo` debe ser único.
-   **RN-06:** el precio de venta debe ser mayor que cero.
-   **RN-07:** el stock actual y mínimo nunca pueden ser negativos.
-   **RN-08:** los productos utilizados por ventas o movimientos no
    deben eliminarse físicamente desde el flujo normal; deben
    desactivarse mediante `estado`.
-   **RN-09:** una entrada de inventario debe aumentar el stock.
-   **RN-10:** una venta debe disminuir el stock.
-   **RN-11:** no se permite confirmar una venta si alguna cantidad
    supera la disponibilidad.
-   **RN-12:** cada movimiento de inventario debe registrar el producto
    y usuario responsable.
-   **RN-13:** `movimiento_inventario.tipo` solo admite `ENTRADA` o
    `SALIDA`.
-   **RN-14:** los precios utilizados en una venta se conservan en
    `detalle_venta.precio_unitario`.
-   **RN-15:** el total de la venta corresponde a la suma de los
    subtotales.
-   **RN-16:** la persistencia de una venta debe evitar estados
    parciales entre venta, detalle, stock y movimientos.
-   **RN-17:** la aplicación debe solicitar al vendedor confirmar que
    realizó la verificación de mayoría de edad antes de finalizar la
    venta de bebidas alcohólicas.

------------------------------------------------------------------------

# 7. Stack tecnológico

## 7.1 Frontend

-   React.
-   Vite.
-   React Router.
-   CSS modular o Tailwind CSS, manteniendo consistencia visual.

## 7.2 Backend y servicios

Para el MVP se propone utilizar **Supabase** como plataforma de
servicios y persistencia, aprovechando PostgreSQL.

## 7.3 Persistencia

-   PostgreSQL.
-   Modelo relacional definido en la Actividad 7.

## 7.4 Herramientas de ingeniería

-   Git.
-   GitHub.
-   Antigravity.
-   MCP para acceso controlado al repositorio.
-   Google AI Studio para consolidación del PRD.
-   PlantUML para modelos UML.

------------------------------------------------------------------------

# 8. Arquitectura frontend, backend y persistencia

## 8.1 Arquitectura frontend

Estructura sugerida:

``` text
src/
├── components/
├── layouts/
├── modules/
│   ├── auth/
│   ├── productos/
│   ├── inventario/
│   └── ventas/
├── services/
├── hooks/
├── utils/
├── App.jsx
└── main.jsx
```

### Responsabilidades

-   `components/`: componentes reutilizables.
-   `layouts/`: estructura visual general.
-   `modules/auth/`: HU01.
-   `modules/productos/`: HU02.
-   `modules/inventario/`: HU03.
-   `modules/ventas/`: HU04.
-   `services/`: acceso a persistencia y servicios.
-   `utils/`: validaciones y utilidades compartidas.

## 8.2 Backend / servicios

La lógica de persistencia debe abstraerse en servicios, evitando
realizar consultas dispersas directamente desde componentes visuales.

Los servicios deben encargarse de:

-   autenticación;
-   consulta y persistencia de productos;
-   actualización de inventario;
-   registro consistente de ventas;
-   manejo uniforme de errores.

## 8.3 Persistencia

La base de datos utiliza PostgreSQL y las siguientes siete tablas:

1.  `rol`
2.  `usuario`
3.  `categoria`
4.  `producto`
5.  `venta`
6.  `detalle_venta`
7.  `movimiento_inventario`

------------------------------------------------------------------------

# 9. Modelo de datos exacto

> No crear tablas ni atributos adicionales durante el MVP sin
> documentarlos previamente como cambio propuesto al PRD.

## 9.1 Tabla `rol`

  Atributo   Tipo            Nulo Clave   Restricción
  ---------- ------------- ------ ------- --------------
  id_rol     SERIAL            NO PK      Autogenerado
  nombre     VARCHAR(30)       NO ---     UNIQUE

## 9.2 Tabla `usuario`

  Atributo        Tipo             Nulo Clave   Restricción
  --------------- -------------- ------ ------- ------------------------
  id_usuario      SERIAL             NO PK      Autogenerado
  nombre          VARCHAR(80)        NO ---     Obligatorio
  usuario         VARCHAR(30)        NO ---     UNIQUE
  password_hash   VARCHAR(255)       NO ---     Obligatorio
  estado          BOOLEAN            NO ---     DEFAULT TRUE
  id_rol          INT                NO FK      REFERENCES rol(id_rol)

## 9.3 Tabla `categoria`

  Atributo       Tipo            Nulo Clave   Restricción
  -------------- ------------- ------ ------- --------------
  id_categoria   SERIAL            NO PK      Autogenerado
  nombre         VARCHAR(40)       NO ---     UNIQUE

## 9.4 Tabla `producto`

  Atributo       Tipo              Nulo Clave   Restricción
  -------------- --------------- ------ ------- ------------------------------------
  id_producto    SERIAL              NO PK      Autogenerado
  codigo         VARCHAR(20)         NO ---     UNIQUE
  nombre         VARCHAR(80)         NO ---     Obligatorio
  marca          VARCHAR(40)         SÍ ---     Opcional
  precio_venta   DECIMAL(10,2)       NO ---     CHECK \> 0
  stock_actual   INT                 NO ---     DEFAULT 0, CHECK \>= 0
  stock_minimo   INT                 NO ---     DEFAULT 0, CHECK \>= 0
  estado         BOOLEAN             NO ---     DEFAULT TRUE
  id_categoria   INT                 NO FK      REFERENCES categoria(id_categoria)

## 9.5 Tabla `venta`

  Atributo     Tipo              Nulo Clave   Restricción
  ------------ --------------- ------ ------- --------------------------------
  id_venta     SERIAL              NO PK      Autogenerado
  fecha_hora   TIMESTAMP           NO ---     DEFAULT CURRENT_TIMESTAMP
  total        DECIMAL(10,2)       NO ---     CHECK \>= 0
  id_usuario   INT                 NO FK      REFERENCES usuario(id_usuario)

## 9.6 Tabla `detalle_venta`

  Atributo          Tipo              Nulo Clave   Restricción
  ----------------- --------------- ------ ------- ----------------------------------
  id_detalle        SERIAL              NO PK      Autogenerado
  cantidad          INT                 NO ---     CHECK \> 0
  precio_unitario   DECIMAL(10,2)       NO ---     CHECK \> 0
  subtotal          DECIMAL(10,2)       NO ---     CHECK \>= 0
  id_venta          INT                 NO FK      REFERENCES venta(id_venta)
  id_producto       INT                 NO FK      REFERENCES producto(id_producto)

## 9.7 Tabla `movimiento_inventario`

  Atributo           Tipo             Nulo Clave   Restricción
  ------------------ -------------- ------ ------- ----------------------------------
  id_movimiento      SERIAL             NO PK      Autogenerado
  tipo               VARCHAR(15)        NO ---     CHECK IN ('ENTRADA','SALIDA')
  cantidad           INT                NO ---     CHECK \> 0
  stock_anterior     INT                NO ---     CHECK \>= 0
  stock_resultante   INT                NO ---     CHECK \>= 0
  fecha_hora         TIMESTAMP          NO ---     DEFAULT CURRENT_TIMESTAMP
  referencia         VARCHAR(80)        SÍ ---     Opcional
  observacion        VARCHAR(200)       SÍ ---     Opcional
  id_producto        INT                NO FK      REFERENCES producto(id_producto)
  id_usuario         INT                NO FK      REFERENCES usuario(id_usuario)

------------------------------------------------------------------------

# 10. Validaciones por entidad

## `rol`

-   `nombre` obligatorio.
-   máximo 30 caracteres.
-   no duplicado.

## `usuario`

-   `nombre` obligatorio y máximo 80 caracteres.
-   `usuario` obligatorio, máximo 30 caracteres y único.
-   `password_hash` obligatorio.
-   `estado` debe ser booleano.
-   `id_rol` debe existir.

## `categoria`

-   `nombre` obligatorio.
-   máximo 40 caracteres.
-   único.

## `producto`

-   `codigo` obligatorio, máximo 20 caracteres y único.
-   `nombre` obligatorio y máximo 80 caracteres.
-   `marca` opcional y máximo 40 caracteres.
-   `precio_venta > 0`.
-   `stock_actual >= 0`.
-   `stock_minimo >= 0`.
-   `estado` booleano.
-   `id_categoria` debe existir.

## `venta`

-   `fecha_hora` obligatoria, con valor por defecto.
-   `total >= 0`.
-   `id_usuario` debe existir.

## `detalle_venta`

-   `cantidad > 0`.
-   `precio_unitario > 0`.
-   `subtotal >= 0`.
-   `id_venta` debe existir.
-   `id_producto` debe existir.

## `movimiento_inventario`

-   `tipo` únicamente `ENTRADA` o `SALIDA`.
-   `cantidad > 0`.
-   `stock_anterior >= 0`.
-   `stock_resultante >= 0`.
-   `referencia` máximo 80 caracteres cuando se utilice.
-   `observacion` máximo 200 caracteres cuando se utilice.
-   producto y usuario deben existir.

------------------------------------------------------------------------

# 11. Reglas de integridad referencial

  -----------------------------------------------------------------------------------------
  Relación                            ON UPDATE         ON DELETE         Motivo
  ----------------------------------- ----------------- ----------------- -----------------
  usuario.id_rol → rol.id_rol         CASCADE           RESTRICT          Impedir eliminar
                                                                          roles utilizados

  producto.id_categoria →             CASCADE           RESTRICT          Impedir productos
  categoria.id_categoria                                                  con categoría
                                                                          inválida

  venta.id_usuario →                  CASCADE           RESTRICT          Conservar
  usuario.id_usuario                                                      trazabilidad de
                                                                          la venta

  detalle_venta.id_venta →            CASCADE           CASCADE           Los detalles
  venta.id_venta                                                          dependen de la
                                                                          venta

  detalle_venta.id_producto →         CASCADE           RESTRICT          Proteger
  producto.id_producto                                                    historial de
                                                                          ventas

  movimiento_inventario.id_producto → CASCADE           RESTRICT          Proteger
  producto.id_producto                                                    historial de
                                                                          inventario

  movimiento_inventario.id_usuario →  CASCADE           RESTRICT          Conservar
  usuario.id_usuario                                                      responsable del
                                                                          movimiento
  -----------------------------------------------------------------------------------------

Además:

-   no permitir stock negativo;
-   no permitir códigos duplicados;
-   no eliminar físicamente productos con historial desde la interfaz
    normal;
-   las operaciones compuestas de venta deben ejecutarse de forma
    consistente.

------------------------------------------------------------------------

# 12. Requisitos UI/UX

El diseño debe seguir los principios trabajados durante la arquitectura
de interfaz.

## 12.1 Consistencia

-   mismos estilos de botones para acciones equivalentes;
-   formularios con distribución uniforme;
-   navegación estable;
-   mensajes con lenguaje comprensible.

## 12.2 Control del usuario

-   confirmar acciones importantes;
-   permitir cancelar formularios;
-   permitir quitar productos antes de confirmar una venta;
-   no guardar automáticamente una operación incompleta.

## 12.3 Reducción de carga de memoria

-   mostrar nombres de productos y categorías;
-   mostrar stock disponible durante la venta y el inventario;
-   mostrar subtotal y total automáticamente;
-   no obligar al usuario a memorizar identificadores internos.

## 12.4 Prevención de errores

-   validación antes de guardar;
-   deshabilitar confirmación cuando falten datos obligatorios;
-   advertir stock insuficiente;
-   impedir valores negativos;
-   informar claramente el resultado de cada operación.

## 12.5 Pantallas mínimas

-   Login.
-   Dashboard.
-   Listado de productos.
-   Formulario de producto.
-   Entrada de inventario.
-   Registro de venta.

------------------------------------------------------------------------

# 13. Requisitos de seguridad

-   **RS-01:** nunca almacenar contraseñas en texto plano.
-   **RS-02:** `password_hash` debe contener únicamente una
    representación segura de la contraseña.
-   **RS-03:** nunca almacenar PAT de GitHub dentro del repositorio.
-   **RS-04:** nunca subir `.env` con credenciales reales.
-   **RS-05:** incluir `.env` en `.gitignore`.
-   **RS-06:** publicar únicamente `.env.example` sin secretos.
-   **RS-07:** proteger rutas que requieran autenticación.
-   **RS-08:** validar permisos y sesión antes de ejecutar operaciones
    protegidas.
-   **RS-09:** no exponer mensajes internos de base de datos
    directamente al usuario final.
-   **RS-10:** validar los datos tanto en la interfaz como en la capa de
    persistencia.
-   **RS-11:** las operaciones críticas de venta e inventario deben
    evitar persistencia parcial.
-   **RS-12:** no mostrar tokens, contraseñas ni claves privadas en las
    capturas del informe.

------------------------------------------------------------------------

# 14. Backlog del MVP

  ---------------------------------------------------------------------------
  Prioridad         ID                Elemento              Sprint
  ----------------- ----------------- --------------------- -----------------
  Alta              HU01              Iniciar sesión        Sprint 1

  Alta              HU02              Gestionar productos   Sprint 1

  Alta              HU03              Registrar entrada de  Sprint 1
                                      inventario            

  Alta              HU04              Registrar venta       Sprint 1

  Alta              TEC-01            Configurar proyecto   Sprint 1
                                      React/Vite            

  Alta              TEC-02            Configurar            Sprint 1
                                      persistencia          
                                      PostgreSQL/Supabase   

  Alta              TEC-03            Configurar variables  Sprint 1
                                      de entorno            

  Alta              TEC-04            Implementar servicios Sprint 1
                                      de acceso a datos     

  Alta              QA-01             Probar HU01           Sprint 1

  Alta              QA-02             Probar HU02           Sprint 1

  Alta              QA-03             Probar HU03           Sprint 1

  Alta              QA-04             Probar HU04           Sprint 1

  Alta              QA-05             Verificar al menos    Sprint 1
                                      tres registros reales 
                                      creados desde la      
                                      aplicación            

  Media             REF-01            Refactorizar          Sprint 1
                                      componentes y         
                                      servicios             

  Media             DOC-01            Actualizar README y   Sprint 1
                                      documentación         
  ---------------------------------------------------------------------------

------------------------------------------------------------------------

# 15. Definition of Done

Una Historia de Usuario se considera terminada únicamente cuando:

1.  cumple todos sus criterios de aceptación;
2.  la funcionalidad puede ejecutarse desde la interfaz;
3.  los datos se almacenan correctamente;
4.  las validaciones funcionan;
5.  no produce errores críticos en consola;
6.  respeta el modelo de datos;
7.  respeta las reglas de negocio;
8.  el código se encuentra versionado en GitHub;
9.  se realizó una prueba positiva;
10. se realizó al menos una prueba de error relevante;
11. la funcionalidad continúa operando después de la refactorización;
12. existe evidencia visual para la presentación cuando corresponda.

El MVP completo se considera terminado cuando las cuatro HU cumplen esta
definición y existen al menos tres registros reales creados desde la
aplicación y verificables en la base de datos.

------------------------------------------------------------------------

# 16. Restricciones técnicas

-   El PRD es la fuente principal para la implementación.
-   Antes de modificar una funcionalidad, revisar el PRD y los UML
    correspondientes.
-   No crear tablas o atributos distintos a los definidos en este
    documento sin registrar primero una propuesta de cambio.
-   Mantener la estructura modular del código.
-   No incluir secretos en GitHub.
-   Mantener compatibilidad con el esquema PostgreSQL definido.
-   El MVP debe funcionar como aplicación web.
-   Las funcionalidades deben implementarse por módulos, no mediante una
    única generación masiva.
-   Cada HU debe probarse antes de continuar con la siguiente.
-   La refactorización no debe modificar el comportamiento funcional
    validado.
-   Los errores generados por la IA deben revisarse; el equipo no debe
    aceptar automáticamente la primera solución.
-   Los commits deben ser pequeños y descriptivos.

------------------------------------------------------------------------

# 17. Requisitos legales aplicables en Bolivia

## 17.1 Ley N.º 259 --- Control al Expendio y Consumo de Bebidas Alcohólicas

Para el contexto del proyecto se considera la obligación aplicable a la
comercialización de bebidas alcohólicas de **no vender bebidas
alcohólicas a menores de dieciocho años**.

Como requisito funcional del MVP:

-   **RL-01:** el flujo de venta debe recordar al vendedor que no puede
    realizarse la venta de bebidas alcohólicas a una persona menor de 18
    años.
-   **RL-02:** antes de confirmar la venta, la interfaz debe solicitar
    al vendedor confirmar que verificó la mayoría de edad cuando
    corresponda.
-   **RL-03:** esta confirmación es un control operativo de interfaz y
    no sustituye las obligaciones legales del establecimiento ni la
    verificación física correspondiente.

### Restricción del modelo de datos

El diccionario de datos aprobado no contiene atributos para almacenar
información del comprador ni su documento de identidad. Por lo tanto,
**el MVP no debe inventar columnas para almacenar CI, fecha de
nacimiento o datos personales del comprador**.

Si en una versión futura se requiere registrar evidencia de
verificación, deberá diseñarse como una modificación formal del modelo
de datos, evaluando previamente necesidad, privacidad y alcance.

------------------------------------------------------------------------

# 18. Plan de implementación mediante Vibe Coding

## Etapa 1 --- Preparación

-   verificar documentación en GitHub;
-   crear `PRD.md`;
-   comprobar conexión de Antigravity mediante MCP;
-   no exponer PAT.

## Etapa 2 --- Base técnica

-   inicializar React + Vite;
-   configurar navegación;
-   crear layout;
-   configurar persistencia;
-   crear `.env.example`.

## Etapa 3 --- HU01

-   implementar Login;
-   proteger rutas;
-   probar acceso correcto e incorrecto;
-   probar usuario inactivo;
-   implementar cierre de sesión.

## Etapa 4 --- HU02

-   implementar listado;
-   búsqueda;
-   alta;
-   edición;
-   desactivación;
-   validaciones.

## Etapa 5 --- HU03

-   consultar stock;
-   registrar entrada;
-   actualizar producto;
-   registrar movimiento;
-   validar consistencia.

## Etapa 6 --- HU04

-   crear carrito/detalle temporal;
-   validar disponibilidad;
-   calcular subtotales;
-   calcular total;
-   confirmar mayoría de edad;
-   persistir venta;
-   persistir detalles;
-   descontar stock;
-   registrar movimientos de salida;
-   validar consistencia.

## Etapa 7 --- QA y refactorización

-   ejecutar matriz de criterios de aceptación;
-   corregir incumplimientos;
-   eliminar código duplicado;
-   mejorar separación de responsabilidades;
-   repetir pruebas.

## Etapa 8 --- Evidencias

-   capturar MCP conectado;
-   capturar `PRD.md`;
-   capturar HU01;
-   capturar HU02;
-   capturar HU03;
-   capturar HU04;
-   capturar base de datos con mínimo tres registros reales creados
    desde la aplicación.

------------------------------------------------------------------------

# 19. Matriz de trazabilidad resumida

  ------------------------------------------------------------------------------
  Historia          Interfaz          Entidades principales    Evidencia
  ----------------- ----------------- ------------------------ -----------------
  HU01              Login / Dashboard usuario, rol             Acceso válido e
                                                               inválido

  HU02              Productos /       producto, categoria      Producto creado y
                    Formulario                                 listado

  HU03              Entrada de        producto,                Stock actualizado
                    inventario        movimiento_inventario,   y movimiento
                                      usuario                  

  HU04              Registro de venta venta, detalle_venta,    Venta, detalles y
                                      producto,                stock actualizado
                                      movimiento_inventario,   
                                      usuario                  
  ------------------------------------------------------------------------------

------------------------------------------------------------------------

# 20. Criterios generales de calidad del MVP

El MVP debe:

-   ser navegable;
-   mostrar mensajes claros;
-   mantener consistencia visual;
-   impedir entradas inválidas;
-   conservar integridad referencial;
-   guardar datos reales;
-   impedir stock negativo;
-   mantener trazabilidad de usuario en ventas y movimientos;
-   proteger información sensible;
-   conservar correspondencia entre PRD, UML, modelo físico y código;
-   poder demostrarse de principio a fin durante la presentación.

------------------------------------------------------------------------

# 21. Instrucción para el agente de implementación

Antes de generar o modificar código:

1.  leer este `PRD.md`;
2.  revisar `/docs/uml/`;
3.  revisar `/docs/database/`;
4.  revisar `/docs/design/`;
5.  identificar la Historia de Usuario solicitada;
6.  implementar únicamente el alcance pedido;
7.  no inventar tablas o atributos;
8.  ejecutar pruebas;
9.  informar archivos modificados;
10. corregir errores antes de considerar terminada la tarea.
------------------------------------------------------------------------

## 22. Marco Legal y Ética de Datos

El Sistema de Gestión para la Licorería Al Paso debe proteger la
confidencialidad, integridad y disponibilidad de la información
almacenada y procesada por la aplicación.

### 22.1 Protección de la privacidad y Acción de Protección de Privacidad

El sistema reconoce el derecho de los usuarios a conocer, revisar,
rectificar y solicitar la eliminación de los datos personales
registrados sobre ellos, de conformidad con el artículo 130 de la
Constitución Política del Estado Plurinacional de Bolivia.

Para este propósito:

- Los datos personales deberán estar disponibles únicamente para
  usuarios autorizados.
- Los usuarios podrán solicitar la corrección de información incorrecta.
- Las solicitudes de eliminación deberán evaluarse considerando las
  obligaciones de conservación de registros comerciales y de auditoría.
- El sistema deberá impedir el acceso no autorizado a datos personales.
- Toda consulta o modificación de información sensible deberá quedar
  registrada cuando corresponda.

### 22.2 Ley N.º 164 de Telecomunicaciones y TIC

El sistema deberá implementar medidas orientadas a proteger la
privacidad de las personas y la seguridad de la información utilizada
por la plataforma.

Las medidas técnicas consideradas son:

- Autenticación obligatoria.
- Control de acceso basado en roles.
- Uso de conexiones seguras HTTPS/TLS.
- Prohibición de almacenar contraseñas en texto plano.
- Registro de operaciones relevantes.
- Validación de entradas antes de procesarlas.
- Protección de credenciales y variables de entorno.
- Uso de estándares abiertos y tecnologías interoperables cuando sea
  técnicamente posible.

### 22.3 Prevención del acceso y uso indebido de datos

Para reducir riesgos relacionados con el acceso, modificación,
eliminación o uso no autorizado de datos informáticos, el sistema debe:

- aplicar permisos mínimos necesarios;
- diferenciar los roles Administrador, Vendedor y Encargado de Inventario;
- registrar inicios de sesión y operaciones críticas;
- bloquear acciones no autorizadas;
- preservar la trazabilidad de ventas, movimientos de inventario y
  modificaciones importantes;
- no exponer claves privadas en el frontend ni en GitHub.

### 22.4 Tratamiento de credenciales

Las contraseñas nunca deben almacenarse directamente en campos de texto
plano.

La autenticación debe delegarse a un mecanismo seguro, como Supabase
Auth, que almacena hashes de contraseña utilizando mecanismos
especializados de autenticación.

El frontend nunca tendrá acceso a la contraseña original almacenada.

### 22.5 Datos sensibles y minimización

El sistema solo recopilará los datos estrictamente necesarios para su
operación.

Actualmente los datos principales son:

- datos de usuarios del sistema;
- productos y categorías;
- ventas;
- detalles de venta;
- movimientos de inventario;
- registros de auditoría.

No se recopilarán datos personales del comprador si no existe una
necesidad funcional o legal claramente definida.

### 22.6 Auditoría y trazabilidad

El sistema contará con una tabla `logs_auditoria` destinada a registrar
operaciones relevantes.

Cada registro podrá incluir:

- usuario responsable;
- fecha y hora;
- acción realizada;
- entidad afectada;
- identificador del registro;
- resultado de la operación;
- dirección IP cuando esté disponible;
- información técnica mínima necesaria para auditoría.

Los registros de auditoría no deberán ser modificables desde la
interfaz normal del sistema.

### 22.7 Principios éticos

El sistema seguirá los principios de:

- minimización de datos;
- acceso por necesidad;
- transparencia;
- trazabilidad;
- responsabilidad;
- seguridad por diseño;
- privacidad por diseño.

El uso de inteligencia artificial durante el desarrollo no sustituye la
responsabilidad del equipo sobre las decisiones de arquitectura,
seguridad y cumplimiento.

**Este PRD constituye la fuente principal de verdad para la
implementación del MVP de Licorería "Al Paso".**
