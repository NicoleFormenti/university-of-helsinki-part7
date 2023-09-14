import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import userProfileReducer from './reducers/userProfileReducer'

const reducer = combineReducers({
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    userProfile: userProfileReducer,
})

const store = createStore(
    reducer,
    applyMiddleware(thunk)
)

export default store