# proy_actividad Backend

========================
# C2 - Consulta por proyecto
========================
```json
{
    "procedure_name": "sp_proy_actividad",
    "body": {
        "params": [
            { "name": "p_accion", "value": "C2", "type": "string" },
            { "name": "id_proy_actividad", "value": null, "type": "int" },
            { "name": "id_proyecto", "value": 1, "type": "int" },
            { "name": "id_proy_elemento_padre", "value": null, "type": "int" },
            { "name": "codigo", "value": null, "type": "string" },
            { "name": "actividad", "value": null, "type": "string" },
            { "name": "descripcion", "value": null, "type": "string" },
            { "name": "orden", "value": null, "type": "int" },
            { "name": "id_proy_acti_repro", "value": null, "type": "int" },
            { "name": "presupuesto", "value": null, "type": "int" },    
            { "name": "fecha_inicio", "value": null, "type": "string" },
            { "name": "fecha_fin", "value": null, "type": "string" },
            { "name": "resultado", "value": null, "type": "string" },
            { "name": "idp_actividad_estado", "value": null, "type": "int" }
        ]
    }
}
```
========================
# A1 - Agregar registro
========================
```json
{
    "procedure_name": "sp_proy_actividad",
    "body": {
        "params": [
            { "name": "p_accion", "value": "A1", "type": "string" },
            { "name": "id_proy_actividad", "value": null, "type": "int" },
            { "name": "id_proyecto", "value": 1, "type": "int" },
            { "name": "id_proy_elemento_padre", "value": 2, "type": "int" },
            { "name": "codigo", "value": "124asd", "type": "string" },
            { "name": "actividad", "value": "Actividad test", "type": "string" },
            { "name": "descripcion", "value": "Descripcion test", "type": "string" },
            { "name": "orden", "value": 2, "type": "int" },
            { "name": "id_proy_acti_repro", "value": null, "type": "int" },
            { "name": "presupuesto", "value": 120, "type": "int" },    
            { "name": "fecha_inicio", "value": "2024-12-01", "type": "string" },
            { "name": "fecha_fin", "value": "2024-12-20", "type": "string" },
            { "name": "resultado", "value": "Resultado test", "type": "string" },
            { "name": "idp_actividad_estado", "value": 1, "type": "int" }
        ]
    }
}
```
========================
# M1 - Modificar registro
========================
```json
{
    "procedure_name": "sp_proy_actividad",
    "body": {
        "params": [
            { "name": "p_accion", "value": "M1", "type": "string" },
            { "name": "id_proy_actividad", "value": 11, "type": "int" },
            { "name": "id_proyecto", "value": 1, "type": "int" },
            { "name": "id_proy_elemento_padre", "value": 2, "type": "int" },
            { "name": "codigo", "value": "124asd", "type": "string" },
            { "name": "actividad", "value": "Actividad test Edit", "type": "string" },
            { "name": "descripcion", "value": "Descripcion test", "type": "string" },
            { "name": "orden", "value": 2, "type": "int" },
            { "name": "id_proy_acti_repro", "value": null, "type": "int" },
            { "name": "presupuesto", "value": 120, "type": "int" },    
            { "name": "fecha_inicio", "value": "2024-12-01", "type": "string" },
            { "name": "fecha_fin", "value": "2024-12-20", "type": "string" },
            { "name": "resultado", "value": "Resultado test", "type": "string" },
            { "name": "idp_actividad_estado", "value": 1, "type": "int" }
        ]
    }
}
```
========================
# D1 - Eliminar registro
========================
```json
{
    "procedure_name": "sp_proy_actividad",
    "body": {
        "params": [
            { "name": "p_accion", "value": "D1", "type": "string" },
            { "name": "id_proy_actividad", "value": 11, "type": "int" },
            { "name": "id_proyecto", "value": null, "type": "int" },
            { "name": "id_proy_elemento_padre", "value": null, "type": "int" },
            { "name": "codigo", "value": null, "type": "string" },
            { "name": "actividad", "value": null, "type": "string" },
            { "name": "descripcion", "value": null, "type": "string" },
            { "name": "orden", "value": null, "type": "int" },
            { "name": "id_proy_acti_repro", "value": null, "type": "int" },
            { "name": "presupuesto", "value": null, "type": "int" },    
            { "name": "fecha_inicio", "value": null, "type": "string" },
            { "name": "fecha_fin", "value": null, "type": "string" },
            { "name": "resultado", "value": null, "type": "string" },
            { "name": "idp_actividad_estado", "value": null, "type": "int" }
        ]
    }
}
```