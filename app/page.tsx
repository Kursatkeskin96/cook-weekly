import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import 'react-toastify/dist/ReactToastify.css';


export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <HeroSection />
    </div>
  );
}
