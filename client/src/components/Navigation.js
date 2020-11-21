import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import TweetModal from './TweetModal';
import LogoutModal from './LogoutModal';

import { logoutUser } from '../actions/userActions';

const Navigation = (props) => {
  return (
    <Navbar className="col-xl-4 col-lg-2 col-md-2 col-sm-3 col-19" id="main-navbar">
      <NavbarBrand tag={Link} to="/home">
        <i className="fa fa-fw fa-twitter"></i>
      </NavbarBrand>
      <Nav>
        <NavItem>
          <NavLink tag={RRNavLink} to="/home/" activeClassName="selected">
            <i className="fa fa-fw fa-home"></i>
            <span>&ensp;Home</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RRNavLink} to="/explore/" activeClassName="selected">
            <i className="fa fa-fw fa-hashtag"></i>
            <span>&ensp;Explore</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RRNavLink} to={`/profile/${props.user.userData.name}/`} activeClassName="selected">
            <i className="fa fa-fw fa-user"></i>
            <span>&ensp;Profile</span>
          </NavLink>
        </NavItem>
        <TweetModal handleTweet={props.handleTweet} toggle={props.toggle}
          tweetModal={props.tweetModal} />
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