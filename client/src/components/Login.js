import './CenteredForms.css';
import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup";

const Login = () => {

    function validationSchema() {

    }

    // Initialize react-hook-form methods
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onBlur"
    });

    function onSubmit() {

    }

    return (
        <div className="centeredForm">
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit())}>
                <div className="formField">
                    <label htmlFor="email">Email</label>
                    <input name="email" type="email" />
                </div>
                <div className="formField">
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;