import axios from 'axios'
const baseUrl = '/api/users'

const getUsers = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const exports = { getUsers }

export default exports