import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import TweetModal from './TweetModal';
import LogoutModal from './LogoutModal';

import { logoutUser } from '../actions/userActions';

const Navigation = (props) => {
  return (
    <Navbar className="col-2-5" id="main-navbar">
      <NavbarBrand tag={Link} to="/home">
        <i className="fa fa-fw fa-2x fa-twitter"></i>
      </NavbarBrand>
      <Nav>
        <NavItem>
          <NavLink tag={Link} to="/home/"><i className="fa fa-fw fa-home"></i>
            <span>&ensp;Home</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="#"><i className="fa fa-fw fa-hashtag"></i>
            <span>&ensp;Trending</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={`/profile/${props.user.userData.name}/`}>
            <i className="fa fa-fw fa-user"></i>
            <span>&ensp;Profile</span>
          </NavLink>
        </NavItem>
        <TweetModal />
        <section className="user-info">
          {
            (props.user.userData)
              ? <div>
                <img src={props.user.userData.image} alt="profile" /><br />
                <span>{props.user.userData.name}</span>
              </div>
              : <div>
                <img src="/uploads/default.png" alt="profile" /><br />
              </div>
          }
          <LogoutModal handleLogout={props.handleLogout} />
        </section>
      </Nav>
    </Navbar>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { logoutUser })(Navigation);