import { Tooltip, IconButton, Typography, Button, Box } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  linkOfGithubRepo,
  nameOfGithubRepo,
  ownerOfGithubRepo,
} from "../resources/github-resources";

export const HelpEntry = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <>
      <Tooltip placement="top" title={"Click for help"}>
        <IconButton onClick={() => setDialogOpen(true)}>
          <HelpOutlineOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Help & FAQ</DialogTitle>
        <DialogContent>
          <Typography gutterBottom variant="h6">
            What is this?
          </Typography>
          <Typography gutterBottom>
            This is a Data Structure Visulization platform, it can display the
            instance of some obscure and sophisticated data structures in a
            human-friendly manner.
          </Typography>

          <Typography sx={{ marginTop: 2 }} gutterBottom variant="h6">
            How can I use this?
          </Typography>
          <Typography gutterBottom>
            You can write code to manipulate the instance, you can see the
            result after click the 'Execute' button.Besides, this tool can help
            you with checking your understanding of the data structure.
          </Typography>

          <Typography sx={{ marginTop: 2 }} gutterBottom variant="h6">
            What are the prerequisites?
          </Typography>
          <Typography>
            In order to start, you need to have some basic understandings of
            programming, algorithms and data structures, and it will be nice to
            have some TypeScript skills.
          </Typography>

          <Typography sx={{ marginTop: 2 }} gutterBottom variant="h6">
            Is this Open-Source?
          </Typography>
          <Typography gutterBottom>
            Yes, we will happy to see you visit our GitHub Repo:
          </Typography>
          <Typography>
            <GitHubIcon sx={{ verticalAlign: "middle" }} />
            <Box
              component={"a"}
              href={linkOfGithubRepo(ownerOfGithubRepo, nameOfGithubRepo)}
              sx={{ verticalAlign: "middle", marginLeft: "8px" }}
              target={"_blank"}
            >
              {ownerOfGithubRepo}/{nameOfGithubRepo}
            </Box>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setDialogOpen(false)}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
