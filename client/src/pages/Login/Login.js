import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogin, reset } from '../../features/Auth/AuthSlice';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import styles from "./Login.module.css";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // destructure the states
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    )

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const {email, password} = formData;

    const [formError, setFormError] = useState({
        input_email: '',
        input_password: ''
    });    
    const {input_email, input_password} = formError;

    useEffect(() => {
        if(isSuccess || user){
          navigate('/')
        }
    
        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])
    
    const formInputHandler = (event) => {
        setFormData((prevState) => ({
            ...prevState, 
            [event.target.name]: event.target.value,
        }));

        setFormError({            
            input_email: '',
            input_password: ''
        })
    }

    const formValidateHandler = (event) => {
        let {name, value} = event.target;
        console.log("hi", event.name)
        setFormError(prev => {
            const formInput = {...prev, [name]: ""};

            console.log(formInput)

            switch(name){
                case "email" :
                    if(!value || value.trim() === '') {
                        formInput[name] = "Please enter an email address";
                    }else{
                        console.log(value)                        
                    }
                    break;

                case "password" :
                    if(!value) {
                        formInput[name] = "Please enter password";
                    }else if(value.length < 6){
                        formInput[name] = "Password must be 6 characters or more";
                    } else {
                        console.log(value)
                    }
                    break;

                default:
                    break;
            }

            return formInput;
        });
    }

    const loginFormHandler = (event) => {
        event.preventDefault();

        if(email.trim() === '' || password.length === 0){ 
            setFormError({   
                email: 'Please enter an email address',   
                password: 'Please enter password'
            })
        }else{
            console.log("valid")
            if(password.length < 6){
                setFormError({  
                    password: 'Password must be 6 characters or more'
                })
            }else{
                const userData = {
                    email,
                    password
                }
                dispatch(userLogin(userData))
            } 
        }
    }

    return (
        <Grid container sx={{height: '100vh', alignItems: 'center'}} className={styles.grid_wrap}>
            <Grid item xs={0} md={8} lg={8} className={styles.login_bg} sx={{height: '100%'}}></Grid>
            <Grid item xs={12} sm={7} md={4} lg={4} sx={{px: 4}}>
                <Box sx={{mb: 3, textAlign: 'center'}}>
                    <Typography sx={{textAlign: 'center', fontWeight: 'bold', fontSize: '48px'}}>rOne</Typography>
                    <Typography>Sign in to access your account</Typography>
                </Box>
                <form sx={{width: 1}} onSubmit={loginFormHandler}>
                    <Box sx={{mb:2}}>
                        <Typography>Email</Typography>
                        <TextField 
                            id="email" 
                            name="email"
                            type="email" 
                            onChange={formInputHandler}
                            onBlur={formValidateHandler}
                            value={email}
                            placeholder="Enter email"
                            sx={{width:1}}
                            className={styles.user_input}
                            />
                        {formError.email && <Typography variant="subtitle1" sx={{ color: "red", fontWeight: 'medium', fontSize: '0.9rem' }}>{formError.email}</Typography>}
                    </Box>
                    <Box>
                        <Typography>Password</Typography>
                        <TextField
                            id="password" 
                            name="password"
                            type="password" 
                            onChange={formInputHandler}
                            onBlur={formValidateHandler}
                            value={password}
                            placeholder="******"
                            sx={{width:1}}
                            className={styles.user_input}
                            />
                        {formError.password && <Typography variant="subtitle1" sx={{ color: "red", fontWeight: 'medium', fontSize: '0.9rem' }}>{formError.password}</Typography>}
                    </Box>
                    <Box>
                        <Button variant="contained" sx={{p:1, borderRadius: '25px', width: 1, mt: 3, bgcolor: '#0e69d6', boxShadow: 0}} type="submit">
                            Sign In
                        </Button>
                    </Box>
                </form>
                <Box sx={{ borderTop: 1, mt: 4, mb: 4, borderColor: '#dedede' }}>
                    <Button variant="outlined" sx={{ mt: 4, mb: 2, p:1, width: 1, borderRadius: '25px', border: 1, borderColor: '#dedede' }}>
                        Sign In with Google
                    </Button>
                    <Link to="/register">
                        <Button variant="outlined" sx={{p:1, width: 1, borderRadius: '25px', border: 2, borderColor: '#dedede'}} className={styles.button_wrap}>New to rOne? Join now</Button>
                    </Link>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Login