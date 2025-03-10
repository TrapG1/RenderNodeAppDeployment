import login from "../services/login.js"
import PropTypes from 'prop-types'

export default function LoginForm({ setUsername, setPassword, setUser, username, password, setErrorMessage, setToken }) {
    const handleLogin = async (event) => {
        event.preventDefault()
        setErrorMessage('')  // Clear previous error messages

        LoginForm.propTypes = {
            handleSubmit: PropTypes.func.isRequired,
            handleUsernameChange: PropTypes.func.isRequired,
            handlePasswordChange: PropTypes.func.isRequired,
            username: PropTypes.string.isRequired,
            password: PropTypes.string.isRequired
        }

        try {
            //login will send req to login url, which finds the user in the backend, if successfull
            //it will return the username and a token for the user 
            const user = await login({ username, password })
            window.localStorage.setItem(
                'loggedPhonebookAppUser', JSON.stringify(user)
            )
            setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            // Handle specific errors from the backend
            if (exception.response && exception.response.status === 401) {
                setErrorMessage('Invalid username or password')
            } else if (exception.response && exception.response.status === 500) {
                setErrorMessage('Server error, please try again later')
            } else if (exception.message === 'Network Error') {
                setErrorMessage('Network error, please check your connection')
            } else {
                setErrorMessage('An unexpected error occurred')
            }
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    data-testid="username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    data-testid="password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )
}
