import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import { red } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";

import * as cfg from "../constants";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function NFTCard({ tokenId, owner }) {
  const [expanded, setExpanded] = React.useState(false);
  const ownerStr = owner.startsWith("0x")
    ? `Owner: ${owner.slice(0, 4)}...${owner.slice(-4)}`
    : owner;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345, mt: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="nfkeetee">
            KT
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={"NFKeeTees #" + tokenId}
        subheader={ownerStr}
      />
      <CardMedia
        component="img"
        height="194"
        image={cfg.mediaPrefix + tokenId + cfg.mediaSuffix}
        alt={"NFKeeTees #" + tokenId}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          These keetees are quite naughty, but they make up for that with
          cuteness. They love and take care of each other by giving each other
          cat baths, and never fight... wait, scratch that... sometimes fight a
          little but quickly make up and go back to snuggling. Did you catch the
          pun there? If so, "pet" yourself on the back and get yourself an
          NFKeeTee!
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>How to mint:</Typography>
          <Typography paragraph>
            Easy, find the NFKeeTee you want, put its number in the box above,
            and click Mint.
          </Typography>
          <Typography paragraph>
            Note: you have to be on the super-exclusive whitelist to be able to
            mint, and even then you can mint only one.
          </Typography>
          <Typography paragraph>
            The further down the list you are, the longer you will need to wait
            to be able to mint. Yes, we know, life isn't always fair!
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
