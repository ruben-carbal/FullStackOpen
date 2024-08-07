import { useState } from 'react';

export const AddBlog = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();

    createBlog({
      title, author, url
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };


  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title <input data-testid='title' name="Title" value={title} onChange={(event) => {setTitle(event.target.value);}} />
        </div>
        <div>
          author <input data-testid='author' name="Author" value={author} onChange={(event) => {setAuthor(event.target.value);}} />
        </div>
        <div>
          url <input data-testid='url' name="Url" value={url} onChange={(event) => {setUrl(event.target.value);} } />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};
