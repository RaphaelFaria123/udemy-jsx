import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BooksContext = createContext();

function Provider({ children }) {
    const [books, setBooks] = useState([]);
    const baseURL = 'http://localhost:3001/books';

    const fetchBooks = useCallback(async () => {
        try {
            const res = await axios.get(baseURL);
            setBooks(res.data);
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const createBook = (title) => {
        const book = {
            title
        };

        axios.post(baseURL, book)
            .then(res => {
                setBooks([...books, res.data]);
            })
            .catch(err => console.log(err));
    }

    const deleteBook = (id) => {
        axios.delete(`${baseURL}/${id}`)
            .then(res => {
                const newBooks = books.filter(book => book.id !== id);
                setBooks(newBooks);
            })
            .catch(err => console.log(err));
    }

    const updateBook = (updatedBook) => {
        axios.put(`${baseURL}/${updatedBook.id}`, updatedBook)
            .then(res => {
                const updatedBooks = books.map((book) => {
                    if (book.id === updatedBook.id) {
                        return { ...updatedBook, ...res.data };
                    }
                    return book;
                });

                setBooks(updatedBooks);
            })
            .catch(err => console.log(err));
    }

    const valueToShare = {
        books,
        createBook,
        deleteBook,
        updateBook
    };

    return (
        <BooksContext.Provider value={valueToShare}>
            {children}
        </BooksContext.Provider>
    );
}

export { Provider };
export default BooksContext;