const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//creating database
const db = {
  customers: [],
  getNextCustomerId: () => db.customers.length + 1,
  addCustomer: (customer) => {
    const newCustomer = { customerId: db.getNextCustomerId(), ...customer };
    db.customers.push(newCustomer);
    return newCustomer;
  },
  isDuplicateCustomer: (email, cardNumber) => {
    return db.customers.some(
      (customer) =>
        customer.email === email || customer.cardNumber === cardNumber
    );
  },
  getCustomerById: (customerId) => {
    return db.customers.find((customer) => customer.customerId === customerId);
  },
  updateCustomer: (customerId, updatedData) => {
    const customerIndex = db.customers.findIndex(
      (customer) => customer.customerId === customerId
    );
    if (customerIndex !== -1) {
      db.customers[customerIndex] = {
        ...db.customers[customerIndex],
        ...updatedData,
      };
      return true;
    }
    return false;
  },
  deleteCustomer: (customerId) => {
    const customerIndex = db.customers.findIndex(
      (customer) => customer.customerId === customerId
    );
    if (customerIndex !== -1) {
      db.customers.splice(customerIndex, 1);
      return true;
    }
    return false;
  },
};

app.use(cors());
app.use(bodyParser.json());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({ message: "Invalid JSON data" });
  }
  next();
});

// posting
app.post("/api/register", (req, res) => {
  try {
    const customerData = req.body;

    // Validate email and credit card number.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const creditCardRegex = /^\d{12}$/;

    if (!emailRegex.test(customerData.email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (!creditCardRegex.test(customerData.cardNumber)) {
      return res.status(400).json({ message: "Invalid credit card number" });
    }

    // Check invalid email and card number
    const isDuplicate = db.isDuplicateCustomer(
      customerData.email,
      customerData.cardNumber
    );

    if (isDuplicate) {
      return res.status(400).json({ message: "Can't add duplicate values" });
    }

    // duplicate
    const newCustomer = db.addCustomer(customerData);

    if (newCustomer) {
      return res.status(201).json({
        message: `Customer ${customerData.name} has registered`,
        customerid: newCustomer.customerId,
      });
    } else {
      // Handling errors
      return res
        .status(400)
        .json({ message: "Error registering the customer" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//update(put)
app.put("/api/customers/:customer_id", (req, res) => {
  try {
    const customerId = parseInt(req.params.customer_id);
    const updatedData = req.body;

    if (!updatedData) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const customer = db.getCustomerById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const success = db.updateCustomer(customerId, updatedData);

    if (success) {
      return res.status(200).json({ message: "Customer updated successfully" });
    } else {
      return res.status(500).json({ message: "Error updating the customer" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get
app.get("/api/customers/:customer_id", (req, res) => {
  try {
    const customerId = parseInt(req.params.customer_id);
    const customer = db.getCustomerById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({
      id: customer.customerId,
      name: customer.name,
      address: customer.address,
      email: customer.email,
      gender: customer.gender,
      age: customer.age,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//delete
app.delete("/api/customers/:customer_id", (req, res) => {
  try {
    const customerId = parseInt(req.params.customer_id);
    const success = db.deleteCustomer(customerId);

    if (success) {
      return res.status(200).json({ message: "Customer deleted successfully" });
    } else {
      return res.status(500).json({ message: "Error deleting the customer" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server on port 8080.
app.listen(8080, () => {
  console.log("created successfully");
  console.log("Server is running  successfully");
});
