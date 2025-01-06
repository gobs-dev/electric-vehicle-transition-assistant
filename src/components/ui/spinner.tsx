import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const Spinner = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "grid h-full w-full place-items-center text-primary",
      className
    )}
    aria-live="polite"
    aria-busy="true"
  >
    <LoaderCircle className="h-10 w-10 animate-spin" aria-hidden="true" />
    <span className="sr-only">Loading...</span>
  </div>
);

export default Spinner;
