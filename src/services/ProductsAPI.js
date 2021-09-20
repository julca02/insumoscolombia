import axios from "axios";
export const getProducts = async () => {
   return await axios.get('http://127.0.0.1:8000/api/productos')
}
export const createProduct = async (producto) => {
   return await axios.post('http://127.0.0.1:8000/api/productos', producto)
}
export const updateProduct = async (id, producto) => {
   return await axios.put(`http://127.0.0.1:8000/api/productos/${id}`, producto)
}
export const deleteProduct = async (id) => {
   return await axios.delete(`http://127.0.0.1:8000/api/productos/${id}`)
}