import axios from 'axios'

export const getUser = async id => {
    const {data} = await axios.get(`/api/users/profile/${id}`)
    return data
}

export const followUser = async id => {
    const {data} = await axios.put(`api/users/follow`, {followId: id})
    return data
}

export const unfollowUser = async id => {
    const {data} = await axios.put(`api/users/unfollow`, {followId: id})
    return data
}
