import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Container, Paper, Table, 
  TableBody, TableCell, TableHead, TableRow,
  Typography, Select, MenuItem, Grid, OutlinedInput
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from 'store/auth/authThunks';
import { selectIsLoading, selectUserList } from 'store/auth/authSlice';
import Loader from 'components/Loader';
import { handleRequest } from 'services/Api';

const StyledPaper = styled(Paper)({
  borderRadius: '15px',
  height: '70vh',
  overflowY: 'scroll',
});

const StyledTableCell = styled(TableCell)({
  width: '20%', // Adjust this based on your needs
});

const StyledTableCellEmail = styled(TableCell)({
  width: '30%', // Adjust this based on your needs
});

const UserList = () => {
  const users = useSelector(selectUserList);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  return (
    <Container>
      <StyledPaper elevation={3}>
        <Typography variant="h6" component="div" style={{ padding: '16px', textAlign: 'center' }}>
          User List
        </Typography>
        <Container style={{ width: '100%', padding: 0 }}>{isLoading && <Loader />}</Container>
        <Table sx={{ minWidth: '900px', overflowY: 'scroll' }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map((user) => <UserListMap user={user} role={role} key={user.id} />)}
          </TableBody>
        </Table>
      </StyledPaper>
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

const UserListMap = ({ user, role }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(user);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditUser(prevEditUser => ({ ...prevEditUser, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await handleRequest("put", `/api/users/update/${user._id}`, editUser);
      if (res) setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TableRow>
      <StyledTableCell>{user.first_name + ' ' + user.last_name}</StyledTableCell>
      <StyledTableCell>
        {(role === 'manager' || role === 'director') && isEditing ? (
          <Select value={editUser.role} name="role" onChange={(e)=>handleChange(e)} style={{ minWidth: 60 }}>
            <MenuItem value="director">Director</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="engineer">Engineer</MenuItem>
          </Select>
        ) : (
          editUser.role || 'user'
        )}
      </StyledTableCell>

      <StyledTableCell sx={{width:"10%"}}>
        {isEditing ? (
          <Select value={editUser.status || "active"} name="status" onChange={(e) => handleChange(e)}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        ) : (
          user.status || 'Active'
        )}
      </StyledTableCell>
      <StyledTableCellEmail sx={{ display: 'flex', alignItems: 'center', gap: 3, height: '70px', width:"100%" }}>
        {user.email}
        {isEditing && (
          <>
            <Grid item xs={12}>
              <OutlinedInput
                sx={{ width: '100px' }}
                id="password"
                name="password"
                placeholder="password"

                onChange={(e)=>handleChange(e)}

              />
            </Grid>
          </>
        )}{' '}
      </StyledTableCellEmail>

      <StyledTableCell>
        {isEditing ? (
          <>
            <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </StyledTableCell>
    </TableRow>
  );
};

export default UserList;
