import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import ImageTile from "../components/ui/ImageTile";

export default function WorkDetail() {
  const { projectId } = useParams();
  const project = null;

  if (!project) {
    return (
      <div className="pt-40 container-kare text-center">
        <p className="text-charcoal/60">We couldn't find that story.</p>
        <Button as={Link} to="/work" className="mt-4" variant="outline">Back to work</Button>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-40 container-kare max-w-3xl">
      <Link to="/work" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6">
        <ArrowLeft size={15} /> Back to work
      </Link>
      <span className="text-sm text-olive-700 font-medium">{project.category} · {project.community}</span>
      <h1 className="font-display text-3xl sm:text-4xl mt-2 mb-6 text-balance">{project.title}</h1>
      <div className="rounded-[2rem] overflow-hidden aspect-[16/9] mb-8">
        <ImageTile keywords={project.image} alt={project.title} seed="900x500" className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl mb-2">The challenge</h2>
          <p className="text-charcoal/70 leading-relaxed">{project.challenge}</p>
        </div>
        <div>
          <h2 className="font-display text-xl mb-2">The approach</h2>
          <p className="text-charcoal/70 leading-relaxed">{project.solution}</p>
        </div>
        <div>
          <h2 className="font-display text-xl mb-2">The result</h2>
          <p className="text-charcoal/70 leading-relaxed">{project.result}</p>
        </div>
      </div>
    </div>
  );
}
