import React from 'react'
import { Link } from 'react-router-dom'

const UserDetails = ({ allUsers }) => {

    return (
        <div>
            <h2>Users</h2>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        allUsers.map(user =>
                            <tr key={ user.id }>
                                <td>
                                    <Link to={ `/users/${user.id}` }>{ user.username }</Link>
                                </td>
                                <td>{ user.blogs.length }</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default UserDetails