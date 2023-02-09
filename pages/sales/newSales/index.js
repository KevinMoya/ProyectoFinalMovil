import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { ProductService } from '../Services/ProductService';
import { SplitButton } from 'primereact/splitbutton';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import "bootstrap/dist/css/bootstrap.min.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

const Sales = () => {

  let [ProductoBuscado, setProductoBuscado] = useState(Object);
  const [ClienteBuscado] = useState(Object);
  const [FacturaBuscada] = useState(Object);
  const [VendedorBuscado] = useState(Object);

  const [products, setProducts] = useState(null);
  const [productsList, setProductsList] = useState(null);
  const [clients, setClients] = useState(null);
  const [vendors, setVendors] = useState(null);
  const [details, setDetails] = useState(null);
  const [listaFacturas, setlistaFacturas] = useState(null);
  const [listaDetalleProductos, setlistaDetalleProductos] = useState(Array);
  const [listaProductosDB, setListaProductosDB] = useState(Array);


  let [numeroFactura, setNumeroFactura] = useState();
  let [subtotal, setSubtotal] = useState(0);
  let [IVA, setIVA] = useState(0);
  let [Total, setTotal] = useState(0);

  const toast = useRef(null);

  const [modal, setModal] = useState();
  const [modalLista, setModalLista] = useState();
  const [modalClients, setModalClients] = useState();
  const [modalVendors, setModalVendors] = useState();
  const [ModalStock, setModalStock] = useState();
  const [ModalGuardado, setModalGuardado] = useState();
  const [ModalExiste, setModalExiste] = useState();
  const [ModalNoCantidad, setModalNoCantidad] = useState();
  const [ModalVacio, setModalVacio] = useState();
  const [ModalError, setModalError] = useState();
  const [ModalFacturas, setModalFacturas] = useState();

  const [edicion, setEdicion] = useState();

  const [producto, setProducto] = useState(String);
  let [productoLista, setProductoLista] = useState(String);
  let [productoAnterior, setProductoAnterior] = useState(String);
  const [cliente, setCliente] = useState(String);
  const [vendedores, setVendedores] = useState(String);

  const [NombreCliente, setNombreCliente] = useState(String);
  const [NombreVendedor, setNombreVendedor] = useState(String);
  const [NombreProducto, setNombreProducto] = useState(String);
  const [CantidadProducto, setCantidadProducto] = useState(String);
  const [PrecioUnitario, setPrecioUnitario] = useState(String);
  const [Fecha, setFecha] = useState(String);
  const menu1 = useRef(null);

  const abripPopupProducto = () => {
    setModal(!modal);
    fetchProductData('products');
  }

  const abripPopupProductoLista = () => {
    fetchProductListData('productsList');
    setModalLista(!modalLista);
  }

  const abripPopupClientes = () => {
    setModalClients(!modalClients);
    fetchClientData('clients');
  }

  const abripPopupVendedores = () => {
    setModalVendors(!modalVendors);
    fetchVendorData('vendors');
  }

  const abrirPopupListaFacturas = () => {
    setModalFacturas(!ModalFacturas);
    fetchSales('sales');
  }

  const abripPopupStock = () => {
    setModalStock(!ModalStock);
  }

  const abripPopupGuardado = () => {
    setModalGuardado(!ModalGuardado);
  }

  const abripPopupExiste = () => {
    setModalExiste(!ModalExiste);
  }

  const abripPopupNoCantidad = () => {
    setModalNoCantidad(!ModalNoCantidad);
  }

  const abripPopupVacio = () => {
    setModalVacio(!ModalVacio);
  }

  const abrirPopupError = () => {
    setModalError(!ModalError);
  }

  const columns = [
    { field: 'Codigo', header: 'Codigo' },
    { field: 'Nombre', header: 'Nombre' },
    { field: 'Cantidad', header: 'Cantidad' },
    { field: 'PrecioUnitario', header: 'Precio Unitario' },
    { field: 'TotalLine', header: 'Total' }
  ];

  const columnsDetalle = [
    { field: 'ProductID', header: 'Codigo' },
    { field: 'ProductName', header: 'Nombre' },
    { field: 'Quantity', header: 'Cantidad' },
    { field: 'UnitPrice', header: 'Precio Unitario' },
    { field: 'Total', header: 'Total' }
  ];

  const columnsFactura = [
    { field: 'SalesID', header: 'Codigo' },
    { field: 'Date', header: 'Fecha' },
    { field: 'CustomerID', header: 'Cédula Cliente' },
    { field: 'CustomerName', header: 'Nombre Cliente' },
    { field: 'EmployeeID', header: 'Cédula Empleado' },
    { field: 'EmployeeName', header: 'Nombre Empleado' },
    { field: 'Total', header: 'Total' }
  ];

  var dataTableFuncMap = {
    'products': setProducts,
    'productsList': setProductsList,
    'clients': setClients,
    'vendors': setVendors,
    'detail': setlistaDetalleProductos,
    'sales': setlistaFacturas,
    'detalle': setDetails
  };

  const productService = new ProductService();

  useEffect(() => {
    fetchProductData('products');
    fetchProductListData('productsList');
    fetchClientData('clients');
    fetchVendorData('vendors');
    fetchProductDetail('detail');
    //fetchSales('sales');

  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  const fetchProductData = (productStateKey) => {
    productService.getAllProducts().then(data => dataTableFuncMap[`${productStateKey}`](data));
  }

  const fetchProductListData = (productStateKey) => {
    productService.getAllProducts().then(data => dataTableFuncMap[`${productStateKey}`](data));
  }

  const fetchProductDetail = (productStateKey) => {
    listaDetalleProductos.map(e => ({ 'Codigo': e.Codigo, 'Nombre': e.Nombre, 'Cantidad': e.Cantidad, 'PrecioUnitario': e.PrecioUnitario, 'TotalLine': e.TotalLine }));
  }

  const fetchClientData = (productStateKey) => {
    productService.getAllCustomers().then(data => dataTableFuncMap[`${productStateKey}`](data));
  }

  const fetchVendorData = (productStateKey) => {
    productService.getAllEmployees().then(data => dataTableFuncMap[`${productStateKey}`](data));
  }

  const fetchSales = (productStateKey) => {
    productService.getFacturas().then(data => dataTableFuncMap[`${productStateKey}`](data));
  }

  const fetchDetalleFactura = (productStateKey) => {
    productService.getDetalle(FacturaBuscada.SalesID).then(data => dataTableFuncMap[`${productStateKey}`](data));
  }


  const isPositiveInteger = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
  }


  const listaProductos = (e) => {
    // eslint-disable-next-line no-new-object
    var p = new Object();
    p.Codigo = e.data.ProductID.toString();
    p.Nombre = e.data.Name.toString();
    p.Stock = parseInt(e.data.Stock.toString());
    p.PrecioUnitario = parseFloat(e.data.Price.toString());

    ProductoBuscado = p;
    setProductoBuscado(p);

    listaProductosDB.push(p);

    if (ProductoBuscado.Stock > 0) {
      setProducto(ProductoBuscado.Codigo);
      setNombreProducto(ProductoBuscado.Nombre);
      setPrecioUnitario(ProductoBuscado.PrecioUnitario);
      setModal(!Modal);
    } else {
      setModal(!Modal);
      setModalStock(!ModalStock);
    }
  }

  const eliminarProducto = (codigo) => {
    for (let index = 0; index < listaDetalleProductos.length; index++) {
      if (listaDetalleProductos[index].Codigo == codigo) {
        listaDetalleProductos.splice(index, 1);

        for (let i = 0; i < listaProductosDB.length; i++) {
          if (listaProductosDB[i].Codigo == codigo) {
            listaProductosDB.splice(i, 1);
          }
        }
      }
    }
    fetchProductDetail('detail');
    determinarTotales();
  }

  const listaProductosLista = (e) => {
    // eslint-disable-next-line no-new-object
    var pb = new Object();

    pb.Codigo = e.data.ProductID.toString();
    pb.Nombre = e.data.Name.toString();
    pb.Stock = parseInt(e.data.Stock.toString());
    pb.PrecioUnitario = parseFloat(e.data.Price.toString());

    ProductoBuscado = pb;
    setProductoBuscado(pb);

    for (let index = 0; index < listaProductosDB.length; index++) {
      if (listaProductosDB[index].Codigo === productoAnterior) {
        listaProductosDB[index] = pb;
      }

    }

    if (pb.Stock > 0) {
      // eslint-disable-next-line no-new-object
      var p = new Object();

      p.Codigo = pb.Codigo;
      p.Nombre = pb.Nombre;
      p.Cantidad = 1;
      p.PrecioUnitario = pb.PrecioUnitario;
      p.TotalLine = parseFloat(p.PrecioUnitario * p.Cantidad);

      if (noEscogido(p.Codigo)) {

        for (let index = 0; index < listaDetalleProductos.length; index++) {
          if (listaDetalleProductos[index].Codigo === productoAnterior) {
            listaDetalleProductos[index] = p;
          }

        }
        fetchProductDetail('detail');
        setModalLista(!modalLista);
        fetchProductDetail();
      } else {
        setModalLista(!modalLista);
        abripPopupExiste();
      }

    } else {
      setModalLista(!modalLista);
      abripPopupStock();
    }
    determinarTotales();
  }

  const listaClientes = (e) => {
    setModalClients(!modalClients);
    // eslint-disable-next-line no-new-object
    ClienteBuscado.Cedula = e.data.CustomerID.toString();
    ClienteBuscado.Nombre = e.data.Name.toString();
    ClienteBuscado.Apellido = e.data.LastName.toString();

    setModalClients(!modalClients);
    setNombreCliente(ClienteBuscado.Nombre + " " + ClienteBuscado.Apellido);
    setCliente(ClienteBuscado.Cedula);
  }

  const reconstruirFactura = (e) => {
    setModalFacturas(!ModalFacturas);
    // eslint-disable-next-line no-new-object
    FacturaBuscada.SalesID = parseInt(e.data.SalesID.toString());
    FacturaBuscada.CustomerID = e.data.CustomerID.toString();
    FacturaBuscada.CustomerName = e.data.CustomerName.toString();
    FacturaBuscada.EmployeeID = e.data.EmployeeID.toString();
    FacturaBuscada.EmployeeName = e.data.EmployeeName.toString();
    FacturaBuscada.Date = e.data.Date.toString();
    FacturaBuscada.Total = parseFloat(e.data.Total.toString());
    FacturaBuscada.IVA = parseFloat(FacturaBuscada.Total * 0.12);
    FacturaBuscada.Subtotal = parseFloat(FacturaBuscada.Total - FacturaBuscada.IVA)

    setNumeroFactura(FacturaBuscada.SalesID);
    setTotal(FacturaBuscada.Total);
    setSubtotal(FacturaBuscada.Subtotal);
    setIVA(FacturaBuscada.IVA);
    setCliente(FacturaBuscada.CustomerID);
    setVendedores(FacturaBuscada.EmployeeID);
    setNombreCliente(FacturaBuscada.CustomerName);
    setNombreVendedor(FacturaBuscada.EmployeeName);
    setFecha(FacturaBuscada.Date);

    if (!edicion) {
      setEdicion(!edicion);
    }

    fetchDetalleFactura('detalle');
  }

  const listaVendedores = (e) => {
    // eslint-disable-next-line no-new-object
    VendedorBuscado.Cedula = e.data.EmployeeID.toString();
    VendedorBuscado.Nombre = e.data.Name.toString();
    VendedorBuscado.Apellido = e.data.LastName.toString();

    setModalVendors(!modalVendors);
    setNombreVendedor(VendedorBuscado.Nombre + " " + VendedorBuscado.Apellido);
    setVendedores(VendedorBuscado.Cedula);
  }

  const noEscogido = (p) => {

    for (let index = 0; index < listaDetalleProductos.length; index++) {
      if (listaDetalleProductos[index].Codigo === p) {
        return false;
      }
    }
    return true;
  }


  const agregarProducto = () => {

    if (parseInt(CantidadProducto) <= ProductoBuscado.Stock) {

      if (parseInt(CantidadProducto) > 0) {
        // eslint-disable-next-line no-new-object
        var p = new Object();

        p.Codigo = ProductoBuscado.Codigo;
        p.Nombre = ProductoBuscado.Nombre;
        p.Cantidad = parseInt(CantidadProducto);
        p.PrecioUnitario = parseFloat(PrecioUnitario);
        p.TotalLine = parseFloat(p.PrecioUnitario * p.Cantidad);

        if (noEscogido(p.Codigo)) {
          setModalStock();
          listaDetalleProductos.push(p);
          setModalStock();
          fetchProductDetail('detail');
          determinarTotales();
        } else {
          editarProducto(p.Codigo);
        }
        setProducto("");
        setCantidadProducto("");
        setNombreProducto("");
        setPrecioUnitario("");
      } else {
        abripPopupNoCantidad()
      }

    } else {
      setModalStock(!ModalStock);
    }
  }

  const determinarTotales = () => {
    var tot = 0;
    for (let index = 0; index < listaDetalleProductos.length; index++) {
      tot += listaDetalleProductos[index].Cantidad * listaDetalleProductos[index].PrecioUnitario;
    }

    setTotal(tot);
    setIVA(tot * 0.12);
    setSubtotal(tot - (tot * 0.12));
  }

  const comprobarCantidad = (codigo, cantidad) => {

    for (let index = 0; index < listaProductosDB.length; index++) {
      if (listaProductosDB[index].Codigo === codigo) {
        if (listaProductosDB[index].Stock >= cantidad) {
          for (let i = 0; i < listaDetalleProductos.length; i++) {
            if (listaDetalleProductos[i].Codigo === codigo) {
              listaDetalleProductos[i].Cantidad = cantidad;
              listaDetalleProductos[i].TotalLine = cantidad * listaDetalleProductos[i].PrecioUnitario;
            }
          }
        } else {
          abripPopupStock();
        }

      }
    }

    fetchProductDetail('detail');
  }

  const guardarFactura = async () => {

    if (numeroFactura == 0 && !edicion) {
      // eslint-disable-next-line no-new-object
      if (NombreCliente !== "" && NombreVendedor !== "" && listaDetalleProductos.length > 0) {

        const url = "http://proyecto-aplicaciones-moviles.somee.com/ServicioDetalle.svc/borrarAuxiliar"
        const respuesta = await fetch(url);
        const respuestaJSON = await respuesta.json();

        if (parseInt(respuestaJSON) !== 0) {
          guardarDetalleProducto()
        }
      } else {
        abripPopupVacio();
      }
    } else {
      toast.current.show({ severity: 'info', summary: 'Información', detail: 'Inicie una nueva factura para guardar', life: 3000 });
    }
  }

  const guardarDetalleProducto = async () => {
    let n = 0;
    for (let index = 0; index < listaDetalleProductos.length; index++) {
      const url = "http://proyecto-aplicaciones-moviles.somee.com/ServicioDetalle.svc/guardarDetalle/"
        + listaDetalleProductos[index].Codigo + "/" + listaDetalleProductos[index].Cantidad;
      const respuesta = await fetch(url);
      const respuestaJSON = await respuesta.json();
      console.log(respuestaJSON);
      console.log(url);
      n++;
    }

    if (n !== 0) {
      insertarFactura()
    } else {
    }

  }

  const insertarFactura = async () => {
    const url = "http://proyecto-aplicaciones-moviles.somee.com/ServicioFactura.svc/guardarFactura/" + ClienteBuscado.Cedula + "/" + VendedorBuscado.Cedula;
    const respuesta = await fetch(url);
    const respuestaJSON = await respuesta.json();

    if (parseInt(respuestaJSON) !== 0) {
      setNumeroFactura(respuestaJSON);
      abripPopupGuardado();
      bloquearEdicion();
      limpiarCampos();
    } else {
      abrirPopupError();
    }
  }

  const cancelarFactura = () => {
    if (numeroFactura == 0 && !edicion) {
      limpiarCampos();
      setEdicion(true);
    } else {
      toast.current.show({ severity: 'info', summary: '¡Información!', detail: 'Ninguna factura iniciada', life: 3000 });
    }
  }

  const bloquearEdicion = () => {
    setEdicion(!edicion);
  }

  const limpiarCampos = () => {
    setNumeroFactura("");
    setCliente("");
    setNombreCliente("");
    setVendedores("");
    setNombreVendedor("");
    setProducto("");
    setCantidadProducto("");
    setFecha("");
    // eslint-disable-next-line no-array-constructor
    setlistaDetalleProductos(new Array());
    // eslint-disable-next-line no-array-constructor
    setListaProductosDB(new Array());
    setSubtotal(0);
    setIVA(0);
    setTotal(0);
  }

  const editarDetalle = (e) => {
    // eslint-disable-next-line no-new-object
    var p = new Object();
    p.Codigo = e.data.Codigo.toString();
    p.Nombre = e.data.Nombre.toString();
    p.Cantidad = parseInt(e.data.Cantidad.toString());
    p.PrecioUnitario = parseFloat(e.data.PrecioUnitario.toString());

    setProducto(p.Codigo);
    setNombreProducto(p.Nombre);
    setCantidadProducto(p.Cantidad);
    setPrecioUnitario(p.PrecioUnitario);
  }

  const comprobarEliminado = () => {
    if (listaDetalleProductos.length !== 0) {
      var p = parseInt(producto);

      for (let index = 0; index < listaDetalleProductos.length; index++) {
        if (listaDetalleProductos[index].Codigo == p) {
          eliminarProducto(p);
        }
      }
    }

    setProducto("");
    setNombreProducto("");
    setCantidadProducto("");
    setPrecioUnitario("");
  }

  const editarProducto = (codigo) => {
    for (let index = 0; index < listaDetalleProductos.length; index++) {
      if (listaDetalleProductos[index].Codigo == codigo) {

        for (let i = 0; i < listaProductosDB.length; i++) {
          if (listaProductosDB[i].Codigo == codigo) {
            if (listaDetalleProductos[index].Cantidad + parseInt(CantidadProducto) <= listaProductosDB[i].Stock) {
              listaDetalleProductos[index].Cantidad = parseInt(CantidadProducto);
            } else {
              abripPopupStock();
            }

          }
        }
      }
    }
    fetchProductDetail('detail');
    determinarTotales();
  }

  const totalBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.TotalLine || rowData.Total);
  }

  const totalTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.Total);
  }

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.PrecioUnitario || rowData.UnitPrice);
  }
  const nuevaFactura = () => {
    if (edicion) {
      setEdicion(false);
      limpiarCampos();
      var date = new Date();
      setFecha((date.getFullYear() + "-" + (date.getMonth() + 1)) + "-" + date.getDate() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      toast.current.show({ severity: 'info', summary: '¡Información!', detail: 'Nueva Factura iniciada', life: 3000 });
      setEdicion(false);
      limpiarCampos();
      var date = new Date();
      setFecha((date.getFullYear() + "-" + (date.getMonth() + 1)) + "-" + date.getDate() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }

  const toolbarItems = [
    {
      label: 'Guardar',
      icon: 'pi pi-check',
      command: () => { guardarFactura() }
    },
    {
      label: 'Nuevo',
      icon: 'pi pi-sync',
      command: () => { nuevaFactura() }
    },
    {
      label: 'Cancelar',
      icon: 'pi pi-trash',
      command: () => { cancelarFactura() }
    },
    {
      label: 'Lista',
      icon: 'pi pi-home',
      command: () => { abrirPopupListaFacturas() }
    }
  ];

  const toolbarRightTemplate = <SplitButton label="Opciones" icon="pi pi-check" model={toolbarItems} menuStyle={{ width: '12rem' }}></SplitButton>;

  const leftLitle = <h3 class="card-title">FACTURACIÓN MOVIL</h3>;

  const estilo = (<style jsx global>{`    
        .App {
          text-align: center;
        }
        
        .datatable-editing-demo .editable-cells-table td.p-cell-editing {
          padding-top: 0;
          padding-bottom: 0;
        }
        
        .App-logo {
          height: 40vmin;
          pointer-events: none;
        }
        
        @media (prefers-reduced-motion: no-preference) {
          .App-logo {
            animation: App-logo-spin infinite 20s linear;
          }
        }
        
        .App-header {
          background-color: #282c34;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: calc(10px + 2vmin);
          color: white;
        }
        
        .App-link {
          color: #61dafb;
        }
        
        #separador{
          margin-top: 10px;
        }
        
        .Total {
          float: right;
        }
        
        #total {
          float: right;
          width: 27%;
        }
        
        .card-header{
          background-color: #F9B7FF;
        }
        .card-body{
          background-color: #fff5fb;
        }
        .text-right{
          text-align: right;
        }
        
        .ModalBody{
          background-color: #a4b0be;
        }
        .ModalHeader{
          background-color: #747d8c;
        }
        .ModalFooter{
          background-color: #747d8c;
        }
        
        .card-title{
          float: left;
        }
        .btn-outline-dark{
          float: right;
        }
        .btn-outline-primary{
        float: inline-end;
        width: 1278px;
        }
        
      `}</style>)

  return (

    <div className="datatable-editing-demo">
      <Toast ref={toast} />
      <div className="card p-fluid" class='container'>
        <div class="container">
          <Toolbar left={leftLitle} right={toolbarRightTemplate}></Toolbar>
          <Modal isOpen={ModalGuardado} toggle={abripPopupGuardado}>
            <ModalHeader className='ModalHeader' toggle={abripPopupGuardado}>Información</ModalHeader>
            <ModalBody className='ModalBody'>
              ¡Se a guardado el registro de la Factura!
            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="btn btn-outline-light" onClick={abripPopupGuardado}>Aceptar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={ModalError} toggle={abrirPopupError}>
            <ModalHeader className='ModalHeader' toggle={abrirPopupError}>Error</ModalHeader>
            <ModalBody className='ModalBody'>
              ¡Factura no procesada!
            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="btn btn-outline-light" onClick={abrirPopupError}>Aceptar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={ModalVacio} toggle={abripPopupVacio}>
            <ModalHeader className='ModalHeader' toggle={abripPopupVacio}>Alerta</ModalHeader>
            <ModalBody className='ModalBody'>
              ¡Campos Vacíos!
            </ModalBody >
            <ModalFooter className='ModalFooter'>
              <Button color="btn btn-outline-light" onClick={abripPopupVacio}>Aceptar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={ModalNoCantidad} toggle={abripPopupNoCantidad}>
            <ModalHeader className='ModalHeader' toggle={abripPopupNoCantidad}>Alerta</ModalHeader>
            <ModalBody className='ModalBody'>
              ¡Ingrese una cantidad válida!
            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="btn btn-outline-light" onClick={abripPopupNoCantidad}>Aceptar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={ModalExiste} toggle={abripPopupExiste}>
            <ModalHeader className='ModalHeader' toggle={abripPopupExiste}>Alerta</ModalHeader>
            <ModalBody className='ModalBody'>
              ¡Este producto ya existe en la lista de venta!
            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="btn btn-outline-light" onClick={abripPopupExiste}>Aceptar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={ModalStock} toggle={abripPopupStock}>
            <ModalHeader className='ModalHeader' toggle={abripPopupStock}>Alerta</ModalHeader>
            <ModalBody className='ModalBody'>
              ¡Stock insuficiente!
            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="btn btn-outline-light" onClick={abripPopupStock}>Aceptar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modalClients} toggle={abripPopupClientes}>
            <ModalHeader className='ModalHeader' toggle={abripPopupClientes}>Busqueda de Clientes</ModalHeader>
            <ModalBody className='ModalBody'>
              <DataTable value={clients} onRowClick={e => listaClientes(e)} filterDisplay="row" paginator responsiveLayout="scroll"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5}>
                <Column field="CustomerID" header="Cédula" filter sortable></Column>
                <Column field="Name" header="Nombre" filter sortable></Column>
                <Column field="LastName" header="Apellido" filter sortable></Column>
              </DataTable>

            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="secondary" onClick={abripPopupClientes}>Cancelar</Button>
            </ModalFooter>
          </Modal>

          <Modal size="lg" style={{ maxWidth: '2400px', width: '90%' }} isOpen={ModalFacturas} toggle={abrirPopupListaFacturas}>
            <ModalHeader className='ModalHeader' toggle={abrirPopupListaFacturas}>Lista de Ventas</ModalHeader>
            <ModalBody className='ModalBody'>


              <DataTable value={listaFacturas} onRowClick={e => reconstruirFactura(e)} filterDisplay="row" paginator responsiveLayout="scroll"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5}>
                {
                  columnsFactura.map(({ field, header }) => {
                    return <Column key={field} field={field} header={header} filter sortable style={{ width: '14%' }} body={field === 'Total' && totalTemplate} />
                  })
                }
              </DataTable>



            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="secondary" onClick={abrirPopupListaFacturas}>Cancelar</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modalVendors} toggle={abripPopupVendedores}>
            <ModalHeader className='ModalHeader' toggle={abripPopupVendedores}>Busqueda de Vendedores</ModalHeader>
            <ModalBody className='ModalBody'>
              <DataTable value={vendors} onRowClick={e => listaVendedores(e)} filterDisplay="row" paginator responsiveLayout="scroll"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5}>
                <Column field="EmployeeID" header="Cédula" filter sortable></Column>
                <Column field="Name" header="Nombre" filter sortable></Column>
                <Column field="LastName" header="Apellido" filter sortable></Column>
              </DataTable>

            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="secondary" onClick={abripPopupVendedores}>Cancelar</Button>
            </ModalFooter>
          </Modal>

          <Modal style={{ maxWidth: '2400px', width: '70%' }} isOpen={modal} toggle={abripPopupProducto}>
            <ModalHeader className='ModalHeader' toggle={abripPopupProducto}>BuscarProducto</ModalHeader>
            <ModalBody className='ModalBody'>
              <DataTable value={products} onRowClick={e => listaProductos(e)} filterDisplay="row" paginator responsiveLayout="scroll"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5}>
                <Column field="ProductID" header="Codigo" filter sortable></Column>
                <Column field="Name" header="Nombre" filter sortable></Column>
                <Column field="Stock" header="Stock" filter sortable></Column>
                <Column field="Price" header="Precio Unitario" filter sortable></Column>
              </DataTable>

            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="secondary" onClick={abripPopupProducto}>Cancelar</Button>
            </ModalFooter>
          </Modal>

          <Modal style={{ maxWidth: '2400px', width: '70%' }} isOpen={modalLista} toggle={abripPopupProductoLista}>
            <ModalHeader className='ModalHeader' toggle={abripPopupProductoLista}>BuscarProducto</ModalHeader>
            <ModalBody className='ModalBody'>
              <DataTable value={productsList} onRowClick={e => listaProductosLista(e)} filterDisplay="row" paginator responsiveLayout="scroll"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={5}>
                <Column field="ProductID" header="Codigo" filter sortable></Column>
                <Column field="Name" header="Nombre" filter sortable></Column>
                <Column field="Stock" header="Stock" filter sortable></Column>
                <Column field="Price" header="Precio Unitario" filter sortable></Column>
              </DataTable>

            </ModalBody>
            <ModalFooter className='ModalFooter'>
              <Button color="secondary" onClick={abripPopupProductoLista}>Cancelar</Button>
            </ModalFooter>
          </Modal>

          <div class="row">
          {estilo}
            <main>
              <section class="col">
                <div class="card">

                  <div class="card-body">
                    <form class="row">
                      <div class="form-group col-md-6">
                        <label for="">DOCUMENTO</label>
                        <input disabled type="text" class="form-control" value={numeroFactura} placeholder="Número Factura" aria-label="Documet" aria-describedby="basic-addon1" />
                      </div>

                      <div class="form-group col-md-6">
                        <label for="">FECHA</label>
                        <input disabled type="text" class="form-control" placeholder="Fecha" aria-label="Fecha" aria-describedby="basic-addon1" value={Fecha} />
                      </div>

                      <div id='separador'></div>
                      <div id='separador'></div>
                      <div id='separador'></div>

                      <div class="form-group col-md-6">
                        <label for="">CLIENTE</label>
                        <input type="text" class="form-control" disabled placeholder="Cliente" aria-label="Username" value={cliente} onChange={event => setCliente(event.target.value)} />
                        <button type="button" class="btn btn-outline-info" disabled={edicion} onClick={abripPopupClientes}>Buscar Cliente</button>
                      </div>

                      <div class="form-group col-md-6">
                        <label for="">NOMBRE CLIENTE</label>
                        <input type="text" class="form-control" placeholder="Nombre" aria-label="Server" disabled value={NombreCliente} />
                      </div>

                      <div id='separador'></div>

                      <div class="form-group col-md-6">
                        <label for="">VENDEDOR</label>
                        <input type="text" class="form-control" disabled onCellEditComplete={abripPopupVendedores} placeholder="Vendedor" aria-label="Username" value={vendedores} onChange={event => setVendedores(event.target.value)} />
                        <button type="button" class="btn btn-outline-info" disabled={edicion} onClick={abripPopupVendedores}>Buscar Vendedor</button>
                      </div>

                      <div class="form-group col-md-6">
                        <label for="">NOMBRE VENDEDOR</label>
                        <input type="text" class="form-control" placeholder="Nombre" aria-label="Server" disabled value={NombreVendedor} />
                      </div>

                    </form>


                  </div>
                </div>
              </section>

              <section class="row">
                <div class="col">
                  <div class="card">
                    <div class="card-body">
                      <div class="input-group mb-3">
                        <input type="text" class="form-control" disabled onCellEditComplete={abripPopupProducto} placeholder="Producto" aria-label="Producto" value={producto} onChange={event => setProducto(event.target.value)} />
                        <button type="button" class="btn btn-outline-secondary" disabled={edicion} onClick={abripPopupProducto}>Buscar</button>
                        <input type="text" class="form-control" placeholder="Nombre Producto" aria-label="ProductName" disabled value={NombreProducto} onChange={event => setNombreProducto(event.target.value)} />
                        <input type="number" class="form-control" disabled={edicion} placeholder="Cantidad" aria-label="Cantidad" value={CantidadProducto} onChange={event => setCantidadProducto(event.target.value)} />
                        <input type="text" class="form-control" placeholder="Precio Unitario" aria-label="UnitPrice" disabled value={PrecioUnitario} onChange={event => setPrecioUnitario(event.target.value)} />
                        <button type="button" class="btn btn-outline-secondary" disabled={edicion} onClick={agregarProducto}>Agregar</button>
                        <button type="button" class="btn btn-outline-secondary" disabled={edicion} onClick={comprobarEliminado}>Eliminar</button>
                      </div>

                      <div id='separador'></div>

                      <DataTable onRowClick={e => editarDetalle(e)} hidden={edicion} value={listaDetalleProductos} responsiveLayout="scroll">
                        {
                          columns.map(({ field, header }) => {
                            return <Column key={field} field={field} header={header} style={{ width: '25%' }} body={(field === 'TotalLine' && totalBodyTemplate) || (field === 'PrecioUnitario' && priceBodyTemplate)}
                            //editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} 
                            />
                          })
                        }
                      </DataTable>

                      <DataTable hidden={!edicion} value={details} editMode="cell" className="editable-cells-table" responsiveLayout="scroll">
                        {
                          columnsDetalle.map(({ field, header }) => {
                            return <Column key={field} field={field} header={header} style={{ width: '25%' }} body={(field === 'Total' && totalBodyTemplate) || (field === 'UnitPrice' && priceBodyTemplate)}
                            />
                          })
                        }
                      </DataTable>

                      <div id='separador'></div>

                      <div class='form-control Total'>
                
                        <div id='total'>

                          <div class="input-group mb-3 Total">
                            <span class="input-group-text" id="basic-addon1">Subtotal</span>
                            <InputNumber align='rigth' disabled height='100px' mode="currency" currency="USD" locale="en-US" type="text" inputClassName='text-right' class="form-control" placeholder="Subtotal" aria-label="Subtotal" aria-describedby="basic-addon1" value={subtotal} />
                          </div>

                          <div class="input-group mb-3 Total">
                            <span class="input-group-text" id="basic-addon1">&nbsp; &nbsp;&nbsp;IVA&nbsp;&nbsp;&nbsp;</span>
                            <InputNumber align='rigth' disabled height='100px' mode="currency" currency="USD" locale="en-US" type="text" inputClassName='text-right' class="form-control" placeholder="Subtotal" aria-label="Subtotal" aria-describedby="basic-addon1" value={IVA} />
                          </div>

                          <div class="input-group mb-3 Total">
                            <span class="input-group-text" id="basic-addon1">&nbsp;&nbsp;Total&nbsp;&nbsp;&nbsp;</span>
                            <InputNumber disabled height='100px' mode="currency" currency="USD" locale="en-US" type="text" class="form-control" placeholder="IVA" aria-label="Subtotal" inputClassName='text-right' aria-describedby="basic-addon1" value={Total} />
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
            <div class="col-x-12">

              <div id='separador'></div>





            </div>
          </div>
        </div>

      </div>

    </div >
  );
}


export default Sales;
