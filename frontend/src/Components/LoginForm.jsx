import login from "../services/login.js"

export default function LoginForm({ setUsername, setPassword, setUser, username, password, setErrorMessage }) {
    const handleLogin = async (event) => {
        event.preventDefault()
        setErrorMessage('')  // Clear previous error messages

        try {
            const user = await login({ username, password })
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
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
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
