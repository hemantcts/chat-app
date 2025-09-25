import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCompany = () => {
  const [company, setCompany] = useState({
    companyName: '',
    companyCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Adding company:', company);

    try {
      const response = await fetch('https://chat.quanteqsolutions.com/api/admin/add_companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(company),
      });

      const data = await response.json();
      console.log(data);

      if (data.status) {
        toast.success(data.message || 'Company added successfully');
        // Reset form
        setCompany({
          companyName: '',
          companyCode: '',
        });
      } else {
        toast.error(data.message || 'Error adding company');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error adding company');
    }
  };

  return (
    <div className="nk-chat-body profile-shown pe-0">
      <div className="nk-chat-head add-company-form">
        <Form className="w-100" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={company.companyName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="companyCode"
              placeholder="Company Code"
              value={company.companyCode}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit">Add Company</Button>
        </Form>
      </div>
    </div>
  );
};

export default AddCompany;
