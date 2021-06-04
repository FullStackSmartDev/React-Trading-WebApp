import React, { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import Vimeo from "@u-wave/react-vimeo";
import Button from "./Button";

const VideoLink = (props) => {
  const [open, setOpen] = useState(false);
  const { colorScheme } = props;
  return (
    <div>
      <Button
        colorScheme={colorScheme}
        className="link"
        onClick={() => setOpen(true)}
      >
        <svg
          width="8"
          height="10"
          viewBox="0 0 8 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: "10px" }}
        >
          <path
            d="M7.5 4.13397C8.16667 4.51887 8.16667 5.48113 7.5 5.86603L1.5 9.33013C0.833334 9.71503 0 9.2339 0 8.4641V1.5359C0 0.766098 0.833333 0.284973 1.5 0.669873L7.5 4.13397Z"
            fill="white"
          />
        </svg>
        Watch the video
      </Button>
      <Backdrop
        open={open}
        onClick={() => setOpen(false)}
        style={{ zIndex: 2, color: "#fff" }}
      >
        <Vimeo
          video={props.link}
          width={window.innerWidth * 0.9}
          height={window.innerHeight * 0.9}
        />
      </Backdrop>
    </div>
  );
};

export default VideoLink;
