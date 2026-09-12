import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import ImageTile from "../components/ui/ImageTile";

export default function ResourceDetail() {
  const { resourceId } = useParams();
  const resource = null;

  if (!resource) {
    return (
      <div className="pt-40 container-kare text-center">
        <p className="text-charcoal/60">We couldn't find that resource.</p>
        <Button as={Link} to="/resources" className="mt-4" variant="outline">Back to resources</Button>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-40 container-kare max-w-2xl">
      <Link to="/resources" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6">
        <ArrowLeft size={15} /> Back to resources
      </Link>
      <span className="text-sm text-olive-700 font-medium">{resource.category}</span>
      <h1 className="font-display text-3xl sm:text-4xl mt-2 mb-6 text-balance">{resource.title}</h1>
      <div className="rounded-[2rem] overflow-hidden aspect-[16/9] mb-8">
        <ImageTile keywords={resource.image} alt={resource.title} seed="900x500" className="w-full h-full" />
      </div>
      <p className="text-lg text-charcoal/70 leading-relaxed">{resource.description}</p>
      <p className="text-charcoal/60 leading-relaxed mt-4">
        This is a placeholder article body — in production this would hold the full guide,
        written in plain language and available in every supported language.
      </p>
    </div>
  );
}
