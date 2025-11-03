import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Launchly</h1>
      <p className="text-lg mb-4">
        Deploy websites automatically with SSL & domain setup.
      </p>
      <div className="mt-8">
        <Image
          src="/og-launchly.png"
          alt="Launchly Logo"
          width={200}
          height={200}
        />
      </div>
    </main>
  );
}
