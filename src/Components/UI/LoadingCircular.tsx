import { CircularProgress } from "@mui/material";

function LoadingCircular() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <CircularProgress />
    </div>
  )
}

export default LoadingCircular