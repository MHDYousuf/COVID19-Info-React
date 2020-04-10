import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../api/fetchData";
import { makeStyles } from "@material-ui/core/styles";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Badge,
  Divider,
  Box,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { numberWithCommas } from "../utils/format";
import clx from "classnames";
const useStyles = makeStyles({
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem",
  },
  absolutePos: {
    position: "absolute",
    bottom: 0,
  },
  root: {
    minWidth: 220,
    margin: "0.5rem",
    borderBottom: "var(--border-bottom)",
  },
  title: {
    fontSize: 14,
    textTransform: "uppercase",
    color: "var(--color)",
  },
  pos: {
    marginBottom: 12,
  },
  badge: {
    "& span": {
      transform: "scale(1) translate(100%, 0%)",
      background: "var(--background)",
    },
  },
});

const red = {
  "--background": "#e74c3c",
  "--color": "#e74c3c",
  "--border-bottom": "5px solid #e74c3c",
};
const orange = {
  "--background": "#f39c12",
  "--color": "#f39c12",
  "--border-bottom": "5px solid #f39c12",
};
const green = {
  "--background": "#2ecc71",
  "--color": "#2ecc71",
  "--border-bottom": "5px solid #2ecc71",
};

export default function Cards() {
  const { timeline, getTimelineDetails } = useContext(GlobalContext);

  useEffect(() => {
    getTimelineDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deaths = {
    title: "Death",
    current: timeline.deaths,
    new: timeline.new_deaths,
    date: timeline.updated_at,
  };
  const confirmed = {
    title: "Confirmed",
    current: timeline.confirmed,
    new: timeline.new_confirmed,
    date: timeline.updated_at,
  };
  const recovered = {
    title: "Recovered",
    current: timeline.recovered,
    new: timeline.new_recovered,
    date: timeline.updated_at,
  };
  const matches = useMediaQuery("(max-width:998px)");
  const classes = useStyles();
  if (timeline.length === 0) {
    return (
      <Grid
        className={
          matches
            ? classes.cardContainer
            : clx(classes.cardContainer, classes.absolutePos)
        }
      >
        <Box pt={0.5}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      </Grid>
    );
  }
  // console.log(timeline);
  return (
    <Grid
      className={
        matches
          ? classes.cardContainer
          : clx(classes.cardContainer, classes.absolutePos)
      }
    >
      {deaths.current === undefined ? (
        <Box pt={0.5}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      ) : (
        <>
          <CardComponent classes={classes} colors={red} data={deaths} />
          <CardComponent classes={classes} colors={orange} data={confirmed} />
          <CardComponent classes={classes} colors={green} data={recovered} />
        </>
      )}
    </Grid>
  );
}

function CardComponent({ classes, data, colors }) {
  const [color, setColor] = useState(colors);
  const defaultProps = {
    color: "secondary",
    children: (
      <Typography variant="h5" component="h2">
        {numberWithCommas(data.current)}
      </Typography>
    ),
  };
  const BadgeComponent = () => (
    <>
      {numberWithCommas(data.new)}
      <ArrowUpwardIcon style={{ fontSize: "0.8rem" }} />
    </>
  );
  return (
    <Grid xs={12} item style={{ margin: "auto" }}>
      <Card className={clx(classes.root)} style={color} variant="outlined">
        <CardContent>
          <Typography className={clx(classes.title)} style={color}>
            {data.title}
          </Typography>
          <Badge
            className={classes.badge}
            style={color}
            badgeContent={<BadgeComponent />}
            max={9999}
            {...defaultProps}
          />
          <Divider />
          <Typography variant="caption">Last Updated:</Typography>
          <Typography variant="overline" component="p">
            {new Date(data.date).toTimeString()}
          </Typography>
          <Typography variant="overline">
            {new Date(data.date).toDateString()}{" "}
          </Typography>
        </CardContent>
        {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
      </Card>
    </Grid>
  );
}
