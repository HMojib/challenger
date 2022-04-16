import React from "react";
import { Container, Paper, Box } from "@material-ui/core";
import SignUpHeader from "./SignUpHeader";

const SignUp = () => (
  <Container maxWidth="sm">
    <Paper elevation={3}>
      <Box padding="40px">
        <SignUpHeader />
      </Box>
    </Paper>
  </Container>
);

export default SignUp;
