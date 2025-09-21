import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <div className="flex h-screen items-center justify-center bg-green-600 text-white">
      <Helmet>
        <title>About Mervlot 🌍</title>
        <meta
          name="description"
          content="Learn more about the Mervlot project."
        />
      </Helmet>
      <h1 className="text-4xl font-bold">About Page 🌍</h1>
    </div>
  );
}
