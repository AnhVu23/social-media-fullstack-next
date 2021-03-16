import React from 'react'
import Link from 'next/link'
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Divider} from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import {authInitialProps} from "../lib/auth";
import {getUser} from "../lib/api";
import FollowUser from '../components/profile/FollowUser'

class Profile extends React.Component {
    state = {
        user: null,
        isAuth: false,
        isLoading: false,
        isFollowing: false
    };

    async componentDidMount() {
        try {
            const {userId, auth} = this.props
            const isAuth = auth.user._id === userId
            const isFollowing = this.checkFollow(auth, user)
            this.setState({
                isLoading: true,
                user: null
            })
            const user = await getUser(userId)
            this.setState({
                user,
                isAuth,
                isFollowing
            })
        } catch (e) {

        } finally {
            this.setState({
                isLoading: false
            })
        }
    }

    checkFollow = (auth, user) => {
        return user.followers.findIndex(follower => follower._id === auth.user._id) !== -1
    }

    toggleFollow = async request => {
        const {userId} = this.props
        await request(userId)
        this.setState(prevState => ({
            isFollowing: !prevState.isFollowing
        }))
    }

    render() {
        const {classes} = this.props
        const {isLoading, user, isAuth, isFollowing} = this.state
        if (user === null) {
            return null
        }
        return (
            <Paper className={classes.root} elevation={4}>
                <Typography variant='h4'
                            component='h1'
                            align='center'
                            className={classes.title}
                            gutterBottom
                >
                    Profile
                </Typography>
                {isLoading ? (
                    <div className={classes.progressContainer}>
                        <CircularProgress className={classes.progress}
                                          size={55}
                                          thickness={5}
                        />
                    </div>
                ) : <List dense>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src={user.avatar} className={classes.bigAvatar}/>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} secondary={user.email}/>
                        {isAuth ? (
                            <ListItemSecondaryAction>
                                <Link href={'/edit=profile'}>
                                    <a>
                                        <IconButton>
                                            <Edit/>
                                        </IconButton>
                                    </a>
                                </Link>
                            </ListItemSecondaryAction>
                        ) : <FollowUser isFollowing={isFollowing}
                                        toggleFollow={this.toggleFollow}
                        />}
                    </ListItem>
                    <Divider/>
                    <ListItem>
                        <ListItemText primary={user.about} secondary={`Joined: ${user.createdAt}`}/>
                    </ListItem>
                </List>}
            </Paper>
        )
    }
}

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5,
        margin: "auto",
        [theme.breakpoints.up("sm")]: {
            width: 600
        }
    },
    title: {
        color: theme.palette.primary.main
    },
    progress: {
        margin: theme.spacing.unit * 2
    },
    progressContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 10
    }
})

Profile.getInitialProps = authInitialProps(true)

export default withStyles(styles)(Profile);
