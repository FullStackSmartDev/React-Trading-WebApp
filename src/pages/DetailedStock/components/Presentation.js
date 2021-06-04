import React, { useEffect, useState } from "react";

const Presentation = ({ presentations, ...rest }) => {
  const [url, setUrl] = useState(presentations?.slice(-1).pop()?.url);
  useEffect(() => {
    setUrl(presentations?.slice(-1).pop()?.url);
  }, [presentations]);

  return (
    <object
      style={{ width: "100%", height: "100%" }}
      data={url}
      type="application/pdf"
    >
      <embed src={url} type="application/pdf" />
    </object>
  );
};

export default Presentation;
