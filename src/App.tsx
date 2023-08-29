import { Layout } from "./components/Layout"
import { Toaster } from "./components/ui/toaster"
import { AppRouter } from "./routes/AppRouter"


const App = () => {
  return (
    <Layout>
      <Toaster />
      <AppRouter />
    </Layout>
  )
}
export default App