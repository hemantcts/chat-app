import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const ManageUsers = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    department: '',
    password: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call API to save user
    console.log('Creating user:', user);
    const response = await fetch('https://chat.quanteqsolutions.com/api/auth/addUser',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    })
    const data = await response.json();
    console.log(data);

    alert(data.message);
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4>Add New User</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Control name="department" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} required />
        </Form.Group>
        <Button type="submit">Add User</Button>
      </Form>
    </Card>
  );
};

export default ManageUsers;
