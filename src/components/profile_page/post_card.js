import React, { Component } from "react";
import "./postcard.css";
import { withFirebase } from "../firebase/";

const classes = {
  userPostAuthor: "user-post-author",
  userPostContainer: "user-post-container",
  userPostTitle: "user-post-title",
  userPostContent: "user-post-content",
  userPostTimestamp: "user-post-timestamp",
  likeBtn: "like-btn",
  dislikeBtn: "dislike-btn",
  upperBlock: "upper-block",
  lowerBlock: "lower-block",
  likeBar: "like-bar",
  dislikeBar: "dislike-bar",
  voteContainer: "vote-container"
};

const PostCard = props => (
  <React.Fragment>{withFirebase(PostCardBaseClass)(props)}</React.Fragment>
);

class PostCardBaseClass extends Component {
  state = {
    imageURL: null
  };

  componentDidMount() {
    if (this.props.postType === "image") {
      setTimeout(() => {
        this.props.firebase
          .postImage(this.props.postID)
          .getDownloadURL()
          .then(url => {
            this.setState({ imageURL: url });
          });
      }, 10000);
    }
  }

  render() {
    let total = this.props.likes + this.props.dislikes;
    let likeValid = false;
    let dislikeValid = false;
    if (total === 0) {
      total = 1;
    }
    if (this.props.liked) {
      likeValid = this.props.liked.includes(this.props.UID);
    }
    if (this.props.disliked) {
      dislikeValid = this.props.disliked.includes(this.props.UID);
    }

    let likeWidth = this.props.likes / total;
    let dislikeWidth = this.props.dislikes / total;
    likeWidth = likeWidth * 100 + "%";
    dislikeWidth = dislikeWidth * 100 + "%";

    let date = new Date(this.props.timestamp);

    return (
      <div className={classes.userPostContainer}>
        <div className={classes.upperBlock}>
          <div className={classes.userPostAuthor}>
            <span>{this.props.postAuthor}</span>
          </div>
          <div className={classes.userPostTitle}>
            <p>{this.props.postTitle}</p>
          </div>
          <div className={classes.userPostContent}>
            {this.props.postType && (
              <img className="post-image" src={this.state.imageURL} />
            )}
            {!this.props.postType && <p>{this.props.postContent}</p>}
          </div>
        </div>
        <div className={classes.lowerBlock}>
          <div>
            <button
              className={classes.likeBtn}
              disabled={likeValid}
              name={this.props.postID}
              onClick={this.props.onLikeBtn}
            >
              Like
            </button>
          </div>
          <div>
            <button
              className={classes.dislikeBtn}
              disabled={dislikeValid}
              name={this.props.postID}
              onClick={this.props.onDislikeBtn}
            >
              Dislike
            </button>
          </div>
          <div className={classes.userPostTimestamp}>
            <span>{this.props.timestamp}</span>
          </div>
        </div>
        <div className={classes.voteContainer}>
          <div className={classes.likeBar} style={{ width: likeWidth }}></div>
          <div
            className={classes.dislikeBar}
            style={{ width: dislikeWidth }}
          ></div>
        </div>
      </div>
    );
  }
}

export default PostCard;
