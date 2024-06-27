import { useState } from 'react';
import '../stylesheets/Blog.css';

const Blog = ({ blog, handleClick, handleDelete }) => {
  const [isVisible, setIsVisible] = useState(false);

  const controlVisibility = { display: isVisible ? '' : 'none' };

  const setVisible = () => {
    setIsVisible(!isVisible);
  };

  return(
    <div className="blogList">
      <div className='visible'>
        {blog.title} {blog.author}
        <button onClick={setVisible}>{isVisible ? 'hide' : 'view'}</button>
      </div>
      <div style={controlVisibility} className='notVisible'>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={handleClick}>like</button></div>
        <div>{blog.user[0].name}</div>
        <button onClick={handleDelete} className="remove">remove</button>
      </div>
    </div>
  );
};

export default Blog;
