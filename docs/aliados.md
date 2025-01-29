# proy_aliados Backend

========================
# C1 - Consulta ALIADOS
========================
```json
{
  "procedure_name": "sp_aliados",
  "body": {
          "params": [
            { "name": "p_accion", "value": "C1", "type": "string" },
            { "name": "p_id_proy_aliado", "value":null, "type": "int" },
            { "name": "p_id_proyecto", "value":null, "type": "int" },            
            { "name": "p_id_organizacion", "value":null, "type": "int" },
            { "name": "p_referente", "value":null, "type": "string" },
            { "name": "p_vinculo", "value":null, "type": "string" },
            { "name": "p_idp_convenio", "value":null, "type": "string" },
            { "name": "p_id_persona_reg", "value":null, "type": "int" },
            { "name": "fecha", "value":null, "type": "string" },
            { "name": "p_fecha_hora_reg", "value":null, "type": "string" }
          ]
        }
}
```
========================
# C2 - Consulta por proyecto
========================
```json
{
        "procedure_name": "sp_aliados",
        "body": {
          "params": [
            { "name": "p_accion", "value": "C2", "type": "string" },
            { "name": "p_id_proy_aliado", "value":null, "type": "int" },
            { "name": "p_id_proyecto", "value":1, "type": "int" },            
            { "name": "p_id_organizacion", "value":  null, "type": "int" },
            { "name": "p_referente", "value": null, "type": "string" },
            { "name": "p_vinculo", "value":  null, "type": "string" },
            { "name": "p_idp_convenio", "value": null, "type": "string" },
            { "name": "p_id_persona_reg", "value":  null, "type": "int" },
            { "name": "p_fecha", "value":  null, "type": "string" },
            { "name": "p_fecha_hora_reg", "value": null, "type": "string" }            
          ]
        }
      }
```
========================
# A1 - Agregar ALIADO
========================
```json
{
    "procedure_name": "sp_aliados",
    "body": {
        "params": [
            { "name": "p_accion", "value": "A1", "type": "string" },
            { "name": "p_id_proy_aliado", "value": null, "type": "int" },
            { "name": "p_id_proyecto", "value": 1, "type": "int" },            
            { "name": "p_id_organizacion", "value": 5, "type": "int" },
            { "name": "p_referente", "value": "pruebaPostman", "type": "string" },
            { "name": "p_vinculo", "value": "pruebaPostman", "type": "string" },
            { "name": "p_idp_convenio", "value": 1, "type": "int" },
            { "name": "p_id_persona_reg", "value": 7, "type": "int" },
            { "name": "p_fecha", "value": "2024-11-04", "type": "string"},
            { "name": "p_fecha_hora_reg", "value": "2024-11-04 12:00:00", "type": "string"}
        ]
    }
}
```
========================
# M1 - Modificar ALIADO
========================
```json
{
    "procedure_name": "sp_aliados",
    "body": {
        "params": [
            { "name": "p_accion", "value": "M1", "type": "string" },
            { "name": "p_id_proy_aliado", "value": 268, "type": "int" },
            { "name": "p_id_proyecto", "value": 1, "type": "int" },            
            { "name": "p_id_organizacion", "value": 2, "type": "int" },
            { "name": "p_referente", "value": "pruebaPostmanEDIT", "type": "string" },
            { "name": "p_vinculo", "value": "pruebaPostmanEDIT", "type": "string" },
            { "name": "p_idp_convenio", "value": 1, "type": "int" },
            { "name": "p_id_persona_reg", "value": 7, "type": "int" },
            { "name": "p_fecha", "value": "2024-11-04", "type": "string"},
            { "name": "p_fecha_hora_reg", "value": "2024-11-04 12:00:00", "type": "string"}
        ]
    }
}
```
========================
# D1 - Eliminar ALIADO
========================
```json
{
            "procedure_name": "sp_aliados",
            "body": {
              "params": [
                { "name": "p_accion", "value": "D1", "type": "string" },
                { "name": "p_id_proy_aliado", "value": 267, "type": "int" },
                { "name": "p_id_proyecto", "value": null, "type": "int" },
                { "name": "p_id_organizacion", "value": null, "type": "int" },
                { "name": "p_referente", "value": null, "type": "string" },
                { "name": "p_vinculo", "value": null, "type": "string" },
                { "name": "p_idp_convenio", "value": null, "type": "int" },
                { "name": "p_id_persona_reg", "value": null, "type": "int" },
                { "name": "p_fecha", "value": null, "type": "string" },
                { "name": "p_fecha_hora_reg", "value": null, "type": "string" }
              ]
            }
          }
```
