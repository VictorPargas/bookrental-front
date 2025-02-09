import axios, { AxiosPromise } from 'axios';
import { ResultLogin } from '../types/auth';

const xhr = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

xhr.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

xhr.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);


// Autenticação
const login = (params: { email: string; password: string }): AxiosPromise<ResultLogin> => 
    xhr.post('/login', params).then(response => {
        const { accessToken } = response.data.tokens;
        localStorage.setItem('accessToken', accessToken);
        return response;
    });

// Usuário
const registerUser = <T>(params: T): AxiosPromise =>
    xhr.post('/user', params);

const getUserProfile = (): AxiosPromise =>
    xhr.get('/user');

const getAllUsers = (): AxiosPromise =>
    xhr.get('/user/all');

const updateUser = <T>(params: T): AxiosPromise =>
    xhr.put('/user', params);

const changePassword = <T>(params: T): AxiosPromise =>
    xhr.put('/user/change-password', params);

// Autores
const createAuthor = <T>(params: T): AxiosPromise =>
    xhr.post('author/api/authors', params);

const getAllAuthors = (): AxiosPromise =>
    xhr.get('author/api/authors');

// Livros
const createBook = <T>(params: T): AxiosPromise =>
    xhr.post('/book', params);

const getAllBooks = (): AxiosPromise =>
    xhr.get('/book');


// Editoras
const createPublisher = <T>(params: T): AxiosPromise =>
    xhr.post('publisher/api/publishers', params);

const getAllPublishers = (): AxiosPromise =>
    xhr.get('publisher/api/publishers');

// Aluguel de Livros
const registerRental = <T>(params: T): AxiosPromise =>
    xhr.post('bookrental/register', params);

const renewRental = <T>(rentalId: number, params: T): AxiosPromise =>
    xhr.put(`bookrental/renew/${rentalId}`, params);

const returnRental = (rentalId: number): AxiosPromise =>
    xhr.put(`bookrental/return/${rentalId}`);

const getAllRentals = (): AxiosPromise =>
    xhr.get('bookrental/all');
    


const api = {
    login,
    registerUser,
    getAllUsers,
    getUserProfile,
    updateUser,
    changePassword,
    createAuthor,
    getAllAuthors,
    createBook,
    getAllBooks,
    createPublisher,
    getAllPublishers,
    registerRental,
    renewRental,
    returnRental,
    getAllRentals,
}

export default api;