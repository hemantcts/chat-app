import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ManageUsers from './ManageUsers';
import GroupChat from './GroupChat';
import Settings from './Settings';
import { Container, Row, Col } from 'react-bootstrap';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <ManageUsers />;
      case 'chat':
        return <GroupChat />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-0">
      <Row noGutters>
        <Col xs={12} md={3} lg={2}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </Col>
        <Col xs={12} md={9} lg={10} className="p-3">
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
