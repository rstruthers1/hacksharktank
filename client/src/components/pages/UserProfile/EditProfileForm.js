import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Container, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useUpdateUserMutation} from "../../../apis/userApi";
import {toast} from "react-toastify";

const schema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    // Email is read-only, no validation needed
}).required();

const EditProfileForm = ({userData, onCancel, onSuccess}) => {
    const [updateUser, {
        isLoading: updateUserIsLoading,
        isSuccess: updateUserIsSuccess,
        isError: updateUserIsError,
        error: updateUserError
    }] = useUpdateUserMutation();

    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: userData,
        resolver: yupResolver(schema)
    });

    const onSubmit = async data => {
        console.log(data);
        const updatedUserData = {
            id: userData.id,
            firstName: data.firstName,
            lastName: data.lastName,
        }
        await updateUser(updatedUserData).unwrap()
            .then(() => {
                toast.success("Profile updated successfully");
                onSuccess()
            } )
            .catch((err) => {
                toast.error(`Error updating profile: ${err.message}`);
            });
    };

    return (
        <Container>
            <h2>Edit Profile</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" {...register("firstName")} isInvalid={!!errors.firstName}/>
                    <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" {...register("lastName")} isInvalid={!!errors.lastName}/>
                    <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" {...register("email")} disabled/>
                    <Form.Text className="text-mute" style={{ marginTop: '-5px' }}>
                        If you want to change your email address, please contact an admin.
                    </Form.Text>
                </Form.Group>

                <div className="mt-2">
                    <Button variant="primary" type="submit" className="me-2">
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Container>

    );
};

export default EditProfileForm;
