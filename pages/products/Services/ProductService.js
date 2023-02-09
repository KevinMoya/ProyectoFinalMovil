export class ProductService {

    getProducts() {
        return fetch(
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioProductos.svc/listaAllProductos"
        ).then(res => res.json()).then(d => d).catch((error) => console.log(error));
    }

    getCategories() {
        return fetch(
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioCategoria.svc/listaCategorias"
        ).then(res => res.json()).then(d => d).catch((error) => console.log(error));
    }

    getBestProducts() {
        return fetch(
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioEstadisticas.svc/mejoresProductos"
        ).then(res => res.json()).then(d => d).catch((error) => console.log(error));
    }

}