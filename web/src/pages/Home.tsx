import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-blue-600 text-white">
      <Helmet>
        <title>Welcome to Mervlot 🚀</title>
        <meta
          name="description"
          content="Mervlot homepage — explore the future."
        />
      </Helmet>
      <h1 className="text-4xl font-bold">Welcome to Mervlot 🚀</h1>
    </div>
  );
}
