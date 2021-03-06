import React from 'react'
import Link from 'next/link'
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import withStyles from "@material-ui/core/styles/withStyles";
import {signupUser} from "../lib/auth";

const Transition = (props) => (
    <Slide {...props} direction='up'/>
)

class Signup extends React.Component {
    state = {
        email: '',
        name: '',
        password: '',
        openError: false,
        error: null,
        openSuccess: false,
        createdUser: null,
        isLoading: false
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async e => {
        e.preventDefault()
        try {
            const {name, email, password} = this.state
            this.setState({
                isLoading: true,
                error: null
            })
            const user = {
                name,
                email,
                password
            }
            const data = await signupUser(user)
            this.setState({
                createdUser: data.name,
                openSuccess: true
            })

        } catch (e) {
            this.setState({
                openError: true,
                error: e.response ? e.response.data : e.message
            })
        } finally {
            this.setState({
                isLoading: false
            })
        }
    }

    render() {
        const {classes} = this.props
        const {error, openError, openSuccess, createdUser, isLoading} = this.state
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Gavel/>
                    </Avatar>
                    <Typography variant='h5' component='h1'>
                        Sign up
                    </Typography>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                        <FormControl margin='normal' required fullWidth>
                            <InputLabel htmlFor='name'>Name</InputLabel>
                            <Input name='name' type='text' onChange={this.handleChange}/>
                        </FormControl>
                        <FormControl margin='normal' required fullWidth>
                            <InputLabel htmlFor='email'>Email</InputLabel>
                            <Input name='email' type='text' onChange={this.handleChange}/>
                        </FormControl>
                        <FormControl margin='normal' required fullWidth>
                            <InputLabel htmlFor='password'>Password</InputLabel>
                            <Input name='password' type='password' onChange={this.handleChange}/>
                        </FormControl>
                        <Button type='submit' fullWidth variant='contained' color='primary' disabled={isLoading}>
                            {isLoading ? 'Signing up ...' : 'Sign up'}
                        </Button>
                    </form>
                    {error ? <Snackbar anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }} open={openError}
                                       onClose={() => this.setState({
                                           openError: false
                                       })}
                                       autoHideDuration={2000}
                                       message={<span className={classes.snack}>{error}</span>}
                    /> : null}
                    <Dialog open={openSuccess}
                            disableBackdropClick={true}
                            transitioncomponent={Transition}
                    >
                        <DialogTitle>
                            <VerifiedUserTwoTone className={classes.icon}/>
                            New Account
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                User {createdUser} successfully created!
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color='primary' variant='contained'>
                                <Link href='/signin'>
                                    <a className={classes.signinLink}>Sign in</a>
                                </Link>
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        width: "auto",
        display: "block",
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up("md")]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing.unit * 2
    },
    signinLink: {
        textDecoration: "none",
        color: "white"
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%",
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 2
    },
    snack: {
        color: theme.palette.secondary.light
    },
    icon: {
        padding: "0px 2px 2px 0px",
        verticalAlign: "middle",
        color: "green"
    }
});

export default withStyles(styles)(Signup);
