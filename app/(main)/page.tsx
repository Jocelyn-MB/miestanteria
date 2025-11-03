'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Modal from '@/app/components/Modal';
import AddBookForm from '@/app/components/AddBookForm';
import BookList from '../components/BookList';
import { Plus } from 'lucide-react';

//Tipo para las pestañas
type TabStatus = 'Leyendo' | 'Por Leer' | 'Leídos' | 'Prestados';
const TABS: TabStatus[] = ['Leyendo', 'Por Leer', 'Leídos', 'Prestados'];

export default function EstanteriaPage() {
    const router = useRouter();
    
    // 1. LLAMADA DE HOOKS SIN CONDICIONES AL INICIO
    const { userId, isAuthenticated, loading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState<TabStatus>('Leyendo'); // se aegura que es estado inicial es  uno de los TabStatus

    // 2. EFECTO PARA MANEJAR LA AUTENTICACIÓN Y REDIRIGIR
    useEffect(() => {
        // Redirige SÓLO después de que la autenticación ha terminado de cargar
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]); // Dependencias obligatorias

    // Función de callback al guardar el libro con éxito
    const handleFormSuccess = () => {
        setIsModalOpen(false);
        // Aquí podrías agregar una notificación de éxito
    };

    const lecturaHoy = "00:20:00"; // Datos estáticos por ahora
    const totalSemanal = "04:00:00"; // Datos estáticos por ahora

    // 3. RENDERIZACIÓN CONDICIONAL BASADA EN EL ESTADO DEL HOOK
    if (loading) {
        // Muestra un estado de carga mientras verifica la sesión
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold text-indigo-600">Verificando sesión...</p>
            </div>
        );
    }

    // Si no está cargando Y no está autenticado, el useEffect ya disparó la redirección,
    // pero evitamos renderizar el contenido hasta que se complete:
    if (!isAuthenticated) {
        return null;
    }

    // Contenido principal de la Estantería
    return (
        <main className="p-4 pt-20 pb-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Mi Estantería Digital</h2>

            {/* Tarjetas de Métricas (Mantiene la estructura de tu prototipo) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-100 p-4 rounded-xl shadow-lg text-center">
                    <p className="text-3xl font-extrabold text-green-600">{lecturaHoy}</p>
                    <p className="text-sm text-green-700 mt-1">Lectura Hoy</p>
                </div>
                <div className="bg-indigo-100 p-4 rounded-xl shadow-lg text-center">
                    <p className="text-3xl font-extrabold text-indigo-600">{totalSemanal}</p>
                    <p className="text-sm text-indigo-700 mt-1">Total Semanal</p>
                </div>
            </div>

            {/* Pestañas de Filtro (Mantiene la estructura de tu prototipo) */}
            <div className="flex space-x-2 mb-8 overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`py-2 px-4 rounded-full font-medium transition-all duration-300 whitespace-nowrap 
                            ${currentTab === tab
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`
                        }
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Área de Listado de Libros (Aquí irá el componente de lista en el futuro) */}
            <div className="min-h-[200px] w-full">
                <BookList currentTab={currentTab} />
            </div>


            {/* Botón Flotante para Agregar Libro */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-20 right-6 bg-pink-500 text-white p-4 rounded-full shadow-2xl hover:bg-pink-600 transition transform hover:scale-105 z-40"
                aria-label="Añadir nuevo libro"
            >
                <Plus className="w-7 h-7" />
            </button>
            
            {/* Modal para Agregar Libro */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Añadir Nuevo Libro"
            >
                <AddBookForm onSuccess={handleFormSuccess} />
            </Modal>
        </main>
    );
}
