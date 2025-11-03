'use client';
// Pantalla de Retos y Metas (image_be97ca.png)
import React from 'react';
import { useAuth } from '@/app/components/AuthProvider';
import { Target, PlusCircle } from 'lucide-react';

const MetasPage: React.FC = () => {
    const { userId } = useAuth();
    
    // Simulación de Metas
    const goals = [
        { name: 'Leer 10 libros en 2025', progress: 80.0, unit: 'Libros', current: 8, total: 10, color: 'bg-pink-500' },
        { name: 'Leer al menos 20 minutos diarios', progress: 71.4, unit: 'Días Semana', current: 5, total: 7, color: 'bg-pink-500' },
    ];

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-3xl font-bold text-blue-700 text-center">Retos y Metas de Lectura</h2>
             {/*<div className="text-sm text-gray-500 text-center">Usuario ID: <span className="font-mono">{userId?.substring(0, 8)}...</span></div> */}

            {goals.map((goal, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-800 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-pink-500" />
                            {goal.name}
                        </p>
                        <span className="text-sm font-bold text-pink-600">{goal.unit}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                        Avance: <span className="font-medium text-gray-700">{goal.current}</span> de <span className="font-medium text-gray-700">{goal.total}</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className={`${goal.color} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${goal.progress}%` }}
                        ></div>
                    </div>
                    <p className="text-right text-xs font-medium mt-1" style={{ color: '#ec4899' }}>{goal.progress.toFixed(1)}%</p>
                </div>
            ))}

            <div className="text-center pt-4">
                <button className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition duration-150">
                    <PlusCircle className="w-5 h-5 mr-2 text-blue-500" />
                    Crear Nuevo Reto
                </button>
            </div>
        </div>
    );
};

export default MetasPage;
