import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody
} from 'reactstrap';
import { connect } from 'react-redux';

class DeleteTweetModal extends Component {
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
        <Button id="delete-tweet"
          onClick={this.toggle} className="btn-sm btn-danger">
          <i className="far fa-trash-alt"></i>
        </Button>

        <Modal
          isOpen={this.state.modal}
          autoFocus={false}
          className="delete-modal"
        >
          <ModalBody>
            <h2>Delete Tweet ?</h2>
            <div>
              <Button onClick={this.toggle} >Cancel</Button>
              <Button onClick={e => this.props.deleteTweet(this.props.tweetId, e)} color="danger">
                Delete
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

export default connect(mapStateToProps, null)(DeleteTweetModal);
