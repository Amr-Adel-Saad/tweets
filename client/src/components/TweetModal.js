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

class TweetModal extends Component {
  constructor(props) {
    super();
    this.state = {
      tweet: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ tweet: e.target.value });

    e.target.style.height = 'auto';
		e.target.style.height = e.target.scrollHeight + 'px';
  };

  render() {
    return (
      <>
        <Button color="primary" id="tweet-button" onClick={this.props.toggle}>
          <i className="fas fa-feather-alt"></i>
          <span> Tweet</span>
        </Button>

        <Modal
          isOpen={this.props.tweetModal}
          toggle={this.props.toggle}
          autoFocus={false}
        >
          <ModalHeader toggle={this.props.toggle}></ModalHeader>
          <ModalBody>
            <img src={this.props.user.userData.image} alt="profile" />
            <Form onSubmit={e => this.props.handleTweet(this.state.tweet, e)}>
              <FormGroup>
                <Input
                  maxLength="280"
                  type="textarea"
                  name="tweet"
                  placeholder="What's happening ?"
                  onChange={this.handleChange}
                  autoFocus={true}
                />
                <Button disabled={this.state.tweet.length < 1} color="primary">
                  Tweet
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

export default connect(mapStateToProps, null)(TweetModal);