import React, { useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';
import { useLoadingContext } from '../context/LoadingContext.tsx';


const url  = import.meta.env.VITE_URL;



const RecordForm = () => {
  const { loading, setLoading } = useLoadingContext();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const historicalData: string[] = [];


  const { user } = useUser();

  const handleSubmit = async (event: React.FormEvent) => {

    setLoading(true);
    console.log(loading);
    console.log(user, typeof(user));
    event.preventDefault();

    let risk;
    const newRecord = {
      userId: user?.fullName ?? "",
      date: new Date().toLocaleString(),
      description: description,
      account: account,
      amount: parseInt(amount),
      category: category,
      paymentMethod: paymentMethod,
      historicalRecords: historicalData,
    };
    

    
    try {
      risk = await axios.post(`${url}/findRisk`, newRecord);
      console.log(risk.data);
    } catch (err) {
      console.error(err);
    }
    
    const updatedRecord = {
      userId: user?.fullName ?? "",
      date: new Date().toLocaleString(),
      description: description,
      account: account,
      amount: parseInt(amount),
      category: category,
      paymentMethod: paymentMethod,
      risk:risk,

    };
    try {
      const response = await axios.post(`${url}/postRecords`, updatedRecord);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
   

    setDescription("");
    setAmount("");
    setAccount("");
    setCategory("");
    setPaymentMethod("");
    setTimeout(() => setLoading(false), 1000);    
  };

  return (
    <Container sx={{marginBottom:3, marginTop:4, width:"72vw"}}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              required
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Account"
              type="number"
              variant="outlined"
              required
              fullWidth
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              inputProps={{ min: 0 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Amount"
              type="number"
              variant="outlined"
              required
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ min: 0 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth required size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value=""><em>Select a Category</em></MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Rent">Rent</MenuItem>
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth required size="small">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Payment Method"
              >
                <MenuItem value=""><em>Select a Payment Method</em></MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Record
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RecordForm;