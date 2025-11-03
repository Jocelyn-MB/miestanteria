'use client';
// Pantalla de Cronómetro de Lectura (image_be97a6.png)
import React from 'react';
import { useAuth } from '@/app/components/AuthProvider';

const CronometroPage: React.FC = () => {
    const { userId } = useAuth();
    
    // Aquí iría la lógica del cronómetro, gráficos, etc.
    return (
        <div className="text-center space-y-8 p-4">
            <h2 className="text-3xl font-bold text-blue-700">Cronómetro de Lectura</h2>
            

            {/* Cronómetro Visual */}
            <div className="flex justify-center items-center">
                <div className="w-56 h-56 rounded-full border-8 border-blue-200 bg-blue-50 flex flex-col justify-center items-center shadow-inner">
                    <p className="text-4xl font-extrabold text-blue-600">00:00:00</p>
                    <p className="text-sm text-gray-600 mt-1">Tiempo de sesión</p>
                </div>
            </div>

            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-150 text-lg">
                INICIAR LECTURA
            </button>

            {/* Módulos de Metas Diarias y Semanales */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <p className="font-semibold text-gray-700">Meta Diaria (20 min)</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">10% completado hoy (00:02:00)</p>
            </div>
            
            {/* Gráfico Semanal (Simulado) */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-inner">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Tiempo de Lectura Semanal (Horas)</h3>
                <div className="flex justify-around items-end h-24">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
                        <div key={day} className="flex flex-col items-center">
                            <div 
                                className="w-4 bg-blue-400 rounded-t-md transition-all duration-500"
                                style={{ height: `${(index + 1) * 10}px` }} 
                            ></div>
                            <span className="text-xs text-gray-600 mt-1">{day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CronometroPage;
