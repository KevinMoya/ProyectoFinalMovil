import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { ProductService } from './Services/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';

const Crud = () => {
    let emptyProduct = {
        CustomerID: '',
        Name: '',
        LastName: '',
        Phone: '',
        Email: '',
        Password: ''
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [isInserting, setIsInserting] = useState(false);
    const [enableId, setEnableId] = useState(false);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const { user } = useContext(LayoutContext);

    var desabilitado = () => {
        if (user.Rol == "ADMIN") {
            return false;
        } else {
            return true;
        }
    }

    useEffect(() => {
        const productService = new ProductService();
        productService.getCustomers().then((data) => setProducts(data));
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
        setIsInserting(true);
        setEnableId(false);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const cedulaExiste = () => {
        for (let index = 0; index < products.length; index++) {
            if (products[index].CustomerID == product.CustomerID && isInserting) {
                return true;
            }
        }
        return false;
    }

    const saveProduct = async () => {
        setSubmitted(true);

        if (product.CustomerID.length == 10 && product.Name.length >= 3 && product.LastName.length >= 3 && product.Email.length > 9 && product.Phone.length == 10 && product.Password.length > 3) {
            if (validarCedula() || !isInserting) {
                if (validarContraseña()) {
                    let _products = [...products];
                    let _product = { ...product };

                    if (isInserting) {
                        if (cedulaExiste()) {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Cedula ya registrada', life: 3000 });
                        } else {
                            const url = "http://www.moviles.net/ServicioCliente.svc/insertarCliente/" + product.CustomerID + "/"
                                + product.Name + "/" + product.LastName + "/" + product.Phone + "/" + product.Email + "/" + product.Password;

                            const respuesta = await fetch(url);
                            const respuestaJSON = await respuesta.json();

                            console.log(url);

                            if (parseInt(respuestaJSON) !== 0) {

                                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Insertado', life: 3000 });
                            } else {
                                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Cliente no Insertado', life: 3000 });
                            }
                            const productService = new ProductService();
                            productService.getCustomers().then((data) => setProducts(data));
                            setProductDialog(false);
                            setProduct(emptyProduct);
                            setSubmitted(false);
                        }
                    } else {
                        const url = "http://www.moviles.net/ServicioCliente.svc/actualizarCliente/" + product.CustomerID + "/"
                            + product.Name + "/" + product.LastName + "/" + product.Phone + "/" + product.Email + "/" + product.Password;

                        const respuesta = await fetch(url);
                        const respuestaJSON = await respuesta.json();

                        if (parseInt(respuestaJSON) !== 0) {
                            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Actualizado', life: 3000 });
                        } else {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Cliente no Actualizado', life: 3000 });
                        }
                        setIsInserting(false);
                        const productService = new ProductService();
                        productService.getCustomers().then((data) => setProducts(data));
                        setProductDialog(false);
                        setProduct(emptyProduct);
                        setSubmitted(false);
                    }

                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Contraseña no cumple con los requerimientos', life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'error', summary: 'Información!', detail: 'Cedula no tiene formato correcto', life: 3000 });
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Información!', detail: 'Verifique que los datos sean correctos', life: 3000 });
        }

    };

    const validarContraseña = () => {
        var mayusRVV = false;
        var minusRVV = false;
        var numRVV = false;
        var carRVV = false;
        var bRVV = false;

        const mayusculas = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        const minusculas = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        const caracteres = [".", ",", "_", "@", "#", "!", "#", "$", "%", "-", "+", "*"];
        const numero = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

        if (product.Password.length >= 4 && product.Password.length <= 20) {

            for (let i = 0; i < product.Password.length; i++) {

                if (numero.includes(product.Password[i])) {
                    numRVV = true;
                }

                if (mayusculas.includes(product.Password[i])) {
                    mayusRVV = true;
                }

                if (minusculas.includes(product.Password[i])) {
                    minusRVV = true;
                }
                if (caracteres.includes(product.Password[i])) {
                    carRVV = true;
                }

            }

            if (numRVV && minusRVV && mayusRVV && carRVV) {
                return true;
            } else {
                return false;
            }



        } else {
            return false;
        }
    }

    const validarCedula = () => {

        let cedulaCorrectaRVV = false;

        try {
            if (product.CustomerID.length === 10) {
                let tercerDigitoRVV = parseInt(product.CustomerID.substring(2, 3));

                if (tercerDigitoRVV < 6) {

                    let coefValCedulaRVV = [2, 1, 2, 1, 2, 1, 2, 1, 2];
                    let verificadorRVV = parseInt(product.CustomerID.substring(9, 10))
                    var sumaRVV = 0
                    var digitoRVV = 0

                    for (let i = 0; i < product.CustomerID.length - 1; i++) {

                        digitoRVV = parseInt(product.CustomerID.substring(i, i + 1)) * coefValCedulaRVV[i]
                        sumaRVV += parseInt(digitoRVV % 10 + digitoRVV / 10)
                    }

                    if (sumaRVV % 10 == 0 && sumaRVV % 10 == verificadorRVV) {

                        cedulaCorrectaRVV = true

                    } else if (10 - sumaRVV % 10 == verificadorRVV) {

                        cedulaCorrectaRVV = true

                    } else {

                        cedulaCorrectaRVV = false

                    }
                } else {
                    cedulaCorrectaRVV = false
                }
            } else {
                toast.current.show({ severity: 'error', summary: 'Información!', detail: 'Llenar todos los campos', life: 3000 });
                cedulaCorrectaRVV = false
            }
        } catch (Exception) {

            cedulaCorrectaRVV = false
            console.log(Exception);
        }

        return cedulaCorrectaRVV
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
        setEnableId(true);
        setIsInserting(false);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        const url = "http://www.moviles.net/ServicioCliente.svc/deleteCliente/" + product.CustomerID;
        const respuesta = await fetch(url);
        const respuestaJSON = await respuesta.json();

        if (parseInt(respuestaJSON) !== 0) {
            let _products = products.filter((val) => val.CustomerID !== product.CustomerID);
            setProducts(_products);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Eliminado', life: 3000 });
        } else {
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Cliente', life: 3000 });
        }

    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = async () => {

        let boo = true;

        for (let index = 0; index < selectedProducts.length; index++) {
            const url = "http://www.moviles.net/ServicioCliente.svc/deleteCliente/" + selectedProducts[index].CustomerID;
            const respuesta = await fetch(url);
            const respuestaJSON = await respuesta.json();

            if (parseInt(respuestaJSON) == 0) {
                boo = false;
            }

        }

        if (boo) {
            const productService = new ProductService();
            productService.getCustomers().then((data) => setProducts(data));
            setDeleteProductsDialog(false);
            setProduct(emptyProduct);
            setSelectedProducts();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Eliminado', life: 3000 });
        } else {
            setDeleteProductsDialog(false);
            setSelectedProducts();
            setProduct(emptyProduct);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Algunos clientes no se eliminaron', life: 3000 });
        }
    };

    const onInputChange = (e, Name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${Name}`] = val.toUpperCase();

        setProduct(_product);
    };

    const onPasswordChange = (e, Name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${Name}`] = val;

        setProduct(_product);
    };

    const onPhoneChange = (e, Name) => {
        const val = (e.target && e.target.value) || '';
        const num = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        const n = val.length

        if (num.includes(val[n - 1])) {
            let _product = { ...product };
            _product[`${Name}`] = val;

            setProduct(_product);
        }

    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button disabled = {desabilitado()} label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={(!selectedProducts || !selectedProducts.length)||desabilitado()} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cédula</span>
                {rowData.CustomerID}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.Name}
            </>
        );
    };

    const lastNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellido</span>
                {rowData.LastName}
            </>
        );
    };

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Correo</span>
                {rowData.Email}
            </>
        );
    };

    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Teléfono</span>
                {rowData.Phone}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button disabled = {desabilitado()} icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button disabled = {desabilitado()} icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Clientes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    const img = "data:image/png;base64,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";


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="CustomerID"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
                        globalFilter={globalFilter}
                        emptyMessage="No clients found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="CustomerID" header="Cédula" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="LastName" header="Apellido" sortable body={lastNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Email" header="Correo" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Phone" header="Teléfono" sortable body={phoneBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalle del Cliente" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                        <img src={img} alt={img} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />

                        <div className="field">
                            <label htmlFor="code">Cédula</label>
                            <InputText maxlength="10" disabled={enableId} id="code" value={product.CustomerID} onChange={(e) => onPhoneChange(e, 'CustomerID')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.CustomerID.length != 10 })} />
                            {submitted && !product.CustomerID.length != 10 && <small className="p-invalid">Cédula es requerida</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText maxlength="20" id="name" value={product.Name} onChange={(e) => onInputChange(e, 'Name')} required className={classNames({ 'p-invalid': submitted && !product.Name.length < 5 })} />
                            {submitted && !product.Name.length < 5 && <small className="p-invalid">Nombre mínimo de 5 caracteres</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="lastname">Apellido</label>
                            <InputText maxlength="20" id="lastname" value={product.LastName} onChange={(e) => onInputChange(e, 'LastName')} required className={classNames({ 'p-invalid': submitted && !product.LastName.length < 5 })} />
                            {submitted && !product.LastName.length < 5 && <small className="p-invalid">Apellido mínimo de 5 caracteres</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Correo</label>
                            <InputText maxlength="50" id="email" type="email" value={product.Email} onChange={(e) => onInputChange(e, 'Email')} required className={classNames({ 'p-invalid': submitted && !product.Email.length < 10 })} />
                            {submitted && !product.Email.length < 10 && <small className="p-invalid">Correo incorrecto</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="phone">Teléfono</label>
                            <InputText maxlength="10" id="phone" value={product.Phone} onChange={(e) => onPhoneChange(e, 'Phone')} required className={classNames({ 'p-invalid': submitted && !product.Phone.length != 10 })} />
                            {submitted && !product.Phone.length != 10 && <small className="p-invalid">Teléfono es Requerido</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="password">Contraseña</label>
                            <InputText maxlength="20" type="password" id="password" value={product.Password} onChange={(e) => onPasswordChange(e, 'Password')} required className={classNames({ 'p-invalid': submitted && !product.Password.length < 4 })} />
                            {submitted && !product.Password.length < 4 && <small className="p-invalid">Contraseña mínimo de 4 caracteres</small>}
                        </div>


                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    ¿Desea eliminar el cliente  <b>{product.Name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>¿Desea eliminar los clientes seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
