package publicaciones.model;

public enum EstadoPublicacion {
    BORRADOR("Borrador"),
    EN_REVISION("En Revisión"),
    CAMBIOS_SOLICITADOS("Cambios Solicitados"),
    APROBADO("Aprobado"),
    PUBLICADO("Publicado"),
    RETIRADO("Retirado");

    private final String descripcion;

    EstadoPublicacion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
