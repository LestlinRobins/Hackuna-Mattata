import React from "react";
import FakeIdentity from "./FakeIdentity";
import { Container, Typography, Box } from "@mui/material";

function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Fake Identity Generator App
        </Typography>
        <FakeIdentity />
      </Box>
    </Container>
  );
}

export default App;