export class ProductService {

    getProduct(parametro) {
        return fetch(
            //Llamdo al servicio JSON
            //"http://proyectomovilmoya.somee.com/ServicioProductos.svc/listaProductos/" + parametro
            
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioProductos.svc/listaProductosStock/" + parametro
            //"data/Products.json"
        ).then(res =>res.json() ).then(d=>d).catch((error) => console.log(error));
    }

    getAllProducts() {
        return fetch(
            //Llamdo al servicio JSON
            //"http://proyectomovilmoya.somee.com/ServicioProductos.svc/listaProductos/" + parametro
            
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioProductos.svc/listaAllProductos"
            //"data/Products.json"
        ).then(res =>res.json() ).then(d=>d).catch((error) => console.log(error));
    }

    getCustomer(parametro) {
        return fetch(
            //Llamdo al servicio JSON
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioCliente.svc/listaClientes/" + parametro
            
            //"data/Products.json"
        ).then(res => res.json()).then(d=>d).catch((error) => console.log(error));

    }

    getAllCustomers() {
        return fetch(
            //Llamdo al servicio JSON
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioCliente.svc/listaAllClientes"
            
            //"data/Products.json"
        ).then(res => res.json()).then(d=>d).catch((error) => console.log(error));

    }

    getEmployee(parametro) {
        return fetch(
            //Llamdo al servicio JSON
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioVendedor.svc/listaVendedores/" + parametro
            
            //"data/Products.json"
        ).then(res => res.json()).then(d=>d).catch((error) => console.log(error));

    }

    getAllEmployees() {
        return fetch(
            //Llamdo al servicio JSON
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioVendedor.svc/listaAllVendedores"
            
            //"data/Products.json"
        ).then(res => res.json()).then(d=>d).catch((error) => console.log(error));

    }
    
    getFacturas() {
        return fetch(
            //Llamdo al servicio JSON
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioFactura.svc/devolverListaFacturas"
            
            //"data/Products.json"
        ).then(res => res.json()).then(d=>d).catch((error) => console.log(error));

    }

    getDetalle(parametro) {
        return fetch(
            //Llamdo al servicio JSON
            "http://proyecto-aplicaciones-moviles.somee.com/devolverDetalleFactura/" + parametro
            
            //"data/Products.json"
        ).then(res => res.json()).then(d=>d).catch((error) => console.log(error));

    }
}
