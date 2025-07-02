import { ContainerCenter } from "@/components/customized/container-center";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PageHome() {
  return (
    <ContainerCenter>
      <div className="h-screen flex justify-center items-center">
        <Button className="mx-auto" asChild>
          <Link href="/private">Home</Link>
        </Button>
      </div>
    </ContainerCenter>
  );
}
