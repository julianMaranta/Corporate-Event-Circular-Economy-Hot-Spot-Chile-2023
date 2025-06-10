import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import "./App.css";

const client = generateClient<Schema>();

export type IdentificationType = "RUT" | "DNI" | "PASSPORT";

export type Registration = {
  id: string;
  firstName: string;
  lastName: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  email: string;
  occupation: string;
  industryType: string;
  eventDate: string;
  eventTime: string;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
const [newRegistration, setNewRegistration] = useState({
  firstName: "",
  lastName: "",
  identificationNumber: "",
  identificationType: "RUT" as IdentificationType, // Explicitly type this
  email: "",
  occupation: "",
  industryType: "",
  eventDate: "",
  eventTime: ""
});
  const [isLoading, setIsLoading] = useState(true);

  // Available time slots
  const timeSlots = [
    "09:00", "10:30", "12:00", 
    "14:00", "15:30", "17:00"
  ];

  // Industry types
  const industryTypes = [
    "Manufacturing",
    "Retail",
    "Energy",
    "Construction",
    "Technology",
    "Agriculture",
    "Food & Beverage",
    "Transportation",
    "Other"
  ];

  // Load initial data
  useEffect(() => {
    const fetchRegistrations = async () => {
      setIsLoading(true);
      try {
        const { data } = await client.models.Registration.list();
        setRegistrations(data as Registration[]);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();

    const subscription = client.models.Registration.observeQuery().subscribe({
      next: ({ items }) => {
        setRegistrations(items as Registration[]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await client.models.Registration.create({
        ...newRegistration,
        eventDate: new Date(newRegistration.eventDate).toISOString()
      });
      
      // Reset form
      setNewRegistration({
        firstName: "",
        lastName: "",
        identificationNumber: "",
        identificationType: "RUT",
        email: "",
        occupation: "",
        industryType: "",
        eventDate: "",
        eventTime: ""
      });
      
      alert("Registration successful! Thank you for signing up.");
    } catch (error) {
      console.error("Error creating registration:", error);
      alert("There was an error processing your registration. Please try again.");
    }
  };

  const validateForm = () => {
    if (!newRegistration.firstName || !newRegistration.lastName) {
      alert("Please enter your full name");
      return false;
    }
    
    if (!newRegistration.identificationNumber) {
      alert("Please enter your identification number");
      return false;
    }
    
    if (!newRegistration.email.includes("@")) {
      alert("Please enter a valid email address");
      return false;
    }
    
    if (!newRegistration.eventDate || !newRegistration.eventTime) {
      alert("Please select a date and time for the event");
      return false;
    }
    
    return true;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;
    
    try {
      await client.models.Registration.delete({ id });
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("Error deleting registration");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Circular Economy Hot Spot Chile 2023</h1>
        <p className="app-subtitle">International Business Event Registration</p>
      </header>
      
      <div className="registration-form">
        <h2>Registration Form</h2>
        
        <div className="form-group">
          <label>First Name*</label>
          <input
            type="text"
            value={newRegistration.firstName}
            onChange={(e) => setNewRegistration({...newRegistration, firstName: e.target.value})}
            placeholder="Enter your first name"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Last Name*</label>
          <input
            type="text"
            value={newRegistration.lastName}
            onChange={(e) => setNewRegistration({...newRegistration, lastName: e.target.value})}
            placeholder="Enter your last name"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>ID Type*</label>
           <select
  value={newRegistration.identificationType}
  onChange={(e) => setNewRegistration({
    ...newRegistration, 
    identificationType: e.target.value as IdentificationType
  })}
>
  <option value="RUT">RUT (Chile)</option>
  <option value="DNI">DNI (Argentina)</option>
  <option value="PASSPORT">Passport</option>
</select>
          </div>
          
          <div className="form-group">
            <label>ID Number*</label>
            <input
              type="text"
              value={newRegistration.identificationNumber}
              onChange={(e) => setNewRegistration({...newRegistration, identificationNumber: e.target.value})}
              placeholder={
                newRegistration.identificationType === "RUT" ? "12345678-9" : 
                newRegistration.identificationType === "DNI" ? "12345678" : "Passport number"
              }
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            value={newRegistration.email}
            onChange={(e) => setNewRegistration({...newRegistration, email: e.target.value})}
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Occupation*</label>
          <input
            type="text"
            value={newRegistration.occupation}
            onChange={(e) => setNewRegistration({...newRegistration, occupation: e.target.value})}
            placeholder="Your current job position"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Industry Type*</label>
          <select
            value={newRegistration.industryType}
            onChange={(e) => setNewRegistration({...newRegistration, industryType: e.target.value})}
            required
          >
            <option value="">Select your industry</option>
            {industryTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Event Date*</label>
            <input
              type="date"
              value={newRegistration.eventDate}
              onChange={(e) => setNewRegistration({...newRegistration, eventDate: e.target.value})}
              min="2023-01-01"
              max="2023-12-31"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Time Slot*</label>
            <select
              value={newRegistration.eventTime}
              onChange={(e) => setNewRegistration({...newRegistration, eventTime: e.target.value})}
              required
            >
              <option value="">Select a time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button onClick={handleSubmit} className="submit-button">
          Register for Event
        </button>
      </div>

      <div className="registrations-list">
        <h2>Current Registrations</h2>
        
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="empty-state">
            <p>No registrations yet</p>
          </div>
        ) : (
          <table className="registrations-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Email</th>
                <th>Occupation</th>
                <th>Industry</th>
                <th>Event Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.id}>
                  <td>{reg.firstName} {reg.lastName}</td>
                  <td>{reg.identificationType}: {reg.identificationNumber}</td>
                  <td>{reg.email}</td>
                  <td>{reg.occupation}</td>
                  <td>{reg.industryType}</td>
                  <td>
                    {new Date(reg.eventDate).toLocaleDateString()} at {reg.eventTime}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDelete(reg.id)} 
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;