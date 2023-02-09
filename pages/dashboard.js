import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../layout/context/layoutcontext';
import { ProductService } from './products/Services/ProductService';

const lineData = {
    labels: ['Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril'],
    datasets: [
        {
            label: 'Fisicas',
            data: [0, 59, 25, 60, 56, 0, 0],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Internet',
            data: [0, 0, 0, 19, 86, 0, 0],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [products, setProducts] = useState(null);
    const menu1 = useRef(null);
    const [numeroClientes, setNumeroClientes] = useState("");
    const [numeroVentas, setNumeroVentas] = useState("");
    const [montoVentas, setMontoVentas] = useState("");
    const [numeroProductos, setNumeroProductos] = useState("");
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);
    const { layoutConfig, user } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;


    const nc = async () => {
        const url = "http://proyecto-aplicaciones-moviles.somee.com/ServicioEstadisticas.svc/numeroClientes"
        const respuesta = await fetch(url);
        const respuestaJSON = await respuesta.json();
        setNumeroClientes(respuestaJSON);
    }

    const nf = async () => {
        const url = "http://proyecto-aplicaciones-moviles.somee.com/ServicioEstadisticas.svc/numeroFacturas"
        const respuesta = await fetch(url);
        const respuestaJSON = await respuesta.json();
        setNumeroVentas(respuestaJSON);
    }

    const np = async () => {
        const url = "http://proyecto-aplicaciones-moviles.somee.com/ServicioEstadisticas.svc/numeroProductos"
        const respuesta = await fetch(url);
        const respuestaJSON = await respuesta.json();
        setNumeroProductos(respuestaJSON);
    }

    const mv = async () => {
        const url = "http://proyecto-aplicaciones-moviles.somee.com/ServicioEstadisticas.svc/montoVenta"
        const respuesta = await fetch(url);
        const respuestaJSON = await respuesta.json();
        setMontoVentas((respuestaJSON).toString('##.##'));
    }


    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        const productService = new ProductService();
        productService.getBestProducts().then((data) => setProducts(data));
        nc();
        nf();
        mv();
        np();
    }, []);

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Imagen</span>
                <img src={`${rowData.Img}`} alt={rowData.Img} className="shadow-2" width="100" />
            </>
        );
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }

    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ventas</span>
                            <div className="text-900 font-medium text-xl">{numeroVentas}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{numeroVentas - 74} </span>
                    <span className="text-500">nuevas ventas</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Monto de Ventas</span>
                            <div className="text-900 font-medium text-xl">${montoVentas}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">%52+ </span>
                    <span className="text-500">ventas esta semana   </span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Clientes</span>
                            <div className="text-900 font-medium text-xl">{numeroClientes}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{numeroClientes - 10003} </span>
                    <span className="text-500">Nuevos registros</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Numero de Productos</span>
                            <div className="text-900 font-medium text-xl">{numeroProductos}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{numeroProductos - 500} </span>
                    <span className="text-500">En movimiento</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Productos más Vendidos</h5>
                    <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                        <Column header="Imagen" body={imageBodyTemplate} width="25%" ></Column>
                        <Column field="Name" header="Producto" sortable style={{ width: '25%' }} />
                        <Column field="Price" header="Precio Unitario" sortable style={{ width: '25%' }} body={(data) => formatCurrency(data.Price)} />
                        <Column field="Category" header="Categoría" sortable style={{ width: '25%' }} />
                    </DataTable>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu1.current.toggle(event)} />
                            <Menu
                                ref={menu1}
                                popup
                                model={[
                                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Internet vs Físicas</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
