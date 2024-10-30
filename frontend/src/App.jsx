import './App.css'
import RegisterPage from './pages/RegisterPage'
import TermsPage from './pages/TermsPage'
import HomePage from './pages/HomePage'
import LogInPage from './pages/LogInPage'
import SitePage from './pages/SitePage'
import UserPage from './pages/UserPage'
import RetailerHomePage from './pages/RetailerHomePage'
import RetailerFlowerPage from './pages/RetailerFlowerPage'
import RetailerLayout from './layouts/RetailerLayout'
import GrowerLayout from './layouts/GrowerLayout'
import GrowerFlowerPage from './pages/GrowerFlowerPage'
import LangSelect from './components/LangSelect'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Navbar, Nav, NavDropdown, Offcanvas } from "react-bootstrap"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [defaultRole, setDefaultRole] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showOffCanvas, setShowOffCanvas] = useState(false)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    setIsLoggedIn(!!token)
    setDefaultRole(role)
    setIsLoading(false)

    const langCookie = document.cookie.split("; ").find(row => row.startsWith("lang="))
    const language = langCookie ? langCookie.split("=")[1] : "en"
    i18n.changeLanguage(language)
  }, [])

  const handleClose = () => setShowOffCanvas(false)
  const handleShow = () => setShowOffCanvas(!showOffCanvas)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setDefaultRole('')
  };

  const padding = {
    padding: 5,
  };

  if (isLoading) {
    return <div>{t("label.loading")}</div>
  }

  return (
    <div>
      <Router>
        <div>
          <Navbar collapseOnSelect expand="lg" bg="light">
            <Button variant="light" className="mx-2" onClick={handleShow}>
              <span className='navbar-toggler-icon'></span>
            </Button>
            <Navbar.Brand>
              <h1>Slowers</h1>
            </Navbar.Brand>
              <Nav className="ms-auto">
                {isLoggedIn && (
                  <Nav.Link as={Link} to="/user">
                    {t("menu.profile")}
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/terms">
                  {t("menu.terms")}
                </Nav.Link>
                <NavDropdown title={t("menu.language")} id="collasible-nav-dropdown">
                  <LangSelect/>
                </NavDropdown>
              </Nav>
          </Navbar>
          <Offcanvas show={showOffCanvas} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title> 
                <h2>Slowers</h2>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <Nav className="justify-content-start flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/">
                  {t("menu.home")}
                </Nav.Link>
                {!isLoggedIn && (
                  <Nav.Link as={Link} to="/login">
                    {t("menu.login")}
                  </Nav.Link>
                )}
                {!isLoggedIn && (
                  <Nav.Link as={Link} to="/register">
                    {t("menu.register")}
                  </Nav.Link>
                )}
                {isLoggedIn && (
                <NavDropdown title={t("menu.role")} id="collasible-nav-dropdown">
                  <Nav.Link as={Link} to="/retailer">
                    {t("menu.retailer")}
                  </Nav.Link>
                  <Nav.Link as={Link} to="/grower">
                    {t("menu.grower")}
                  </Nav.Link>
                </NavDropdown>
                )}
                {isLoggedIn && (
                  <Nav.Link as={Link} onClick={handleLogout}>
                    {t("menu.logout")}
                  </Nav.Link>
                )}
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn 
                  ? defaultRole == 'retailer' 
                    ? <Navigate replace to='/retailer'/> 
                    : <Navigate replace to='/grower'/>
                  : <Navigate replace to="/login" />
              }
            />
            <Route
              path="/login"
              element={
                !isLoggedIn ? (
                  <LogInPage
                    onLogin={handleLogout}
                    setIsLoggedIn={setIsLoggedIn}
                    setDefaultRole={setDefaultRole}
                  />
                ) : (
                  <Navigate replace to="/" />
                )
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route
              path="/site"
              element={isLoggedIn ? <SitePage /> : <Navigate replace to="/login" />}
            />
            <Route
              path="/site/:id"
              element={isLoggedIn ? <SitePage /> : <Navigate replace to="/login" />}
            />
            <Route
              path="/flowers"
              element={isLoggedIn ? <HomePage /> : <Navigate replace to="/login" />}
            />

            <Route
              path="/retailer"
              element={isLoggedIn ? <RetailerLayout /> : <Navigate replace to="/login" />}
            >
              <Route index element={<RetailerHomePage />} />
              <Route path="flowers" element={<RetailerFlowerPage />} />
            </Route>
            <Route
              path="/grower"
              element={isLoggedIn ? <GrowerLayout /> : <Navigate replace to="/login" />}
            >
              <Route index element={<SitePage />} />
              <Route path="flowers" element={<GrowerFlowerPage />} />
            </Route>
            <Route
              path="/user"
              element={isLoggedIn ? <UserPage setDefaultRole={setDefaultRole}/> : <Navigate replace to="/login" />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
