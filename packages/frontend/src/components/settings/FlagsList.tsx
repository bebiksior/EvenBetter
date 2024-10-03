import { StyledBox } from "caido-material-ui";
import {
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
} from "@mui/material";
import { useFlags, useSetFlag } from "@/state/flagStore";
import { useState } from "react";
import { useSDK } from "@/context/SDKContext";
import { FeatureFlagTag } from "shared";

export const FlagsList = () => {
  const sdk = useSDK();

  const { flags, isLoading, error } = useFlags();
  const { setFlag } = useSetFlag();

  const [dialogState, setDialogState] = useState<{ open: boolean; flagTag: string | null }>({
    open: false,
    flagTag: null,
  });

  if (isLoading) return <StyledBox>Loading...</StyledBox>;
  if (error) return <StyledBox>Error: {error.message}</StyledBox>;

  const handleDialogOpen = (flagTag: string) => {
    setDialogState({ open: true, flagTag });
  };

  const handleDialogClose = () => {
    setDialogState({ open: false, flagTag: null });
  };

  const handleFlagChange = (flag: typeof flags[0]) => {
    if (flag.requiresReload && flag.enabled) {
      handleDialogOpen(flag.tag);
    } else {
      setFlag({ flag: flag.tag, value: !flag.enabled });
      sdk.window.showToast(`Toggled ${flag.tag} to ${!flag.enabled}`, {
        variant: "success",
      });
    }
  };

  return (
    <StyledBox>
      <Typography variant="h6" className="p-5" fontWeight="bold">
        Features
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Kind</TableCell>
            <TableCell>Requires Refresh?</TableCell>
            <TableCell>Enabled</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flags.map((flag) => (
            <TableRow key={flag.tag}>
              <TableCell>{flag.tag}</TableCell>
              <TableCell>{flag.description}</TableCell>
              <TableCell>{flag.kind}</TableCell>
              <TableCell>{flag.requiresReload ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Switch
                  checked={flag.enabled}
                  onChange={() => handleFlagChange(flag)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={dialogState.open}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Flag Change"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Disabling this flag will require a page reload. Are you sure you want to change it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => {
            if (dialogState.flagTag) {
              setFlag({ flag: dialogState.flagTag as FeatureFlagTag, value: false });
              window.location.reload();
            }
          }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </StyledBox>
  );
};
