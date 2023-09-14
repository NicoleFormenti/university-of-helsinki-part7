export const setUser = (user) => {
    return {
        type: 'SET',
        user: user,
    }
}

const userReducer = (state = null, action) => {
    switch(action.type) {
    case 'SET':
        return action.user
    default:
        return state
    }
}

export default userReducer