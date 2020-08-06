import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Button } from 'reactstrap';

const Navigation = (props) => {
  return (
    <Navbar>
      <NavbarBrand tag={Link} to="/home">
        <i className="fa fa-fw fa-2x fa-twitter"></i>
      </NavbarBrand>
      <Nav>
        <NavItem>
          <NavLink tag={Link} to="/home"><i className="fa fa-fw fa-home"></i><span> Home</span></NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="#"><i className="fa fa-fw fa-hashtag"></i><span> Explore</span></NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="#"><i className="fa fa-fw fa-user"></i><span> Profile</span></NavLink>
        </NavItem>
        <NavItem>
          <NavLink id="tweet" tag={Link} to="#" >
          <i className="fa fa-fw fa-paper-plane"></i>
            <span> Tweet</span>
          </NavLink>
        </NavItem>
        <section className="user-info">
          <div>
            <img src={props.user.userData.image} alt="User"/><br/>{props.user.userData.name}
          </div>
          <Button style={{ margin: "15px auto" }} color="primary" onClick={props.handleLogout}>
            <i className="fa fa-fw fa-sign-out"></i><span> Log out</span>
          </Button>
        </section>
      </Nav>
    </Navbar>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Navigation);