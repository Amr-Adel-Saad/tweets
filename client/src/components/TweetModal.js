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
import axios from 'axios';

class TweetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      tweet: ''
    }
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    const newTweet = {
      tweets: {
        content: this.state.tweet,
        likes: []
      }
    }

    axios({
			method: 'patch',
			url: `/api/user/${this.props.user.userData._id}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('userToken')}`
			},
			data: newTweet
		})
			.then(res => {
          this.toggle();
          window.location.reload();
				})
			.catch(err => { console.log(err); });
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <Button color="primary" id="tweet-button" onClick={this.toggle}>
          <i className="fas fa-feather-alt"></i>
          <span> Tweet</span>
        </Button>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody>
            <div>
              <img src={this.props.user.userData.image} alt="profile"/>
            </div>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Input
                  maxLength="280"
                  type="textarea"
                  name="tweet"
                  placeholder="What's happening ?"
                  onChange={this.handleChange}
                />
                <Button disabled={this.state.tweet.length < 1} color="primary">
                  Tweet
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(TweetModal);