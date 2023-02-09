export class ProductService {

    getCustomers() {
        return fetch(
            //Llamdo al servicio JSON
            "http://www.moviles.net/ServicioCliente.svc/listaAllClientes"
            
            //"data/Products.json"
        ).then(res => res.json()).then(d=>d).catch((error) => console.log(error));

    }
}
