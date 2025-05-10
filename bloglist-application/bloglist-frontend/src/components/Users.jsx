import { useQuery } from '@tanstack/react-query';
import Table from 'react-bootstrap/Table';
import userService from '../services/users';
import { Link } from 'react-router-dom';

const Users = () => {
  const users = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (users.isLoading) {
    return <div>Loading users...</div>;
  }

  if (users.isError) {
    return <div>Failed to fetch users</div>;
  }

  return (
    <>
      <Table borderless>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`} >{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Users;
