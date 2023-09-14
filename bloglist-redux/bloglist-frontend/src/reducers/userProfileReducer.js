export const setUserProfile = (user) => {
    return {
        type: 'SET_PROFILE',
        userProfile: user,
    }
}

const userProfileReducer = (state = null, action) => {
    switch(action.type) {
    case 'SET_PROFILE':
        return action.userProfile
    default:
        return state
    }
}

export default userProfileReducer