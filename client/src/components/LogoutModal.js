import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody
} from 'reactstrap';
import { connect } from 'react-redux';

class LogoutModal extends Component {
  constructor(props) {
    super();
    this.state = {
      modal: false
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <>
        <Button id="log-out" color="primary" onClick={this.toggle}>
          <i className="fa fa-fw fa-sign-out"></i>
          <span> Log out</span>
        </Button>

        <Modal
          isOpen={this.state.modal}
          autoFocus={false}
          className="delete-modal"
        >
          <ModalBody>
            <h2>Log out of Tweets ?</h2>
            <div>
              <Button onClick={this.toggle} >Cancel</Button>
              <Button onClick={this.props.handleLogout} color="primary">
                Log out
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(LogoutModal);
