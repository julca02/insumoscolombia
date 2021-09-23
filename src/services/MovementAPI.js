import axios from "axios";
export const getMovement = async () => {
   return await axios.get('http://127.0.0.1:8000/api/movimiento')
}
export const createMovement = async (producto) => {
   return await axios.post('http://127.0.0.1:8000/api/movimiento', producto)
}
export const updateMovement = async (id, producto) => {
   return await axios.put(`http://127.0.0.1:8000/api/movimiento/${id}`, producto)
}
export const deleteMovement = async (id) => {
   return await axios.delete(`http://127.0.0.1:8000/api/movimiento/${id}`)
}