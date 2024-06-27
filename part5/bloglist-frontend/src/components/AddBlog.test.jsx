import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddBlog } from './AddBlog';

test('The form calls the event handler with the rigths details', async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<AddBlog createBlog={createBlog} />);

  const inputs = screen.getAllByRole('textbox');
  const button = screen.getByText('create');

  await user.type(inputs[0], "blog's title");
  await user.type(inputs[1], "blog's author");
  await user.type(inputs[2], "blog's url");
  await user.click(button);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("blog's title");
  expect(createBlog.mock.calls[0][0].author).toBe("blog's author");
  expect(createBlog.mock.calls[0][0].url).toBe("blog's url");
});
