import Button from "@material-ui/core/Button"
import {followUser, unfollowUser} from "../../lib/api";

const FollowUser = ({
    isFollowing,
    toggleFollow
                    }) => {
  return (
      <Button variant='contained'
              color='primary'
              onClick={isFollowing ? toggleFollow(unfollowUser) : toggleFollow(followUser)}
      >
          {isFollowing ? 'unfollow' : 'follow'}
      </Button>
  )
};

export default FollowUser;
