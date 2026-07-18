import AppRouter from "./routes/AppRouter";
import AppVersion from "./components/common/AppVersion";

export default function App() {
  return (
    <>
      <AppRouter />
      <AppVersion />
    </>
  );
}