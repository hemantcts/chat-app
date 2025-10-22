import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AddUsers = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([])

  const fetchCompanies = async () => {
    try {
      const res = await fetch('https://chat.quanteqsolutions.com/api/admin/companies', {
        headers: {
          'Authorization': localStorage.getItem('token'),
        },
      });
      const data = await res.json();

      console.log('comany', data.companies)

      if (data.status) {
        setCompanies(data.companies || []);
      } else {
        toast.error(data.message || 'Error!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching users');
    }
  };

  useEffect(() => {
    fetchCompanies()
  }, [])


  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    companyCode: '',
    department: '',
    password: '',
    groupCreateAccess: false,
    oneOnOneAccess: false,
    appAccess: false,
    deleteMessageAccess: false,
    active: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Creating user:', user);
    try {
      const response = await fetch('https://chat.quanteqsolutions.com/api/auth/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      console.log(data);
      if (data.status) {
        toast.success(data.message || 'User created successfully');
        // Optionally reset form
        setUser({
          name: '',
          email: '',
          username: '',
          companyCode: '',
          department: '',
          password: '',
          groupCreateAccess: false,
          oneOnOneAccess: false,
          appAccess: false,
          deleteMessageAccess: false,
          active: false
        });
        // Optional redirect:
        // navigate('/dashboard/users');
      } else {
        toast.error(data.message || 'Error creating user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error creating user');
    }
  };

  return (
    <div className="nk-chat-body profile-shown pe-0">
      <div className="nk-chat-head add-user-form">
        <Form className="w-100" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </Form.Group> */}



          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="department"
              value={user.department}
              onChange={handleChange}
              style={{ color: user.department && '#000' }}
              required
            >
              <option value="">Select Department</option>
              <option value="Operations Team">Operations Team</option>
              <option value="Accounts Team">Accounts Team</option>
              <option value="Quality Team">Quality Team</option>
              <option value="Contractor Management">Contractor Management</option>
              <option value="Contractor">Contractor</option>
              <option value="Driver">Driver</option>
              <option value="Jockey">Jockey</option>
            </Form.Control>
          </Form.Group>


          {["Contractor Management", "Contractor", "Driver", "Jockey"].includes(user.department) && (
            <Form.Group className="mb-3">
              <Form.Control
                as="select"
                name="companyCode"
                value={user.companyCode}
                onChange={handleChange}
                style={{ color: user.companyCode && '#000' }}
                required
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company?.companyCode}>
                    {company?.companyName} ({company?.companyCode})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Check
              id="groupCreateAccess"
              type="checkbox"
              label="Group Create Access"
              name="groupCreateAccess"
              checked={user.groupCreateAccess}
              onChange={handleChange}
            />
            <Form.Check
              id="oneOnOneAccess"
              type="checkbox"
              label="One-on-One Access"
              name="oneOnOneAccess"
              checked={user.oneOnOneAccess}
              onChange={handleChange}
            />
            <Form.Check
              id="appAccess"
              type="checkbox"
              label="App Access"
              name="appAccess"
              checked={user.appAccess}
              onChange={handleChange}
            />
            <Form.Check
              id="deleteMessageAccess"
              type="checkbox"
              label="Delete Message Access"
              name="deleteMessageAccess"
              checked={user.deleteMessageAccess}
              onChange={handleChange}
            />
            <Form.Check
              id="active"
              type="checkbox"
              label="Active"
              name="active"
              checked={user.active}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit">Add User</Button>
        </Form>
      </div>
    </div>
  );
};

export default AddUsers;
