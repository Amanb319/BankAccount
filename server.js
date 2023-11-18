const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());


const port = 3000;


let accounts = [];

// Add Account
app.post('/accounts', (req, res) => {
  try {
    const { accountNumber, balance } = req.body || {};
    const newAccount = { accountNumber, balance };
    accounts.push(newAccount);
    res.send(`Account ${accountNumber} added successfully.`);
  } catch (error) {
    res.status(400).send('Invalid JSON data received');
  }
});


// Delete Account
app.delete('/accounts/:accountNumber', (req, res) => {
  const accountNumber = req.params.accountNumber;
  accounts = accounts.filter(account => account.accountNumber !== accountNumber);
  res.send('Account deleted successfully');
});



// Send Money
app.post('/transactions', (req, res) => {
  const { senderAccountNumber, receiverAccountNumber, amount } = req.body;

  const senderAccount = accounts.find(acc => acc.accountNumber === senderAccountNumber);
  const receiverAccount = accounts.find(acc => acc.accountNumber === receiverAccountNumber);

  if (senderAccount && receiverAccount && senderAccount.balance >= amount) {
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;
    res.send('Money sent successfully');
  } else {
    res.status(400).send('Invalid transaction');
  }
});

// View All Accounts
app.get('/accounts', (req, res) => {
  res.json(accounts);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Bank Server');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
