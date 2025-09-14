import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // ✅ import component-specific CSS
import {
  Container,
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("None");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!emailContent) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8081/api/email/generate",
        { emailContent, tone }
      );
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setTone(event.target.value);
  };

  const handleCopy = () => {
    if (generatedReply) {
      navigator.clipboard.writeText(generatedReply);
      alert("Copied to clipboard!");
    }
  };

  return (
    <Container className="app-container">
      <Typography variant="h3" component="h1" className="app-header">
        Email Reply Generator
      </Typography>

      <Paper className="card">
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className="text-field"
        />

        <FormControl fullWidth className="select-field">
          <InputLabel id="tone-select-label">Tone (Optional)</InputLabel>
          <Select
            labelId="tone-select-label"
            id="tone-select"
            value={tone}
            label="Tone"
            onChange={handleChange}
          >
            <MenuItem value={"Professional"}>Professional</MenuItem>
            <MenuItem value={"Formal"}>Formal</MenuItem>
            <MenuItem value={"Friendly"}>Friendly</MenuItem>
            <MenuItem value={"None"}>None</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          className="button button-contained"
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Generate Reply"
          )}
        </Button>
      </Paper>

      {generatedReply && (
        <Paper className="card">
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={generatedReply}
            inputProps={{ readOnly: true }}
            className="text-field"
          />
          <Button
            variant="outlined"
            onClick={handleCopy}
            className="button button-outlined"
          >
            Copy to clipboard
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default App;
