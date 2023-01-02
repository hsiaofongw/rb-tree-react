import { Box } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type LocationType = ReturnType<typeof useLocation>;
const useGoToUrl = (location_: LocationType) => {
  useEffect(() => {
    const searchObj = new URLSearchParams(location_.search);
    const url = searchObj.get("url");
    if (url) {
      window.open(url, "_self");
    }
  }, [location_]);
};

export const RedirectToExternalSite = () => {
  const location_ = useLocation();
  useGoToUrl(location_);
  return <Box>Please wait...</Box>;
};
