'use client';

import React, { useState } from 'react';
import { db } from '@/app/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthProvider'; 
import { BookOpen } from 'lucide-react';

// Interfaz que define la estructura del documento en Firestore
interface BookData {
    title: string;
    author: string;
    status: 'Por Leer' | 'Leyendo' | 'Leído' | 'Prestado';
    rating: number; // 0 a 5
    review: string;
    createdAt: string; 
    // Campos adicionales sugeridos para progreso
    totalPages: number; 
    currentPage: number; 
}

interface AddBookFormProps {
    onSuccess: () => void; // Función para cerrar el modal o mostrar éxito
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onSuccess }) => {
    // Importante: Obtener el userId del hook de autenticación
    const { userId } = useAuth(); 
    
    // Estados del formulario
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState<BookData['status']>('Por Leer'); // Estado inicial "Por Leer"
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!userId) {
            setError('Error de sesión. Por favor, inicia sesión de nuevo.');
            setLoading(false);
            return;
        }

        if (!title.trim() || !author.trim()) {
            setError('El título y el autor son campos obligatorios.');
            setLoading(false);
            return;
        }

        try {
            // Crea el objeto del libro para Firestore
            const newBook: BookData = {
                title: title.trim(),
                author: author.trim(),
                status,
                rating: rating,
                review: review.trim(),
                createdAt: new Date().toISOString(),
                // Valores predeterminados para el progreso
                totalPages: 0, 
                currentPage: 0, 
            };

            // 1. Define la referencia al documento en la subcolección privada del usuario
            // Usamos un timestamp como ID para asegurar unicidad y tener un orden natural
            const newBookRef = doc(db, 'users', userId, 'userBooks', new Date().getTime().toString());
            
            // 2. Guarda el libro
            await setDoc(newBookRef, newBook);

            // Éxito
            onSuccess(); 

            // Limpiar formulario
            setTitle('');
            setAuthor('');
            setRating(0);
            setReview('');

        } catch (err) {
            console.error('Error al guardar el libro:', err);
            setError('Ocurrió un error al guardar el libro. Verifica tu conexión y las reglas de seguridad de Firestore.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Título y Autor (Ocupan todo el ancho) */}
                <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Título del Libro *</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-600 focus:outline-none transition"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="author" className="block text-sm font-semibold text-gray-700">Autor *</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-600 focus:outline-none transition"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Estado */}
                <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700">Estado</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as BookData['status'])}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-600 focus:outline-none bg-white transition"
                        disabled={loading}
                    >
                        <option value="Por Leer">Por Leer</option>
                        <option value="Leyendo">Leyendo</option>
                        <option value="Leído">Leído</option>
                        <option value="Prestado">Prestado</option>
                    </select>
                </div>
                {/* Calificación */}
                <div>
                    <label htmlFor="rating" className="block text-sm font-semibold text-gray-700">
                        Calificación
                    </label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-600 focus:outline-none bg-white transition"
                        disabled={loading}
                    >
                        <option value={0}>0</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>

                    </select>
                </div>

            </div>

            {/* Reseña Corta */}
            <div className="pt-2 md:col-span-2">
                <label htmlFor="review" className="block text-sm font-semibold text-gray-700">Reseña Corta</label>
                <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-600 focus:outline-none transition"
                    placeholder="Escribe una breve reseña o tus primeras impresiones..."
                    disabled={loading}
                ></textarea>
            </div>
            
            {error && (
                <p className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200 text-center">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading || !userId} // Deshabilitado si carga o no hay usuario
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition"
            >
                <BookOpen className="w-5 h-5 mr-2" />
                {loading ? 'Guardando Libro...' : 'Guardar Libro'}
            </button>
        </form>
    );
};

export default AddBookForm;
