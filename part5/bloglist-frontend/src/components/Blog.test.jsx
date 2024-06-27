import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('At first just renders title and author', () => {
  const blog = {
    title: 'A blog for a test',
    author: 'anonymous',
    url: 'lapaginadelfuturo.com',
    user: [{ name: 'Rubén Carbal' }],
  };

  const { container } = render(<Blog blog={blog} />);

  const div = container.querySelector('.blogList');
  const visible = container.querySelector('.visible');
  const notVisible = container.querySelector('.notVisible');

  expect(div).toBeDefined();
  expect(visible).not.toHaveStyle('display: none');
  expect(notVisible).toHaveStyle('display: none');
});

test('Url and likes are shown when button is clicked', async () => {
  const blog = {
    title: 'A blog for a test',
    author: 'anonymous',
    url: 'lapaginadelfuturo.com',
    user: [{ name: 'Rubén Carbal' }],
  };

  const { container } = render(<Blog blog={blog} />);

  const notVisible = container.querySelector('.notVisible');

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  expect(notVisible).not.toHaveStyle('display: none');
});

test('if clicked "like" twice, the event handler is called twice', async () => {
  const blog = {
    title: 'A blog for a test',
    author: 'anonymous',
    url: 'lapaginadelfuturo.com',
    user: [{ name: 'Rubén Carbal' }],
  };

  const mockHandler = vi.fn();

  const { container } = render(<Blog blog={blog} handleClick={mockHandler} />);

  const div = container.querySelector('.blogList');

  const user = userEvent.setup();
  const button = screen.getByText('like');
  await user.click(button);
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
