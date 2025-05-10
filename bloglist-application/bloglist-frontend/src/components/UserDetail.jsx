import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const userId = useParams().id;
  const user = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (user.isLoading) {
    return <div>Loading user...</div>;
  }

  if (user.isError) {
    return <div>Failed to fetch user</div>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <h3>Added blogs</h3>
      <ul>
        {user.data.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  );
};

export default UserDetail;
