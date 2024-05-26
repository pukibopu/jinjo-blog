import Image from "next/image";
import {Button} from "@radix-ui/themes"
import { Container } from "@/components/ui/Container";
import Headline from "@/components/Headline";
export default function Home() {
  return (
    <>
    <Container className="mt-10">
        <Headline />
      </Container>
    </>
  );
}
