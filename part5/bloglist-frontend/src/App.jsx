import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import { LoginForm } from './components/LoginForm';
import loginService from './services/login';
import { AddBlog } from './components/AddBlog';
import { Notification, Error } from './components/Notification';
import { Togglable } from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
  }, [blogs]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');

    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      );

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong Credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value);
  };

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const handleLikesUp = async (id) => {
    const blog = await blogs.find(blog => blog.id === id);
    const changeBlog = { ...blog, likes: blog.likes + 1 };

    const updatedBlog = await blogService.update(id, changeBlog);
    setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog));
  };

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);

      blogFormRef.current.toggleVisibility();
      setBlogs(blogs.concat(returnedBlog));
      setNotification(`a new blog ${blogObject.title} by ${blogObject.author}`);
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    } catch (exception) {
      setErrorMessage('Inputs shoudn\'t be empty');
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  const handleDelete = async (id) => {
    const blog = blogs.find(el => el.id === id);
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(id);
    }
  };

  return (
    <div>
      <Notification message={notification} />
      <Error message={errorMessage} />

      {user === null
        ? (<LoginForm
          username={username}
          password={password}
          handlePasswordChange={handlePasswordChange}
          handleUsernameChange={handleUsernameChange}
          handleSubmit={handleLogin}
        />)
        : (<div>
          <h2>blogs</h2>
          <p>
            <strong>{user.name}</strong> logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable ref={blogFormRef}>
            <AddBlog createBlog={createBlog}  />
          </Togglable>
          <div>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} handleClick={() => handleLikesUp(blog.id)} handleDelete={() => handleDelete(blog.id)} user={user} />
            )}
          </div>
        </div>)}
    </div>
  );
};

export default App;
