import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState, useRef } from 'react';
import AppConfig from '../layout/AppConfig';
import { Button } from 'primereact/button';
import { LayoutContext } from '../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import jwt_decode from 'jwt-decode';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { layoutConfig, setUser } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const toast = useRef(null);
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const u = useState({
        UserName: '',
        Rol: ''
    });

    const iniciarSesion = async () => {
        if (username.trim() && password.trim()) {
            var url = "http://proyecto-aplicaciones-moviles.somee.com/ServicioVendedor.svc/login/" + username + "/" + password;
            const respuesta = await fetch(url);
            const respuestaJSON = await respuesta.json();

            if (respuestaJSON !== "0x000") {
                try {
                    const token = respuestaJSON;
                    var decoded = jwt_decode(token);
                    console.log('Subject: ', decoded.sub);
                    u.UserName = decoded.sub;
                    u.Rol = decoded.email;
                    setUser(u);
                    layoutConfig
                    router.push('/dashboard')
                } catch (error) {
                    console.error(error);
                }
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Credenciales Incorrectas', life: 3000 });
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Llene todos los campos', life: 3000 });
        }
    }

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`${contextPath}/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <span className="text-600 font-medium">¡Inicie Sesión para continuar!</span>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                Cédula
                            </label>
                            <InputText inputid="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Cédula" className="w-full p-30 mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <InputText type="password" inputid="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Clave" className="w-full p-30 mb-5" style={{ padding: '1rem' }} />

                            <Button label="Iniciar Sesión" className="w-full p-30 text-xl" onClick={iniciarSesion}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
