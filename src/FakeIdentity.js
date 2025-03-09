import React, { useState, useEffect } from "react";
import supabase from "./supabaseClient";

// This component handles displaying and creating identities
function FakeIdentity() {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch identities on component mount
    fetchIdentities();
  }, []);
  
  async function fetchIdentities() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("identities")
        .select("*");
        
      if (error) {
        console.error("Error fetching identities:", error);
      } else {
        setIdentities(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleCreateIdentity() {
    setLoading(true);
    try {
      // Create a random name
      const firstNames = ["John", "Jane", "Michael", "Emma", "Robert", "Sarah"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Davis"];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Create a random email
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
      
      // Create a random phone number
      const phone = `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      const newIdentity = {
        name: `${firstName} ${lastName}`,
        email,
        phone
      };
      
      const { data, error } = await supabase
        .from("identities")
        .insert([newIdentity])
        .select();
        
      if (error) {
        console.error("Error creating identity:", error);
      } else if (data) {
        setIdentities([...identities, ...data]);
      }
    } catch (err) {
      console.error("Error creating identity:", err);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <h2>Fake Identity Generator</h2>
      <button 
        onClick={handleCreateIdentity}
        disabled={loading}
      >
        {loading ? "Loading..." : "Create Identity"}
      </button>
      
      <ul>
        {identities.map((identity, index) => (
          <li key={identity.id || index}>
            {identity.name} - {identity.email} - {identity.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FakeIdentity;