import axios from "axios";
export const getArticle = async () => {
   return await axios.get('http://127.0.0.1:8000/api/articulo-movimiento')
}
export const createArticle = async (articulo) => {
   return await axios.post('http://127.0.0.1:8000/api/articulo-movimiento', articulo)
}
export const updateArticle = async (id, articulo) => {
    try {
        return await axios.put(`http://127.0.0.1:8000/api/articulo-movimiento/${id}`, articulo)
    } catch (error) {
        console.log(error);
    }
}
export const deleteArticle = async (id) => {
   return await axios.delete(`http://127.0.0.1:8000/api/articulo-movimiento/${id}`)
}