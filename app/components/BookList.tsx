'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, query, where, onSnapshot, DocumentData,deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { BookOpen, AlertCircle, Loader2, Pencil, Trash2  } from 'lucide-react';

// Interfaz para la estructura del libro, incluyendo el ID del documento
interface Book extends DocumentData {
    id: string; // ID del documento de Firestore
    title: string;
    author: string;
    status: 'Por Leer' | 'Leyendo' | 'Leído' | 'Prestado';
    rating: number;
    review: string;
    currentPage: number;
    totalPages: number;
    createdAt: string;
}

interface BookListProps {
    currentTab: string; // 'Leyendo', 'Por Leer', 'Leídos', 'Prestados'
}

const BookList: React.FC<BookListProps> = ({ currentTab }) => {
    const { userId } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        // Solo intentamos cargar si el usuario está autenticado
        if (!userId) {
            setLoading(false);
            setBooks([]);
            return;
        }

        setLoading(true);
        setError(null);

        // 1. Crear la referencia a la subcolección
        const booksCollectionRef = collection(db, 'users', userId, 'userBooks');

        // 2. Crear la consulta:
        // - Filtra por el estado actual de la pestaña.
        // - Ordena por la fecha de creación (los más nuevos primero).
        const booksQuery = query(
            booksCollectionRef,
            where('status', '==', currentTab),
            // Nota: Se recomienda ordenar en la aplicación si se necesita un orden diferente a los índices.
            // Para simplificar, asumiremos que los índices por defecto son suficientes.
        );

        // 3. Suscribirse a los cambios en tiempo real (onSnapshot)
        const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
            try {
                const booksData: Book[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Book[];
                
                setBooks(booksData);
                setLoading(false);
            } catch (e) {
                console.error("Error al cargar los libros:", e);
                setError("No se pudieron cargar los datos. Verifique las reglas de seguridad.");
                setLoading(false);
            }
        }, (e) => {
            // Manejo de errores de onSnapshot (e.g., permisos denegados)
            console.error("Error de Firestore en tiempo real:", e);
            setError("Error de conexión a la base de datos.");
            setLoading(false);
        });

        // La función de retorno de useEffect se encarga de cancelar la suscripción
        return () => unsubscribe();
    }, [userId, currentTab]); // Se vuelve a ejecutar cuando cambia el usuario o la pestaña

    const handleEdit = (book: Book) => {
        console.log(`Editar libro: ${book.title}`, book);
        // Aquí llamarías a tu función/modal de edición
        // Por ejemplo: openEditModal(book);
    };

    const handleDelete = async (bookId: string, bookTitle: string) => {
        if (!userId) return;

        const confirmDelete = window.confirm(`¿Estás seguro de eliminar "${bookTitle}"?`);
        if (!confirmDelete) return;

        setDeletingId(bookId);
        try {
            const bookDocRef = doc(db, 'users', userId, 'userBooks', bookId);
            await deleteDoc(bookDocRef);
            console.log(`Libro eliminado: ${bookTitle}`);
        } catch (e) {
            console.error("Error al eliminar el libro:", e);
            alert("No se pudo eliminar el libro. Intenta nuevamente.");
        } finally {
            setDeletingId(null);
        }
    };


    // --- Lógica de Visualización ---

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-2" />
                <p className="text-gray-500 font-medium">Cargando libros...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-10 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="text-center p-10 bg-gray-50 rounded-xl">
                <BookOpen className="w-10 h-10 mx-auto text-indigo-400 mb-3" />
                <p className="text-gray-600 font-semibold">¡No hay libros en la pestaña "{currentTab}"!</p>
                <p className="text-gray-500 text-sm mt-1">
                    {currentTab === 'Leyendo' ? 'Añade un libro para empezar a leer.' : 'Cambia el estado de tus libros.'}
                </p>
            </div>
        );
    }

    // Listado principal de libros
    return (
        <div className="space-y-4">
            {books.map((book) => (
                <div key={book.id} className="bg-white p-4 border border-gray-200 rounded-xl shadow-md transition duration-300 hover:shadow-lg flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 truncate">Por: {book.author}</p>
                         <p className="text-sm text-gray-500 truncate"> {book.review}</p>
                        
                        {/* Indicador de Progreso (si es Leyendo) */}
                        {book.status === 'Leyendo' && book.totalPages > 0 && (
                            <div className="mt-2">
                                <p className="text-xs font-medium text-indigo-600">Progreso: {Math.round((book.currentPage / book.totalPages) * 100)}%</p>
                                <div className="w-full bg-indigo-100 rounded-full h-1.5 mt-1">
                                    <div 
                                        className="bg-indigo-500 h-1.5 rounded-full" 
                                        style={{ width: `${Math.round((book.currentPage / book.totalPages) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        
                        {/* Reseña/Rating */}
                        {book.rating > 0 && (
                            <div className="text-xs text-yellow-500 mt-2">
                                Calificación: {'★'.repeat(book.rating) + '☆'.repeat(5 - book.rating)}
                            </div>
                        )}
                    </div>
                    
                     {/* Botones de Acción con Iconos - Material Design 3 */}
                    <div className="flex gap-2 ml-4">
                        {/* Botón Editar */}
                        <button 
                            className="bg-indigo-100 text-indigo-700 p-2.5 rounded-xl hover:bg-indigo-200 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEdit(book)}
                            disabled={deletingId === book.id}
                            title="Editar libro"
                            aria-label="Editar libro"
                        >
                            <Pencil className="w-5 h-5" />
                        </button>
                        
                        {/* Botón Eliminar */}
                        <button 
                            className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDelete(book.id, book.title)}
                            disabled={deletingId === book.id}
                            title="Eliminar libro"
                            aria-label="Eliminar libro"
                        >
                            {deletingId === book.id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Trash2 className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    
                </div>
            ))}
        </div>
    );
};

export default BookList;
