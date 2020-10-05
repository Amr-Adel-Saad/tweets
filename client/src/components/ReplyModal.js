import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';

class ReplyModal extends Component {
  constructor(props) {
    super();
    this.state = {
      reply: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <>
        <Button id="reply-button" onClick={this.props.toggle}>
          <i className="far fa-lg fa-comment-dots"></i>
        </Button>
  
        <Modal
          isOpen={this.props.modal}
          toggle={this.props.toggle}
          autoFocus={false}
        >
          <ModalHeader toggle={this.props.toggle}></ModalHeader>
          <ModalBody>
            <div>
              <img src={this.props.user.userData.image} alt={this.props.user.userData.name} />
            </div>
            <Form onSubmit={e => this.props.handleReply(this.state.reply, e)}>
              <FormGroup>
                <Input
                  maxLength="280"
                  type="textarea"
                  name="reply"
                  placeholder="reply"
                  onChange={this.handleChange}
                  autoFocus={true}
                />
                <Button disabled={this.state.reply.length < 1} color="primary">
                  Reply
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ReplyModal);