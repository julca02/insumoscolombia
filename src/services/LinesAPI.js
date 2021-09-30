import axios from "axios";
export const getLines = async () => {
   return await axios.get('http://127.0.0.1:8000/api/linea')
}
export const createLine = async (linea) => {
   return await axios.post('http://127.0.0.1:8000/api/linea', linea)
}
export const updateLine = async (id, linea) => {
    try {
        return await axios.put(`http://127.0.0.1:8000/api/linea/${id}`, linea)
    } catch (error) {
        console.log(error);
    }
}
export const deleteLine = async (id) => {
   return await axios.delete(`http://127.0.0.1:8000/api/linea/${id}`)
}