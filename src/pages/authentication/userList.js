import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from 'store/auth/authThunks';
import { selectUserList } from 'store/auth/authSlice';

const UserList = () => {
  const users = useSelector(selectUserList)
const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(listUsers())
  },[dispatch])

  return (
    <Container>
      <Paper elevation={3} style={{ borderRadius: '15px', height: '70vh', overflowY:"scroll" }}>
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
            {users && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name + " " + user.last_name}</TableCell>
                <TableCell>{user.role || "user"}</TableCell>
                <TableCell>{user.status || "Active"}</TableCell>
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
