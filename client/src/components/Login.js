import './CenteredForms.css';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React from "react";

const Login = () => {

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

    const onSubmit = data => {
        console.log(`data: ${JSON.stringify(data)}`);
    }

    return (
        <div className="centeredForm">
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit())}>
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
        </div>
    )
}

export default Login;