import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig, user } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    var toDash = () => {
        if (user.UserName.length == 0) {
            return '/';
        } else {
            return '/dashboard';
        }
    }

    var toProduct = () => {
        if (user.UserName.length == 0) {
            return '/';
        } else {
            return '/products';
        }
    }

    var toVendor = () => {
        if (user.UserName.length == 0) {
            return '/';
        } else {
            return '/vendors';
        }
    }

    var toCliente = () => {
        if (user.UserName.length == 0) {
            return '/';
        } else {
            return '/clients';
        }
    }


    const model = [
        {
            label: 'Inicio',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: toDash() }]
        },
        {
            label: 'Productos ',
            items: [
                { label: 'Productos', icon: 'pi pi-fw pi-id-card', to: toProduct() },
            ]
        },
        {
            label: 'Usuarios',
            items: [
                { label: 'Usuarios', icon: 'pi pi-fw pi-prime', to: toVendor() }
            ]
        },
        {
            label: 'Clientes',
            items: [
                { label: 'Clientes', icon: 'pi pi-fw pi-prime', to: toCliente() }
            ]
        },
        {
            label: 'Ventas',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Venta',
                    icon: 'pi pi-fw pi-globe',
                    to: '/sales/newSales'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
