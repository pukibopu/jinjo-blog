import Image from "next/image";
import { Button } from "@radix-ui/themes"
import { Container } from "@/components/ui/Container";
import Headline from "@/components/Headline";
import { getSettings } from '@/sanity/queries'
import { Photos } from '@/components/Photos'
const BlogHome = async () => {
  const settings = await getSettings()
  return (
    <>
      <Container className="mt-10">
        <Headline />
      </Container>
      {settings.heroPhotos && <Photos photos={settings.heroPhotos} />}
    </>
  );
}

export default BlogHome
