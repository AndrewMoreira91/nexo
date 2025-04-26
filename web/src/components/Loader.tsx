import { DotLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className="h-dvh flex items-center justify-center">
      <DotLoader
        color="#3471ff"
        size={350}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default Loader
