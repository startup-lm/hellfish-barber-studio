import Image from "next/image";
import HeroActions from "./HeroActions";

export default function Hero() {
  return (
    <section className="relative h-80 sm:h-96 flex items-center justify-center text-center overflow-hidden">
      <Image src="/images/home.jpg" alt="Hellfish Barberstudio fondo" fill className="object-cover object-top sm:object-center filter brightness-30" priority />

      <div className="relative z-10 space-y-3 px-4">
        <h1 className="text-5xl sm:text-6xl font-bold">
          Hellfish<br />
          Barberstudio
        </h1>
        <p className="text-xl sm:text-2xl sm:text-2xl text-[var(--secondary)]">
          
        </p>

        <HeroActions />
      </div>
    </section>
  );
}
