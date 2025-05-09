import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import CreateBlogForm from './CreateBlogForm';

test('renders blog title and author', () => {
  const blog = {
    id: '1',
    title: 'Testing blog title',
    author: 'Testing blog author',
    url: 'http://example.com',
    likes: 10,
    user: {
      name: 'John Tester',
    },
  };

  const mockUpdateLike = vi.fn();
  const mockDeleteBlog = vi.fn();

  const { container } = render(
    <Blog blog={blog} updateLike={mockUpdateLike} deleteBlog={mockDeleteBlog} />
  );

  const div = container.querySelector('.blogHeader');
  expect(div).toHaveTextContent('Testing blog title Testing blog author');
});

test("clicking button show blog's url and likes", async () => {
  const blog = {
    id: '1',
    title: 'Testing blog title',
    author: 'Testing blog author',
    url: 'http://example.com',
    likes: 10,
    user: {
      name: 'John Tester',
    },
  };

  const mockUpdateLike = vi.fn();
  const mockDeleteBlog = vi.fn();

  const { container } = render(
    <Blog blog={blog} updateLike={mockUpdateLike} deleteBlog={mockDeleteBlog} />
  );

  const user = userEvent.setup();
  const button = container.querySelector('.toggle-btn');
  await user.click(button);

  const div = container.querySelector('.blogDetail');
  expect(div).toHaveTextContent('http://example.com');
  expect(div).toHaveTextContent('likes 10');
});

test("clicking button show blog's url and likes", async () => {
  const blog = {
    id: '1',
    title: 'Testing blog title',
    author: 'Testing blog author',
    url: 'http://example.com',
    likes: 10,
    user: {
      name: 'John Tester',
    },
  };

  const mockUpdateLike = vi.fn();
  const mockDeleteBlog = vi.fn();

  const { container } = render(
    <Blog blog={blog} updateLike={mockUpdateLike} deleteBlog={mockDeleteBlog} />
  );

  const user = userEvent.setup();
  const button = container.querySelector('.toggle-btn');
  await user.click(button);

  const likeButton = container.querySelector('.like-button');
  await user.click(likeButton);
  await user.click(likeButton);
  expect(mockUpdateLike.mock.calls).toHaveLength(2);
});

test('<CreateBlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<CreateBlogForm createBlog={createBlog} />);

  const titleInput = screen.getByPlaceholderText('Enter blog title here');
  const authorInput = screen.getByPlaceholderText('Enter blog author here');
  const urlInput = screen.getByPlaceholderText('Enter blog url here');
  const sendButton = screen.getByText('Create');

  await user.type(titleInput, 'testing title blog');
  await user.type(authorInput, 'testing author blog');
  await user.type(urlInput, 'testing url blog');
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  const blogObject = createBlog.mock.calls[0][0];
  expect(blogObject.title).toBe('testing title blog');
  expect(blogObject.author).toBe('testing author blog');
  expect(blogObject.url).toBe('testing url blog');
});
