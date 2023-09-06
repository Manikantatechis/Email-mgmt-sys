import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { EditOutlined } from '@ant-design/icons';

const UserList = () => {
  const users = [
    { id: 1, username: 'JohnDoe', role: 'admin', status: 'Active', email: 'john@example.com' },
    { id: 2, username: 'JaneDoe', role: 'user', status: 'Inactive', email: 'jane@example.com' },
    { id: 3, username: 'RandomUser', role: 'guest', status: 'Pending', email: 'random@example.com' }
  ];

  return (
    <Container>
      <Paper elevation={3} style={{ borderRadius: '15px', minHeight: '70vh' }}>
        <Typography variant="h6" component="div" style={{ padding: '16px', textAlign: 'center' }}>
          User List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" startIcon={<EditOutlined />}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      role: PropTypes.string,
      status: PropTypes.string,
      email: PropTypes.string
    })
  )
};

export default UserList;
