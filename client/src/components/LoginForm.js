import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  // State for form data
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  // State for form validation
  const [validated] = useState(false);
  // State to show/hide the error alert
  const [showAlert, setShowAlert] = useState(false);

  // useMutation hook for login
  const [login, { loading, error, data }] = useMutation(LOGIN_USER);

  // useEffect hook to update the showAlert state based on error
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  // Function to handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Call login mutation
      const { loading, error, data } = await login({
        variables: { ...userFormData },
      });

      if (loading) {
        return;
      }

      if (error) {
        console.error(error);
        setShowAlert(true); // Show alert for error
        return;
      }

      console.log(data);
      Auth.login(data.login.token); // Call login function from Auth utility

      setUserFormData({
        email: '',
        password: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Login Form */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
