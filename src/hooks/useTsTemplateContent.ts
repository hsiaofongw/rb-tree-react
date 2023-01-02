import axios from "axios";
import { useQuery } from "react-query";

export const useTextContent = (fileUrl: string) => {
  const res = useQuery(["getTextContent", fileUrl], () =>
    axios.get(fileUrl).then((res) => res.data)
  );
  return res;
};
