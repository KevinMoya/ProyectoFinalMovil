export class VendorsService {

    getEmployees() {
        return fetch(
            //Llamdo al servicio JSON
            "http://proyecto-aplicaciones-moviles.somee.com/ServicioVendedor.svc/listaAllVendedores"
            
            //"data/Products.json"
        ).then(res => res.json()).then(d=>d).catch((error) => console.log(error));

    }

}
