import React from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

export default function Links(props) {
  return (
    <Navbar>
      <Nav>
        <NavItem>
          <NavLink exact tag={RRNavLink} to={`/profile/${props.name}/`} activeClassName="selected">
            Tweets</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RRNavLink} to={`/profile/${props.name}/following`} activeClassName="selected">
            Following</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RRNavLink} to={`/profile/${props.name}/followers`} activeClassName="selected">
            Followers</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RRNavLink} to={`/profile/${props.name}/likes`} activeClassName="selected">
            Likes</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
}