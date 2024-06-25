import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Container, Grid } from '@mui/material';
import { useUser } from "@clerk/clerk-react";

const RecordForm = () => {
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const { user } = useUser();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newRecord = {
      userId: user?.id ?? "",
      date: new Date(),
      description: description,
      amount: parseFloat(amount),
      category: category,
      paymentMethod: paymentMethod,
    };

    // addRecord(newRecord);
    setDescription("");
    setAmount("");
    setCategory("");
    setPaymentMethod("");
  };

  return (
    <Container maxWidth="sm">
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
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth required>
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
            <FormControl variant="outlined" fullWidth required>
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