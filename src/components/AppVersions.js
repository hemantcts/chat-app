import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const AppVersions = ({ platform, newVersionSubmitted }) => {
  // Initial versions data (replace with API later)
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getVersions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://chat.quanteqsolutions.com/api/admin/versions', {
        headers: {
          'Authorization': localStorage.getItem('token'),
        },
      })
      const data = await response.json();

      console.log('data', data);

      // if(data.status){
      //   setVersions(data.data)
      // }

      if (data.status && Array.isArray(data.data)) {
        // Sort by createdAt descending (latest first)
        const sorted = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setVersions(sorted);
      }
    }
    catch (error) {
      console.error('Error fetching versions:', error);
    }
    finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    getVersions()
  }, [newVersionSubmitted])

  return (
    <div className="">
      {/* <h3 className="mb-4">📱 App Versions Management</h3> */}

      {/* Versions List */}
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Platform</th>
              <th>Version</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                </tr>
              ))
            ) : (
              versions.filter((v) => v.platform === platform).map((v, index) => (
                <tr key={v.id}>
                  <td>{index + 1}</td>
                  <td>{v.platform}</td>
                  <td>
                    {v.version} {index === 0 && " (latest)"}
                  </td>
                  <td>{new Date(v.createdAt).toLocaleDateString('en-GB')}</td>
                </tr>
              )))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AppVersions;
