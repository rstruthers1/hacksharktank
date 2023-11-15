import './CenteredForms.css';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, {useEffect} from "react";
import {useLoginUserMutation} from "../apiService";
import {useNavigate} from "react-router-dom";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const [loginUser, {isLoading, isSuccess, isError, data, error}] = useLoginUserMutation();

    const navigate = useNavigate();
    // Define your validation schema using Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Email is invalid'),
        password: Yup.string()
            .required('Password is required')
    });

    // Initialize react-hook-form methods
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onBlur"
    });

    const onSubmit = async data => {

        // Handle your form submission here
        const userData = {
            email: data.email,
            password: data.password
        };
        await loginUser(userData);
    }

    useEffect(() => {
        if (isSuccess) {
            if (data?.token) {
                console.log(`data: ${JSON.stringify(data)}`);
                localStorage.setItem('user', data.token);
                navigate("/"); // Redirect to home page
            } else {


                console.error(`Invalid token: ${data?.token}`)
                toast.error('Login token is invalid or empty', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            console.error(`Error logging in: ${JSON.stringify(error)}`);
            toast.error(`Error logging in: ${error.data?.message || 'Unknown error'}`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    }, [isError]);


    return (
        <div className="centeredForm">
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formField">
                    <label htmlFor="email">Email</label>
                    <input name="email" type="email" {...register('email')}/>
                    <p className="error">{errors.email?.message}</p>
                </div>
                <div className="formField">
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" {...register('password')}/>
                    <p className="error">{errors.password?.message}</p>
                </div>
                <button type="submit">Login</button>
            </form>
            {isLoading && <p>Logging you in...</p>}
        </div>
    )
}

export default Login;