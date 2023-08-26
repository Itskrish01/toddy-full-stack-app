import { Layout } from "./components/Layout"
import { AppRouter } from "./routes/AppRouter"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <Layout>
      <Toaster position="top-right" />
      <AppRouter />
    </Layout>
  )
}
export default App