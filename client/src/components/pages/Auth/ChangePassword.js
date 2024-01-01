import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Form, Button } from 'react-bootstrap';
import { useChangePasswordMutation } from '../../../apis/userApi';
import {getLoggedInUser} from "../../../utils/authUtils";
import {toast} from "react-toastify";

// Yup schema for validation
const schema = yup.object({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup.string().required('New password is required').min(8, 'Password must be at least 8 characters long')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmNewPassword: yup.string()
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm new password is required'),
}).required();

const ChangePassword = () => {
  const [changePassword, { isLoading, isSuccess, isError, data, error }] = useChangePasswordMutation();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async formData => {
    const userId = getLoggedInUser()?.id;
    const userData = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      id: userId
    };
    await changePassword(userData).unwrap()
        .then(() => {
          toast.success("Password changed successfully");
        } )
        .catch((err) => {
          toast.error(`Error changing password: ${err.message}`);
        });
  };

  return (
      <Container>
        <h2>Change Password</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="oldPassword">
            <Form.Label>Old Password</Form.Label>
            <Controller
                name="oldPassword"
                control={control}
                render={({ field }) => <Form.Control type="password" isInvalid={!!errors.oldPassword} {...field} />}
            />
            <Form.Control.Feedback type="invalid">
              {errors.oldPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Controller
                name="newPassword"
                control={control}
                render={({ field }) => <Form.Control type="password" isInvalid={!!errors.newPassword} {...field} />}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="confirmNewPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Controller
                name="confirmNewPassword"
                control={control}
                render={({ field }) => <Form.Control type="password" isInvalid={!!errors.confirmNewPassword} {...field} />}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmNewPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Change Password
          </Button>
        </Form>
      </Container>
  );
};

export default ChangePassword;
