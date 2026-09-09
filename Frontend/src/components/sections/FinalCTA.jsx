import { Link } from "react-router-dom";
import Button from "../ui/Button";
import ImageTile from "../ui/ImageTile";

export default function FinalCTA() {
  return (
    <section className="container-kare mt-24 sm:mt-32">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-clay-500">
        <div className="absolute inset-0 opacity-25">
          <ImageTile keywords="rural india village community" alt="" seed="1200x500" className="w-full h-full" />
        </div>
        <div className="relative container-kare py-16 sm:py-20 flex flex-col items-center text-center gap-5">
          <h2 className="font-display text-3xl sm:text-4xl text-cream text-balance max-w-xl">
            Let's build stronger local communities together.
          </h2>
          <p className="text-cream/85 max-w-md">
            Whether you're looking for help or ready to offer your skills, Karya makes the first step simple.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Button as={Link} to="/register" variant="dark" icon>
              Get started
            </Button>
            <Button as={Link} to="/contact" variant="ghost">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
