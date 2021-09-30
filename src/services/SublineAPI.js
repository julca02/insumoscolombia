import axios from "axios";
export const getSubline = async () => {
   return await axios.get('http://127.0.0.1:8000/api/sublinea')
}
export const createSubline = async (linea) => {
   return await axios.post('http://127.0.0.1:8000/api/sublinea', linea)
}
export const updateSubline = async (id, linea) => {
    try {
        return await axios.put(`http://127.0.0.1:8000/api/sublinea/${id}`, linea)
    } catch (error) {
        console.log(error);
    }
}
export const deleteSubline = async (id) => {
    return await axios.delete(`http://127.0.0.1:8000/api/sublinea/${id}`)
 }