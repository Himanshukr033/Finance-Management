import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import { useLoadingContext } from '../context/LoadingContext.tsx';
import { useUser } from '@clerk/clerk-react';
const url  = import.meta.env.VITE_URL;

const RecordList = ({ name }) => {
  const { loading, setLoading } = useLoadingContext();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [editedRecord, setEditedRecord] = useState({});
  const { user } = useUser();

  const id = user?.fullName??"";


  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      try {
        const response = await axios.post(`${url}/getRecords`, { userId: id });
        setRecords(response.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, loading, setLoading]);

  const handleEdit = (index, record) => {
    setEditableRowIndex(index);
    setEditedRecord({ ...record });
  };

  const handleSave = async () => {
    setLoading(true);
    let newRisk;
    try {
      newRisk = await axios.post(`${url}/findRisk`, editedRecord);
      editedRecord.risk = newRisk;
      console.log(editedRecord.risk);
      console.log(newRisk);
    } catch (err) {
      console.error(err);
    }

    try {
      // Update record via API call
      await axios.put(`${url}/updateRecords`, editedRecord);
      console.log(editedRecord);
      
      // Update local records state
      const updatedRecords = [...records];
      updatedRecords[editableRowIndex] = editedRecord;
      setRecords(updatedRecords);
      
      // Reset editable state
      setEditableRowIndex(null);
      setEditedRecord({});
    } catch (error) {
      console.error('Error updating record:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    // Reset editable state
    setEditableRowIndex(null);
    setEditedRecord({});
  };

  const handleDelete = async (recordId, date) => {
    setLoading(true);
    try {
      // Delete record via API call
      const data = { userId: recordId, date: date };
      await axios.post(`${url}/deleteRecords`, data);
      
      // Update local records state after deletion
      setRecords(records.filter(record => record.userId !== recordId || record.date !== date));
    } catch (error) {
      console.error('Error deleting record:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handleInputChange = (e, field) => {
    setEditedRecord({
      ...editedRecord,
      [field]: e.target.value
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>;
  }

  return (
    <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
      <TableContainer component={Paper} sx={{width:"70vw", margin:'auto'}}>
        <Table stickyHeader aria-label="sticky table" sx={{bgcolor:'whitesmoke'}}>
          <TableHead sx={{bgcolor:'black'}}>
            <TableRow >
              <TableCell sx={{bgcolor:"black", color:'white', border:'1px solid whitesmoke'}}>Description</TableCell>
              <TableCell sx={{bgcolor:"black", color:'white', border:'1px solid whitesmoke'}}>Amount</TableCell>
              <TableCell sx={{bgcolor:"black", color:'white', border:'1px solid whitesmoke'}}>Category</TableCell>
              <TableCell sx={{bgcolor:"black", color:'white', border:'1px solid whitesmoke'}}>Payment Method</TableCell>
              <TableCell sx={{bgcolor:"black", color:'white', border:'1px solid whitesmoke'}}>Date</TableCell>
              <TableCell sx={{bgcolor:"black", color:'white', border:'1px solid whitesmoke'}}>Risk</TableCell>
              <TableCell sx={{bgcolor:"black", color:'white', border:'1px solid whitesmoke'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={record.date}>
                <TableCell>
                  {editableRowIndex === index ? (
                    <TextField
                      value={editedRecord.description || ''}
                      onChange={(e) => handleInputChange(e, 'description')}
                    />
                  ) : (
                    record.description
                  )}
                </TableCell>
                <TableCell>
                  {editableRowIndex === index ? (
                    <TextField
                      type="number"
                      value={editedRecord.amount || ''}
                      onChange={(e) => handleInputChange(e, 'amount')}
                    />
                  ) : (
                    record.amount
                  )}
                </TableCell>
                <TableCell>
                  {editableRowIndex === index ? (
                    <Select
                      value={editedRecord.category || ''}
                      onChange={(e) => handleInputChange(e, 'category')}
                    >
                      <MenuItem value="Food">Food</MenuItem>
                      <MenuItem value="Rent">Rent</MenuItem>
                      <MenuItem value="Salary">Salary</MenuItem>
                      <MenuItem value="Utilities">Utilities</MenuItem>
                      <MenuItem value="Entertainment">Entertainment</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  ) : (
                    record.category
                  )}
                </TableCell>
                <TableCell>
                  {editableRowIndex === index ? (
                    <Select
                      value={editedRecord.paymentMethod || ''}
                      onChange={(e) => handleInputChange(e, 'paymentMethod')}
                    >
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </Select>
                  ) : (
                    record.paymentMethod
                  )}
                </TableCell>
                <TableCell>
                  {record.date}
                </TableCell>
                <TableCell>
                  {editableRowIndex === index ? (
                    <TextField
                      value={editedRecord.risk || ''}
                      onChange={(e) => handleInputChange(e, 'risk')}
                    />
                  ) : (
                    record.risk
                  )}
                </TableCell>
                <TableCell>
                  {editableRowIndex === index ? (
                    <>
                      <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outlined" color="primary" onClick={() => handleEdit(index, record)}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => handleDelete(record.userId, record.date)}>
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RecordList;
