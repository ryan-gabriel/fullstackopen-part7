import { useQuery } from '@tanstack/react-query';
import Table from 'react-bootstrap/Table';
import userService from '../services/users';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import FailedMessage from './FailedMessage';

const Users = () => {
  const users = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (users.isLoading) {
    return <Loading />;
  }

  if (users.isError) {
    return <FailedMessage message={'Failed to fetch users'} />;
  }

  return (
    <>
      <h2 className="text-center text-light my-4">Users & Blog Count</h2>
      <Table
        striped
        bordered
        hover
        variant="dark"
        responsive="md"
        className="rounded overflow-hidden shadow"
      >
        <thead>
          <tr>
            <th className="text-center">User</th>
            <th className="text-center">Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map((user) => (
            <tr key={user.id}>
              <td className="text-center">
                <Link
                  to={`/users/${user.id}`}
                  className="text-info text-decoration-none fw-semibold"
                >
                  {user.name}
                </Link>
              </td>
              <td className="text-center">{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Users;
