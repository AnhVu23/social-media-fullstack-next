import axios from 'axios'

export const getUser = async id => {
    const {data} = await axios.get(`/api/users/profile/${id}`)
    return data
}
