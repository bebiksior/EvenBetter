import React, { useState, useEffect } from "react";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
  Box,
} from "@mui/material";
import { StyledBox, StyledSplitter } from "caido-material-ui";
import { useSettings, useUpdateSetting } from "@/state/settingsStore";
import { Link, Avatar, Divider } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const fontOptions = [
  "Default",
  "JetBrains Mono",
  "Fira Code",
  "Roboto Mono",
  "Inconsolata",
];

export const Settings = () => {
  const { settings, isLoading, error } = useSettings();
  const { updateSetting, isPending } = useUpdateSetting();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleFontChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    setLocalSettings((prev) => ({ ...prev, customFont: newValue }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (localSettings) {
      if (localSettings.customFont)
        updateSetting({
          key: "customFont",
          value: localSettings.customFont,
        });
      setHasChanges(false);
    }
  };

  return (
    <StyledSplitter vertical defaultSizes={[45, 55]}>
      <StyledBox className="p-5 overflow-y-auto">
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Settings
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="font-select-label">Custom Font</InputLabel>
          <Select
            labelId="font-select-label"
            label="Custom Font"
            value={localSettings?.customFont || ""}
            onChange={handleFontChange}
            disabled={isPending}
          >
            {fontOptions.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Note: Custom Themes are coming soon as a separate plugin.
        </Typography>
      </StyledBox>
      <StyledBox className="p-5 overflow-y-auto">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            About EvenBetter
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<StarIcon />}
            href="https://github.com/bebiksior/evenbetter"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            Star on GitHub
          </Button>
        </Box>
        <Typography variant="body1">
          <strong>EvenBetter</strong> is a collection of tweaks to make Caido
          even better. You can find the source code on{" "}
          <Link
            href="https://github.com/bebiksior/evenbetter"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          .
        </Typography>
        <Typography variant="body1">
          Feel free to contribute to the project :D You can also submit feature
          requests and bugs via the GitHub issues page. I'm always looking for
          new ideas and improvements!
        </Typography>
        <Typography variant="body1">
          Thanks for using EvenBetter. I hope it makes your Caido experience
          better and more efficient.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          color="primary"
        >
          Recent Updates
        </Typography>
        <Typography variant="body1">
          I've recently reworked the entire EvenBetter codebase and will be
          slowly updating it with new features. As part of this update, I've
          decided to separate the <b>Quick SSRF</b> & <b>Custom Themes</b>{" "}
          features into their own plugins. These will be released in the next few
          months.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="textSecondary">
          Your feedback and suggestions are always welcome. My X profile is{" "}
          <Link
            href="https://x.com/bebiksior"
            target="_blank"
            rel="noopener noreferrer"
          >
            bebiksior
          </Link>{" "}
          and my discord handle is <b>bebiks</b>
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Avatar
            src="https://avatars.githubusercontent.com/u/71410238?v=4&size=30"
            alt="bebiks avatar"
            sx={{ mr: 1, width: 30, height: 30 }}
          />
          <Typography variant="body2">
            Made with ❤️ by{" "}
            <Link
              href="https://x.com/bebiksior"
              target="_blank"
              rel="noopener noreferrer"
            >
              bebiks
            </Link>
          </Typography>
        </Box>
      </StyledBox>
    </StyledSplitter>
  );
};
