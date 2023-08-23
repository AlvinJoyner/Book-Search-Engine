import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations'; // Import the necessary mutation
import Auth from '../utils/auth';

const SignupForm = () => {
  // Set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // Set state for form validation
  const [validated] = useState(false);
  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // Use the useMutation hook to get the addUser function and error object
  const [addUser, { error }] = useMutation(ADD_USER);

  // Use useEffect to handle errors and update the showAlert state
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check form validity
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Use the addUser mutation to register the user
      const response = await addUser({
        variables: { ...userFormData },
      });

      // Check response and handle errors
      if (!response.data.addUser) {
        throw new Error('Something went wrong!');
      }

      // Get token and user from the response
      const { token, user } = response.data.addUser;
      console.log(user);

      // Log the user in
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset form data
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        {/* Username input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Email input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Password input */}
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

        {/* Submit button */}
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
