// SignupForm.js
import React from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import '../../common/CenteredForms.css';
import {useRegisterUserMutation} from "../../../apis/userApi";
import {NavLink} from "react-router-dom";

const SignupForm = () => {

    const [registerUser, { isLoading, isSuccess, isError, data, error }] = useRegisterUserMutation();
    // Define your validation schema using Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Email is invalid'),
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password confirmation is required')
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
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            roles: ['user']
        };
        await registerUser(userData);

    };

    return (
        <div className="centeredForm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Sign Up</h2>
                <div className="formField">
                    <label htmlFor="email">Email</label>
                    <input name="email" type="email" {...register('email')} />
                    <p className="error">{errors.email?.message}</p>
                </div>
                <div className="formField">
                    <label htmlFor="firstName">First Name</label>
                    <input name="firstName" type="text" {...register('firstName')} />
                    <p className="error">{errors.firstName?.message}</p>
                </div>
                <div className="formField">
                    <label htmlFor="lastName">Last Name</label>
                    <input name="lastName" type="text" {...register('lastName')} />
                    <p className="error">{errors.lastName?.message}</p>
                </div>
                <div className="formField">
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" {...register('password')} />
                    <p className="error">{errors.password?.message}</p>
                </div>
                <div className="formField">
                    <label htmlFor="passwordConfirmation">Confirm Password</label>
                    <input name="passwordConfirmation" type="password" {...register('passwordConfirmation')} />
                    <p className="error">{errors.passwordConfirmation?.message}</p>
                </div>
                <button type="submit">Sign Up</button>
                {isLoading && <p>Registering user...</p>}
                {isSuccess && <div><p>User registered successfully!</p>
                   <NavLink to="/login">Login</NavLink>
                </div>}
                {isError && <p>Error registering user: {error.data?.message || 'Unknown error'}</p>}

            </form>
        </div>
    );
};

export default SignupForm;
