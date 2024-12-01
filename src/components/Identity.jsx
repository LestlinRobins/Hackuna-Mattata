import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  IconButton,
  Snackbar,
  Avatar,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { supabase } from "../supabase";

/**
 * FakeIdentity Component
 *
 * A standalone component for generating and displaying fake identities with avatars.
 * Features:
 * - Generate random identities with name, email, phone number, and avatar
 * - Store identities in Supabase
 * - Optional: Make phone calls via Twilio API (requires backend)
 *
 * @param {Object} props - Component props
 * @param {function} props.onBack - Function to handle back navigation
 * @param {function} props.onConfirm - Function to handle confirmation
 * @param {string} props.apiUrl - Optional API URL for Twilio integration
 */
const FakeIdentity = ({ onBack, onConfirm, apiUrl }) => {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    // Fetch identities on component mount
    fetchIdentities();
  }, []);

  async function fetchIdentities() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("identities").select("*");

      if (error) {
        console.error("Error fetching identities:", error);
        showAlert(`Error fetching identities: ${error.message}, "error"`);
      } else {
        setIdentities(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Generate a random avatar URL using one of several public avatar services
  function generateAvatarUrl(name) {
    const services = [
      // DiceBear Avatars - Simple avatars
      `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
        name
      )}.svg`,
      // DiceBear Bottts - Robot avatars
      `https://avatars.dicebear.com/api/bottts/${Math.random()
        .toString(36)
        .substring(2, 10)}.svg`,
      // DiceBear Avataaars - Cartoon style avatars
      `https://avatars.dicebear.com/api/avataaars/${Math.random()
        .toString(36)
        .substring(2, 10)}.svg`,
      // UI Avatars - Simple text-based avatars
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&color=fff`,
      // RoboHash - Robot avatars
      `https://robohash.org/${encodeURIComponent(name)}?set=set3&size=150x150`,
    ];

    // Pick a random avatar service
    return services[Math.floor(Math.random() * services.length)];
  }

  async function handleCreateIdentity() {
    setLoading(true);
    try {
      // Create a random name
      const firstNames = ["John", "Jane", "Michael", "Emma", "Robert", "Sarah"];
      const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Davis",
      ];
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;

      // Create a random email
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(
        Math.random() * 100
      )}@example.com`;

      // Create a random phone number
      const phone = `${Math.floor(Math.random() * 900) + 100}-${
        Math.floor(Math.random() * 900) + 100
      }-${Math.floor(Math.random() * 9000) + 1000}`;

      // Generate avatar URL
      const avatarUrl = generateAvatarUrl(fullName);

      const newIdentity = {
        name: fullName,
        email,
        phone,
        avatar: avatarUrl,
      };

      // Store in Supabase
      const { data, error } = await supabase
        .from("identities")
        .insert([newIdentity])
        .select();

      if (error) {
        console.error("Error creating identity:", error);
        showAlert(`Error creating identity: ${error.message}, "error"`);
      } else if (data) {
        setIdentities([...identities, ...data]);
        showAlert("Identity created successfully!", "success");
      }
    } catch (err) {
      console.error("Error creating identity:", err);
      showAlert(`Error creating identity: ${err.message}, "error"`);
    } finally {
      setLoading(false);
    }
  }

  async function handleMakeCall(phoneNumber) {
    if (!apiUrl) {
      showAlert("API URL not configured for making calls", "error");
      return;
    }

    setCallLoading(true);
    try {
      // Format the phone number for Twilio (remove dashes)
      const formattedPhone = phoneNumber.replace(/-/g, "");

      const response = await fetch(`${apiUrl}/make-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: formattedPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate call");
      }

      showAlert(`Call initiated!, "success"`);
    } catch (err) {
      console.error("Error making call:", err);
      showAlert(`Error making call: ${err.message}, "error"`);
    } finally {
      setCallLoading(false);
    }
  }

  function showAlert(message, type = "info") {
    setAlert({ open: true, message, type });
  }

  function handleCloseAlert() {
    setAlert({ ...alert, open: false });
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          backgroundColor: "#0f0f0f",
          borderRadius: "8px",
          padding: "34px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: "2rem",
          marginBottom: "2rem",
          textAlign: "center",
          maxWidth: "100%",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#ffffff",
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
          Fake Identity Generator
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreateIdentity}
          disabled={loading}
          sx={{
            alignSelf: "center",
            marginTop: "1rem",
            marginBottom: "2rem",
            backgroundColor: "#e91e63",
            "&:hover": {
              backgroundColor: "#c2185b",
            },
          }}
        >
          {loading ? "Loading..." : "Create Identity"}
        </Button>

        <List sx={{ width: "100%" }}>
          {identities.map((identity) => (
            <ListItem
              key={identity.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                borderBottom: "1px solid #333",
                backgroundColor: "#1a1a1a",
                marginBottom: "8px",
                borderRadius: "4px",
              }}
              secondaryAction={
                apiUrl && (
                  <IconButton
                    edge="end"
                    aria-label="call"
                    onClick={() => handleMakeCall(identity.phone)}
                    disabled={callLoading}
                    sx={{ color: "#e91e63" }}
                  >
                    <PhoneIcon />
                  </IconButton>
                )
              }
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <Avatar
                  src={identity.avatar}
                  alt={identity.name}
                  sx={{ width: 50, height: 50 }}
                />
                <Typography sx={{ color: "#ffffff" }}>
                  {identity.name} - {identity.email} - {identity.phone}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Alert for notifications */}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          message={alert.message}
        />
      </Box>
    </Container>
  );
};

export default FakeIdentity;
