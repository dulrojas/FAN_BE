# tes_ctas_x_cobrar Backend

========================
# C1 - Consulta Gral 
========================
```json
{
    "procedure_name": "sp_persona",
    "body": {
        "params": [
            {"name": "p_accion","value": "C1","type": "string"},
            {"name": "p_id_persona","value": null,"type": "int"},
            {"name": "p_nombres","value": null,"type": "string"},
            {"name": "p_apellido_1","value": null,"type": "string"},
            {"name": "p_apellido_2","value": null,"type": "string"},
            {"name": "p_nro_documento","value": null,"type": "string"},
            {"name": "p_correo","value": null,"type": "string"},
            {"name": "p_telefono","value": null,"type": "string"},
            {"name": "p_fecha_registro","value": null,"type": "string"},
            {"name": "p_usuario","value": null,"type": "string"},
            {"name": "p_contrasenia","value": null,"type": "string"},
            {"name": "p_ruta_foto","value": null,"type": "string"},
            {"name": "p_idp_tipo_documento","value": null,"type": "int"},
            {"name": "p_idp_estado","value": null,"type": "int"},
            {"name": "p_idp_tipo_red_social","value": null,"type": "int"},
            {"name": "p_firebase","value": null,"type": "string"},
            {"name": "p_id_tipo_institucion","value": null,"type": "int"},
            {"name": "p_id_inst_unidad","value": null,"type": "int"},
            {"name": "p_cargo","value": null,"type": "string"},
            {"name": "p_admi_sistema","value": null,"type": "boolean"}
        ]
    }
}
```


========================
# A1 - Agregar Registro
========================
```json
{
    "procedure_name": "sp_persona",
    "body": {
        "params": [
            {"name": "p_accion","value": "A1","type": "string"},
            {"name": "p_id_persona","value": null,"type": "int"},
            {"name": "p_nombres","value": "Juan","type": "string"},
            {"name": "p_apellido_1","value": "Perez","type": "string"},
            {"name": "p_apellido_2","value": "Test","type": "string"},
            {"name": "p_nro_documento","value": "12345678","type": "string"},
            {"name": "p_correo","value": "juanTest@gamil.com","type": "string"},
            {"name": "p_telefono","value": "12345678","type": "string"},
            {"name": "p_fecha_registro","value": "2024-10-01","type": "string"},
            {"name": "p_usuario","value": "JuanTest","type": "string"},
            {"name": "p_contrasenia","value": "12345678","type": "string"},
            {"name": "p_ruta_foto","value": "","type": "string"},
            {"name": "p_idp_tipo_documento","value": 1,"type": "int"},
            {"name": "p_idp_estado","value": 1,"type": "int"},
            {"name": "p_idp_tipo_red_social","value": 1,"type": "int"},
            {"name": "p_firebase","value": "","type": "string"},
            {"name": "p_id_tipo_institucion","value": 1,"type": "int"},
            {"name": "p_id_inst_unidad","value": 1,"type": "int"},
            {"name": "p_cargo","value": "Tested","type": "string"},
            {"name": "p_admi_sistema","value": true,"type": "boolean"}
        ]
    }
}
```