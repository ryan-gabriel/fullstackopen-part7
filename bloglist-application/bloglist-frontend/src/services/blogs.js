import axios from 'axios';
const baseUrl = '/api/blogs';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getBlog = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const create = async (blog) => {
  try {
    const storedUser = window.localStorage.getItem('loggedNoteappUser');
    const user = JSON.parse(storedUser);
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    const response = await axios.post(baseUrl, blog, config);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateLike = async ({ id, blog }) => {
  try {
    const updatedBlog = await axios.put(`${baseUrl}/${id}`, blog);
    return updatedBlog.data;
  } catch (error) {
    throw error;
  }
};

const deleteBlog = async (id) => {
  try {
    const storedUser = window.localStorage.getItem('loggedNoteappUser');
    const user = JSON.parse(storedUser);
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    await axios.delete(`${baseUrl}/${id}`, config);
    return id;
  } catch (error) {
    throw error;
  }
};

const addComment = async (comment, blogId) => {
  try {
    const commentResponse = await axios.post(`${baseUrl}/${blogId}/comments`, {
      comment,
    });
    return commentResponse.data;
  } catch (error) {
    throw error;
  }
};

export default { getAll, create, getBlog, updateLike, deleteBlog, addComment };
