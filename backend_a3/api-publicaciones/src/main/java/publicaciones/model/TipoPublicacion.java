package publicaciones.model;

public enum TipoPublicacion {
    ARTICULO("Artículo"),
    LIBRO("Libro");

    private final String descripcion;

    TipoPublicacion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
