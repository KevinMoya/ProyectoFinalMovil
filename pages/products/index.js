import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { ProductService } from './Services/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';

const Crud = () => {
    let emptyProduct = {
        ProductID: 0,
        CategoryID: 0,
        Name: '',
        Img: '',
        Description: '',
        Category: '',
        Price: 0.0,
        Stock: 0,
        Barcode: ''
    };

    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const { user } = useContext(LayoutContext);

    var desabilitado = () => {
        console.log(user.Rol);
        if (user.Rol == "ADMIN") {
            return false;
        } else {
            return true;
        }
    }

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then((data) => setProducts(data));
        productService.getCategories().then((data) => setCategories(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
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

    const determinarCategoria = () => {
        for (let index = 0; index < categories.length; index++) {
            if (categories[index].Name == product.Category) {
                product.CategoryID = categories[index].CategoryID;
                break;
            }
        }
    }

    const corregirUrl = () => {
        product.Img = product.Img.replaceAll(':', '~');
        product.Img = product.Img.replaceAll('/', '^');
    }

    const revertirUrl = () => {
        product.Img = product.Img.replaceAll('~', ':');
        product.Img = product.Img.replaceAll('^', '/');
    }

    const saveProduct = async () => {
        setSubmitted(true);
        determinarCategoria();
        corregirUrl();

        if (product.Category && product.Name.length > 3 && product.Img && product.Barcode && product.Price > 0) {

            if (product.Description.length == 0) {
                product.Description = "Ninguno"
            }

            let _products = [...products];
            let _product = { ...product };

            if (product.ProductID != 0) {
                const url = "http://www.moviles.net/ServicioProductos.svc/actualizarProducto/" + product.ProductID + "/"
                    + product.CategoryID + "/" + product.Barcode + "/" + product.Name + "/" + product.Price + "/"
                    + product.Stock + "/" + product.Description + "/" + product.Img;

                const respuesta = await fetch(url);
                const respuestaJSON = await respuesta.json();

                if (parseInt(respuestaJSON) !== 0) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Producto Actualizado', life: 3000 });
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Producto no Actualizado', life: 3000 });
                }

            } else {

                const url = "http://www.moviles.net/ServicioProductos.svc/insertarProducto/"
                    + product.CategoryID + "/" + product.Barcode + "/" + product.Name + "/" + product.Price + "/"
                    + product.Stock + "/" + product.Description + "/" + product.Img;

                const respuesta = await fetch(url);
                const respuestaJSON = await respuesta.json();

                if (parseInt(respuestaJSON) !== 0) {

                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Producto Insertado', life: 3000 });
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Producto no Insertado', life: 3000 });
                }
            }

            const productService = new ProductService();
            productService.getProducts().then((data) => setProducts(data));
            setProductDialog(false);
            setProduct(emptyProduct);
        } else {
            toast.current.show({ severity: 'error', summary: 'Información!', detail: 'Algunos campos vacíos', life: 3000 });
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        const url = "http://www.moviles.net/ServicioProductos.svc/deleteProducto/" + product.ProductID;
        const respuesta = await fetch(url);
        const respuestaJSON = await respuesta.json();

        if (parseInt(respuestaJSON) !== 0) {
            let _products = products.filter((val) => val.ProductID !== product.ProductID);
            setProducts(_products);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Produto Eliminado', life: 3000 });
        } else {
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Producto', life: 3000 });
        }

    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].ProductID === id) {
                index = i;
                break;
            }
        }

        return index;
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
            const url = "http://www.moviles.net/ServicioProductos.svc/deleteProducto/" + selectedProducts[index].ProductID;
            const respuesta = await fetch(url);
            const respuestaJSON = await respuesta.json();

            if (parseInt(respuestaJSON) == 0) {
                boo = false;
            }

        }

        if (boo) {
            const productService = new ProductService();
            productService.getProducts().then((data) => setProducts(data));
            setDeleteProductsDialog(false);
            setProduct(emptyProduct);
            setSelectedProducts();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Produto Eliminado', life: 3000 });
        } else {
            setDeleteProductsDialog(false);
            setSelectedProducts();
            setProduct(emptyProduct);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Algunos productos no se eliminaron', life: 3000 });
        }
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product['Category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, Name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${Name}`] = val;

        setProduct(_product);
    };

    const onInputPriceChange = (e, name) => {
        const val = parseFloat(e.value);
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button disabled={desabilitado()} label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={(!selectedProducts || !selectedProducts.length) || desabilitado()} />
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
                <span className="p-column-title">Code</span>
                {rowData.ProductID}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.Name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`${rowData.Img}`} alt={rowData.Img} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.Price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.Category}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button disabled={desabilitado()} icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button disabled={desabilitado()} icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Productos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

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
                        dataKey="ProductID"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="ProductID" header="Codigo" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Imagen" body={imageBodyTemplate}></Column>
                        <Column field="Price" header="Precio" body={priceBodyTemplate} sortable></Column>
                        <Column field="Categoria" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalle del Producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="code">Codigo</label>
                            <InputText maxlength="10" id="code" value={product.ProductID} disabled onChange={(e) => onInputChange(e, 'ProductID')} autoFocus className={classNames({ 'p-invalid': submitted })} />
                        </div>

                        {product.Img && <img src={product.Img} alt={product.Img} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}

                        <div className="field">
                            <label htmlFor="Img">Imagen URL:</label>
                            <InputText id="Img" value={product.Img} onChange={(e) => onInputChange(e, 'Img')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Img })} />
                            {submitted && !product.Img && <small className="p-invalid">Debe insertar una imagen.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="name">Código de Barra</label>
                            <InputText maxlength="20" id="name" value={product.Barcode} onChange={(e) => onInputChange(e, 'Barcode')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Barcode })} />
                            {submitted && !product.Barcode && <small className="p-invalid">Barcode is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText maxlength="50" id="name" value={product.Name} onChange={(e) => onInputChange(e, 'Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Name })} />
                            {submitted && !product.Name && <small className="p-invalid">Nombre es Requerido</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="description">Descripción</label>
                            <InputTextarea maxlength="200" id="description" value={product.Description} onChange={(e) => onInputChange(e, 'Description')} rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Categoría</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="BOTANAS" onChange={onCategoryChange} checked={product.Category === 'BOTANAS'} />
                                    <label htmlFor="category1">Botanas</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="BEBIDAS" onChange={onCategoryChange} checked={product.Category === 'BEBIDAS'} />
                                    <label htmlFor="category2">Bebidas</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="FRUTAS" onChange={onCategoryChange} checked={product.Category === 'FRUTAS'} />
                                    <label htmlFor="category3">Frutas</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="LACTEOS" onChange={onCategoryChange} checked={product.Category === 'LACTEOS'} />
                                    <label htmlFor="category4">Lacteos</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category5" name="category" value="CHOCOLATES" onChange={onCategoryChange} checked={product.Category === 'CHOCOLATES'} />
                                    <label htmlFor="category4">Chocolates</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category6" name="category" value="ENLATADOS" onChange={onCategoryChange} checked={product.Category === 'ENLATADOS'} />
                                    <label htmlFor="category4">Lacteos</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category7" name="category" value="ELECTRONICOS" onChange={onCategoryChange} checked={product.Category === 'ELECTRONICOS'} />
                                    <label htmlFor="category4">Electronico</label>
                                </div>

                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category7" name="category" value="MASCOTAS" onChange={onCategoryChange} checked={product.Category === 'MASCOTAS'} />
                                    <label htmlFor="category4">Mascotas</label>
                                </div>

                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category7" name="category" value="VEGETALES" onChange={onCategoryChange} checked={product.Category === 'VEGETALES'} />
                                    <label htmlFor="category4">Vegetales</label>
                                </div>

                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category7" name="category" value="BELLEZA" onChange={onCategoryChange} checked={product.Category === 'BELLEZA'} />
                                    <label htmlFor="category4">Belleza</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category8" name="category" value="OTROS" onChange={onCategoryChange} checked={product.Category === 'OTROS'} />
                                    <label htmlFor="category4">Otras Categorías</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Precio</label>
                                <InputNumber maxlength="5" id="price" value={product.Price} onValueChange={(e) => onInputPriceChange(e, 'Price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Stock</label>
                                <InputNumber maxlength="5" id="quantity" value={product.Stock} onValueChange={(e) => onInputNumberChange(e, 'Stock')} integeronly />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    ¿Desea borrar el producto <b>{product.Name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>¿Desea eliminar los productos seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
