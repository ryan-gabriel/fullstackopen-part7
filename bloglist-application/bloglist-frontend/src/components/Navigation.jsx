import { Container, Nav, Navbar } from 'react-bootstrap';
import logoutService from '../services/auth/logout';
import { useLoggedUserDispatch } from '../hook/loggedUser';
const Navigation = ({ user }) => {
  const loggedUserDispatch = useLoggedUserDispatch();
  const handleLogout = async (event) => {
    event.preventDefault();
    logoutService.logout();
    loggedUserDispatch({
      type: 'CLEAR_USER',
    });
  };

  return (
    <Navbar expand="md" data-bs-theme="dark" variant="dark">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="text-white">
              Blogs
            </Nav.Link>
            <Nav.Link href="/users" className="text-white">
              Users
            </Nav.Link>
          </Nav>

          {user && (
            <div className="d-flex align-items-center text-white">
              <span className="me-2 fst-italic">{user.name} logged in</span>
              <button onClick={handleLogout} className="btn btn-sm btn-danger">
                Logout
              </button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
