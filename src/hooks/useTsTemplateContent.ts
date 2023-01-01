import axios from "axios";
import { useQuery } from "react-query";

export const useTsTemplateContent = () => {
  const templateFilename = "template.ts";
  const res = useQuery([templateFilename], () =>
    axios.get(templateFilename).then((res) => res.data)
  );
  return res;
};
