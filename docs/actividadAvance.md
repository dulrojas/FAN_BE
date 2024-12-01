# proy_actividad_avance Backend

========================
# C2 - Consulta por proyecto
========================
```json
{
    "procedure_name": "sp_proy_actividad_avance",
    "body": {
        "params": [
            { "name": "p_accion", "value": "C2", "type": "string" },
            { "name": "id_proy_actividad_avance", "value": null, "type": "int" },
            { "name": "id_proy_actividad", "value": 1, "type": "int" },
            { "name": "fecha_hora", "value": null, "type": "string" },
            { "name": "avance", "value": null, "type": "int" },
            { "name": "monto", "value": null, "type": "int" },
            { "name": "id_persona_reg", "value": null, "type": "int" }
        ]
    }
}
```
========================
# A1 - Agregar registro
========================
```json
{
    "procedure_name": "sp_proy_actividad_avance",
    "body": {
        "params": [
            { "name": "p_accion", "value": "A1", "type": "string" },
            { "name": "id_proy_actividad_avance", "value": null, "type": "int" },
            { "name": "id_proy_actividad", "value": 1, "type": "int" },
            { "name": "fecha_hora", "value": "2024-12-01", "type": "string" },
            { "name": "avance", "value": 25, "type": "int" },
            { "name": "monto", "value": 325, "type": "int" },
            { "name": "id_persona_reg", "value": 1, "type": "int" }
        ]
    }
}
```
========================
# M1 - Modificar registro
========================
```json
{
    "procedure_name": "sp_proy_actividad_avance",
    "body": {
        "params": [
            { "name": "p_accion", "value": "M1", "type": "string" },
            { "name": "id_proy_actividad_avance", "value": 11, "type": "int" },
            { "name": "id_proy_actividad", "value": 1, "type": "int" },
            { "name": "fecha_hora", "value": "2024-12-01", "type": "string" },
            { "name": "avance", "value": 30, "type": "int" },
            { "name": "monto_ejecutado", "value": 325, "type": "int" },
            { "name": "id_persona_reg", "value": 1, "type": "int" }
        ]
    }
}
```
========================
# D1 - Eliminar registro
========================
```json
{
    "procedure_name": "sp_proy_actividad_avance",
    "body": {
        "params": [
            { "name": "p_accion", "value": "D1", "type": "string" },
            { "name": "id_proy_actividad_avance", "value": 11, "type": "int" },
            { "name": "id_proy_actividad", "value": null, "type": "int" },
            { "name": "fecha_hora", "value": null, "type": "string" },
            { "name": "avance", "value": null, "type": "int" },
            { "name": "monto_ejecutado", "value": null, "type": "int" },
            { "name": "id_persona_reg", "value": null, "type": "int" }
        ]
    }
}
```