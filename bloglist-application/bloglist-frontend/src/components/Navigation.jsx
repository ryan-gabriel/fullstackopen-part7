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
    <Navbar expand="lg" bg="dark" className="px-0">
      <Container fluid className="px-0 text-white">
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ borderColor: 'white' }}
        >
          <span
            className="navbar-toggler-icon"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='white' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")",
            }}
          />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="text-white ps-2">
              Blogs
            </Nav.Link>
            <Nav.Link href="/users" className="text-white ps-2">
              Users
            </Nav.Link>
            {user && (
              <div className="d-flex align-items-center ps-2">
                <span className="me-2">{user.name} logged in</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-danger"
                >
                  Logout
                </button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
